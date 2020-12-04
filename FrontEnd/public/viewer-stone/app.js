/**
 * Stone of Orthanc
 * Copyright (C) 2012-2016 Sebastien Jodogne, Medical Physics
 * Department, University Hospital of Liege, Belgium
 * Copyright (C) 2017-2020 Osimis S.A., Belgium
 *
 * This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 **/


var CONFIGURATION_SOURCE = 'configuration.json';
var WASM_SOURCE = 'StoneWebViewer.js';
  
var COLORS = [ 'blue', 'red', 'green', 'yellow', 'violet' ];
var SERIES_INSTANCE_UID = '0020,000e';
var STUDY_INSTANCE_UID = '0020,000d';
var STUDY_DESCRIPTION = '0008,1030';
var STUDY_DATE = '0008,0020';
var PATIENT_ID = '0010,0020';
var PATIENT_NAME = '0010,0010';
var SERIES_NUMBER = '0020,0011';
var SERIES_DESCRIPTION = '0008,103e';
var MODALITY = '0008,0060';

// Registry of the PDF series for which the instance metadata is still waiting
var pendingSeriesPdf_ = {};


function getParameterFromUrl(key) {
  var url = window.location.search.substring(1);
  var args = url.split('&');
  for (var i = 0; i < args.length; i++) {
    var arg = args[i].split('=');
    if (arg[0] == key) {
      return arg[1];
    }
  }
}


// https://stackoverflow.com/a/21797381/881731
function Base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}


function SaveDataUriScheme(filename, dataUriScheme) {
  var mimeType = dataUriScheme.split(',')[0].split(':')[1].split(';')[0];
  var base64 = dataUriScheme.split(',')[1];

  var blob = new Blob([ Base64ToArrayBuffer(base64) ], {
    type: mimeType
  });

  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};


// Check out "enum WebViewerAction" in "StoneWebViewer.cpp" for the
// possible values
function ConvertMouseAction(config, defaultAction)
{
  if (config === undefined) {
    return defaultAction;
  }
  if (config == "Windowing") {
    return stone.WebViewerAction.WINDOWING;
  }
  else if (config == "Zoom") {
    return stone.WebViewerAction.ZOOM;
  }
  else if (config == "Pan") {
    return stone.WebViewerAction.PAN;
  }
  else if (config == "Rotate") {
    return stone.WebViewerAction.ROTATE;
  }
  else if (config == "Crosshair") {
    return stone.WebViewerAction.CROSSHAIR;
  }
  else {
    alert('Unsupported mouse action in the configuration file: ' + config);
    return stone.WebViewerAction.PAN;
  }
}


/**
 * Enable support for tooltips in Bootstrap. This function must be
 * called after each modification to the DOM that introduces new
 * tooltips (e.g. after loading studies).
 **/
function RefreshTooltips()
{
  $('[data-toggle="tooltip"]').tooltip({
    placement: 'bottom',
    container: 'body',
    trigger: 'hover'
  });
}



Vue.component('viewport', {
  props: [ 'left', 'top', 'width', 'height', 'canvasId', 'active', 'content', 'viewportIndex',
           'showInfo', 'globalConfiguration' ],
  template: '#viewport-template',
  data: function () {
    return {
      stone: stone,  // To access global object "stone" from "index.html"
      status: 'waiting',
      currentFrame: 0,
      numberOfFrames: 0,
      quality: '',
      cineControls: false,
      cineIncrement: 0,
      cineFramesPerSecond: 30,
      cineTimeoutId: null,
      cineLoadingFrame: false,
      videoUri: '',
      windowingCenter: 0, 
      windowingWidth: 0,
      instanceNumber: 0
    }
  },
  watch: {
    currentFrame: function(newVal, oldVal) {
      /**
       * The "FrameUpdated" event has been received, which indicates
       * that the schedule frame has been displayed: The cine loop can
       * proceed to the next frame (check out "CineCallback()").
       **/
      this.cineLoadingFrame = false;
    },
    content: function(newVal, oldVal) {
      this.status = 'loading';
      this.cineControls = false;
      this.cineMode = '';
      this.cineLoadingFrame = false;
      this.cineRate = 30;   // Default value
      this.windowingCenter = 0;
      this.windowingWidth = 0;
      this.instanceNumber = 0;
      
      if (this.cineTimeoutId !== null) {
        clearTimeout(this.cineTimeoutId);
        this.cineTimeoutId = null;
      }

      var studyInstanceUid = newVal.series.tags[STUDY_INSTANCE_UID];
      var seriesInstanceUid = newVal.series.tags[SERIES_INSTANCE_UID];
      stone.SpeedUpFetchSeriesMetadata(studyInstanceUid, seriesInstanceUid);

      if ((newVal.series.type == stone.ThumbnailType.IMAGE ||
           newVal.series.type == stone.ThumbnailType.NO_PREVIEW) &&
          newVal.series.complete) {
        this.status = 'ready';

        var that = this;
        Vue.nextTick(function() {
          if (newVal.sopInstanceUid !== undefined &&
              newVal.sopInstanceUid.length > 0) {
            stone.LoadMultipartInstanceInViewport(
              that.canvasId, seriesInstanceUid, newVal.sopInstanceUid);
          }
          else {
            stone.LoadSeriesInViewport(that.canvasId, seriesInstanceUid);
          }
        });
      }
      else if (newVal.series.type == stone.ThumbnailType.PDF) {
        if (newVal.series.complete) {
          /**
           * Series is complete <=> One already knows about the
           * SOPInstanceUIDs that are available in this series. As a
           * consequence,
           * "OrthancStone::SeriesMetadataLoader::Accessor" will not
           * be empty in "ResourcesLoader::FetchPdf()" in C++ code.
           **/
          stone.FetchPdf(studyInstanceUid, seriesInstanceUid);
        } else {
          /**
           * The SOPInstanceUIDs in this series are not known
           * yet. Schedule an "stone.FetchPdf()" one the series
           * metadata is available.
           **/
          pendingSeriesPdf_[seriesInstanceUid] = true;
        }
      }
      else if (newVal.series.type == stone.ThumbnailType.VIDEO) {
        this.status = 'video';
        this.videoUri = '';
        if (this.globalConfiguration.OrthancApiRoot) {
          var that = this;
          axios.post(that.globalConfiguration.OrthancApiRoot + '/tools/find',
                     {
                       Level : 'Instance',
                       Query : {
                         StudyInstanceUID: studyInstanceUid
                       }
                     })
            .then(function(response) {
              if (response.data.length != 1) {
                throw('');
              }
              else {
                that.videoUri = that.globalConfiguration.OrthancApiRoot + '/instances/' + response.data[0] + '/frames/0/raw';
              }
            })
            .catch(function(error) {
              alert('Cannot find the video in Orthanc');
            });
        }
        else {
          console.warn('Videos are not supported by the Stone Web viewer alone yet, the Orthanc REST API is needed');
        }
      }
    }
  },
  mounted: function() {
    var that = this;

    window.addEventListener('FrameUpdated', function(args) {
      if (args.detail.canvasId == that.canvasId) {
        that.currentFrame = (args.detail.currentFrame + 1);
        that.numberOfFrames = args.detail.numberOfFrames;
        that.quality = args.detail.quality;
        that.instanceNumber = args.detail.instanceNumber;
      }
    });

    window.addEventListener('SeriesDetailsReady', function(args) {
      if (args.detail.canvasId == that.canvasId) {
        that.cineFramesPerSecond = stone.GetCineRate(that.canvasId);
      }
    });

    window.addEventListener('PdfLoaded', function(args) {
      var studyInstanceUid = args.detail.studyInstanceUid;
      var seriesInstanceUid = args.detail.seriesInstanceUid;
      var pdfPointer = args.detail.pdfPointer;
      var pdfSize = args.detail.pdfSize;

      if ('tags' in that.content.series &&
          that.content.series.tags[STUDY_INSTANCE_UID] == studyInstanceUid &&
          that.content.series.tags[SERIES_INSTANCE_UID] == seriesInstanceUid) {

        that.status = 'pdf';
        var pdf = new Uint8Array(HEAPU8.subarray(pdfPointer, pdfPointer + pdfSize));

        /**
         * It is not possible to bind an "Uint8Array" to a "props"
         * in the "pdf-viewer" component. So we have to directly
         * call the method of a component. But, "$refs are only
         * populated after the component has been rendered", so we
         * wait for the next rendering.
         * https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements
         **/
        Vue.nextTick(function() {
          that.$refs.pdfViewer.LoadPdf(pdf);
        });
      }
    });

    window.addEventListener('WindowingUpdated', function(args) {
      if (args.detail.canvasId == that.canvasId) {
        that.windowingCenter = args.detail.windowingCenter;
        that.windowingWidth = args.detail.windowingWidth;
      }
    });
  },
  methods: {
    DragDrop: function(event) {
      event.preventDefault();

      // The "parseInt()" is because of Microsoft Edge Legacy (*)
      this.$emit('updated-series', {
        seriesIndex: parseInt(event.dataTransfer.getData('seriesIndex'), 10),
        sopInstanceUid: event.dataTransfer.getData('sopInstanceUid')
      });
    },
    MakeActive: function() {
      this.$emit('selected-viewport');
    },
    DecrementFrame: function(isCircular) {
      return stone.DecrementFrame(this.canvasId, isCircular);
    },
    IncrementFrame: function(isCircular) {
      return stone.IncrementFrame(this.canvasId, isCircular);
    },
    CinePlay: function() {
      this.cineControls = true;
      this.cineIncrement = 1;
      this.UpdateCine();
    },
    CinePause: function() {
      if (this.cineIncrement == 0) {
        // Two clicks on the "pause" button will hide the playback control
        this.cineControls = !this.cineControls;
      } else {
        this.cineIncrement = 0;
        this.UpdateCine();
      }
    },
    CineBackward: function() {
      this.cineControls = true;
      this.cineIncrement = -1;
      this.UpdateCine();
    },
    UpdateCine: function() {
      // Cancel the previous cine loop, if any
      if (this.cineTimeoutId !== null) {
        clearTimeout(this.cineTimeoutId);
        this.cineTimeoutId = null;
      }
      
      this.cineLoadingFrame = false;

      if (this.cineIncrement != 0) {
        this.CineCallback();
      }
    },
    CineCallback: function() {
      var reschedule;
      
      if (this.cineLoadingFrame) {
        /**
         * Wait until the frame scheduled by the previous call to
         * "CineCallback()" is actually displayed (i.e. we monitor the
         * "FrameUpdated" event). Otherwise, the background loading
         * process of the DICOM frames in C++ might be behind the
         * advancement of the current frame, which freezes the
         * display.
         **/
        reschedule = true;
      } else {
        this.cineLoadingFrame = true;
        
        if (this.cineIncrement == 1) {
          reschedule = this.DecrementFrame(true /* circular */);
        } else if (this.cineIncrement == -1) {
          reschedule = this.IncrementFrame(true /* circular */);
        } else {
          reschedule = false;  // Increment is zero, this test is just for safety
        }
      }
      
      if (reschedule) {
        this.cineTimeoutId = setTimeout(this.CineCallback, 1000.0 / this.cineFramesPerSecond);
      }     
    }
  }
});


var app = new Vue({
  el: '#wv',
  data: function() {
    return {
      stone: stone,  // To access global object "stone" from "index.html"
      ready: false,
      leftMode: 'grid',   // Can be 'small', 'grid' or 'full'
      leftVisible: true,
      viewportLayoutButtonsVisible: false,
      mouseActionsVisible: false,
      activeViewport: 0,
      showInfo: true,
      showReferenceLines: true,
      synchronizedBrowsing: false,
      globalConfiguration: {},
      creatingArchive: false,
      archiveJob: '',

      modalWarning: false,
      modalNotDiagnostic: false,
      modalPreferences: false,

      // User preferences (stored in the local storage)
      settingNotDiagnostic: true,
      settingSoftwareRendering: false,

      layoutCountX: 1,
      layoutCountY: 1,
      
      viewport1Width: '100%',
      viewport1Height: '100%',
      viewport1Left: '0%',
      viewport1Top: '0%',
      viewport1Visible: true,
      viewport1Content: { series: {} },
      
      viewport2Width: '100%',
      viewport2Height: '100%',
      viewport2Left: '0%',
      viewport2Top: '0%',
      viewport2Visible: false,
      viewport2Content: { series: {} },

      viewport3Width: '100%',
      viewport3Height: '100%',
      viewport3Left: '0%',
      viewport3Top: '0%',
      viewport3Visible: false,
      viewport3Content: { series: {} },

      viewport4Width: '100%',
      viewport4Height: '100%',
      viewport4Left: '0%',
      viewport4Top: '0%',
      viewport4Visible: false,
      viewport4Content: { series: {} },

      showWindowing: false,
      windowingPresets: [],

      selectedStudies: [],
      series: [],
      studies: [],
      seriesIndex: {},  // Maps "SeriesInstanceUID" to "index in this.series"
      multiframeInstanceThumbnails: {}
    }
  },
  computed: {
    getSelectedStudies() {
      var s = '';
      for (var i = 0; i < this.studies.length; i++) {
        if (this.studies[i].selected) {
          if (s.length > 0)
            s += ', ';
          s += this.studies[i].tags[STUDY_DESCRIPTION];

          var date = this.studies[i].tags[STUDY_DATE];
          if (date.length > 0) {
            s += ' [' + this.FormatDate(date) + ']';
          }
        }
      }
      if (s.length == 0) 
        return '...';
      else
        return s;
    }
  },
  watch: { 
    leftVisible: function(newVal, oldVal) {
      this.FitContent();
    },
    showReferenceLines: function(newVal, oldVal) {
      stone.ShowReferenceLines(newVal ? 1 : 0);
    },
    synchronizedBrowsing: function(newVal, oldVal) {
      stone.SetSynchronizedBrowsingEnabled(newVal ? 1 : 0);
    },
    settingNotDiagnostic: function(newVal, oldVal) {
      localStorage.settingNotDiagnostic = (newVal ? '1' : '0');
    },
    settingSoftwareRendering: function(newVal, oldVal) {
      localStorage.settingSoftwareRendering = (newVal ? '1' : '0');
    }
  },
  methods: {
    FitContent: function() {
      // This function can be used even if WebAssembly is not initialized yet
      if (typeof stone._AllViewportsUpdateSize !== 'undefined') {
        this.$nextTick(function () {
          stone.AllViewportsUpdateSize(true /* fit content */);
        });
      }
    },
    
    GetActiveSeries: function() {
      var s = [];

      if ('tags' in this.viewport1Content.series)
        s.push(this.viewport1Content.series.tags[SERIES_INSTANCE_UID]);

      if ('tags' in this.viewport2Content.series)
        s.push(this.viewport2Content.series.tags[SERIES_INSTANCE_UID]);

      if ('tags' in this.viewport3Content.series)
        s.push(this.viewport3Content.series.tags[SERIES_INSTANCE_UID]);

      if ('tags' in this.viewport4Content.series)
        s.push(this.viewport4Content.series.tags[SERIES_INSTANCE_UID]);

      return s;
    },

    GetActiveMultiframeInstances: function() {
      var s = [];

      if ('sopInstanceUid' in this.viewport1Content)
        s.push(this.viewport1Content.sopInstanceUid);

      if ('sopInstanceUid' in this.viewport2Content)
        s.push(this.viewport2Content.sopInstanceUid);

      if ('sopInstanceUid' in this.viewport3Content)
        s.push(this.viewport3Content.sopInstanceUid);

      if ('sopInstanceUid' in this.viewport4Content)
        s.push(this.viewport4Content.sopInstanceUid);

      return s;
    },

    GetActiveCanvas: function() {
      if (this.activeViewport == 1) {
        return 'canvas1';
      }
      else if (this.activeViewport == 2) {
        return 'canvas2';
      }
      else if (this.activeViewport == 3) {
        return 'canvas3';
      }
      else if (this.activeViewport == 4) {
        return 'canvas4';
      }
      else {
        return 'canvas1';
      }
    },

    SetResources: function(sourceStudies, sourceSeries) {     
      var indexStudies = {};

      var studies = [];
      var posColor = 0;

      for (var i = 0; i < sourceStudies.length; i++) {
        var studyInstanceUid = sourceStudies[i][STUDY_INSTANCE_UID];
        if (studyInstanceUid !== undefined) {
          if (studyInstanceUid in indexStudies) {
            console.error('Twice the same study: ' + studyInstanceUid);
          } else {
            indexStudies[studyInstanceUid] = studies.length;

            var isSelected = (this.selectedStudies.length == 0 ? true :
                              this.selectedStudies.includes(studyInstanceUid));
            
            studies.push({
              'studyInstanceUid' : studyInstanceUid,
              'series' : [ ],
              'color' : COLORS[posColor],
              'selected' : isSelected,
              'tags' : sourceStudies[i]
            });

            posColor = (posColor + 1) % COLORS.length;
          }
        }
      }

      var series = [];
      var seriesIndex = {};

      for (var i = 0; i < sourceSeries.length; i++) {
        var studyInstanceUid = sourceSeries[i][STUDY_INSTANCE_UID];
        var seriesInstanceUid = sourceSeries[i][SERIES_INSTANCE_UID];
        if (studyInstanceUid !== undefined &&
            seriesInstanceUid !== undefined) {
          if (studyInstanceUid in indexStudies) {
            seriesIndex[seriesInstanceUid] = series.length;
            var study = studies[indexStudies[studyInstanceUid]];
            study.series.push(i);
            series.push({
              'numberOfFrames' : 0,
              'complete' : false,
              'type' : stone.ThumbnailType.LOADING,
              'color': study.color,
              'tags': sourceSeries[i],
              'multiframeInstances': null
            });
          }
        }
      }
      
      this.studies = studies;
      this.series = series;
      this.seriesIndex = seriesIndex;
      this.ready = true;

      Vue.nextTick(function() {
        RefreshTooltips();
      });
    },
    
    SeriesDragStart: function(event, seriesIndex) {
      // It is necessary to use ".toString()" for Microsoft Edge Legacy (*)
      event.dataTransfer.setData('seriesIndex', seriesIndex.toString());
    },

    MultiframeInstanceDragStart: function(event, seriesIndex, sopInstanceUid) {
      event.dataTransfer.setData('seriesIndex', seriesIndex.toString());
      event.dataTransfer.setData('sopInstanceUid', sopInstanceUid.toString());
    },

    SetViewportSeriesInstanceUid: function(viewportIndex, seriesInstanceUid) {
      if (seriesInstanceUid in this.seriesIndex) {
        this.SetViewportSeries(viewportIndex, {
          seriesIndex: this.seriesIndex[seriesInstanceUid]
        });
      }
    },
    
    SetViewportSeries: function(viewportIndex, info) {
      var series = this.series[info.seriesIndex];
      
      if (viewportIndex == 1) {
        this.viewport1Content = {
          series: series,
          sopInstanceUid: info.sopInstanceUid
        };
      }
      else if (viewportIndex == 2) {
        this.viewport2Content = {
          series: series,
          sopInstanceUid: info.sopInstanceUid
        };
      }
      else if (viewportIndex == 3) {
        this.viewport3Content = {
          series: series,
          sopInstanceUid: info.sopInstanceUid
        };
      }
      else if (viewportIndex == 4) {
        this.viewport4Content = {
          series: series,
          sopInstanceUid: info.sopInstanceUid
        };
      }
    },
    
    ClickSeries: function(seriesIndex) {
      this.SetViewportSeries(this.activeViewport, {
        seriesIndex: seriesIndex
      });
    },
    
    ClickMultiframeInstance: function(seriesIndex, sopInstanceUid) {
      this.SetViewportSeries(this.activeViewport, {
        seriesIndex: seriesIndex,
        sopInstanceUid: sopInstanceUid
      });
    },
    
    HideViewport: function(index) {
      if (index == 1) {
        this.viewport1Visible = false;
      }
      else if (index == 2) {
        this.viewport2Visible = false;
      }
      else if (index == 3) {
        this.viewport3Visible = false;
      }
      else if (index == 4) {
        this.viewport4Visible = false;
      }
    },
    
    ShowViewport: function(index, left, top, width, height) {
      if (index == 1) {
        this.viewport1Visible = true;
        this.viewport1Left = left;
        this.viewport1Top = top;
        this.viewport1Width = width;
        this.viewport1Height = height;
      }
      else if (index == 2) {
        this.viewport2Visible = true;
        this.viewport2Left = left;
        this.viewport2Top = top;
        this.viewport2Width = width;
        this.viewport2Height = height;
      }
      else if (index == 3) {
        this.viewport3Visible = true;
        this.viewport3Left = left;
        this.viewport3Top = top;
        this.viewport3Width = width;
        this.viewport3Height = height;
      }
      else if (index == 4) {
        this.viewport4Visible = true;
        this.viewport4Left = left;
        this.viewport4Top = top;
        this.viewport4Width = width;
        this.viewport4Height = height;
      }
    },
    
    SetViewportLayout: function(layout) {
      this.viewportLayoutButtonsVisible = false;
      if (layout == '1x1') {
        this.ShowViewport(1, '0%', '0%', '100%', '100%');
        this.HideViewport(2);
        this.HideViewport(3);
        this.HideViewport(4);
        this.layoutCountX = 1;
        this.layoutCountY = 1;
      }
      else if (layout == '2x2') {
        this.ShowViewport(1, '0%', '0%', '50%', '50%');
        this.ShowViewport(2, '50%', '0%', '50%', '50%');
        this.ShowViewport(3, '0%', '50%', '50%', '50%');
        this.ShowViewport(4, '50%', '50%', '50%', '50%');
        this.layoutCountX = 2;
        this.layoutCountY = 2;
      }
      else if (layout == '2x1') {
        this.ShowViewport(1, '0%', '0%', '50%', '100%');
        this.ShowViewport(2, '50%', '0%', '50%', '100%');
        this.HideViewport(3);
        this.HideViewport(4);
        this.layoutCountX = 2;
        this.layoutCountY = 1;
      }
      else if (layout == '1x2') {
        this.ShowViewport(1, '0%', '0%', '100%', '50%');
        this.ShowViewport(2, '0%', '50%', '100%', '50%');
        this.HideViewport(3);
        this.HideViewport(4);
        this.layoutCountX = 1;
        this.layoutCountY = 2;
      }

      this.FitContent();
    },

    UpdateSeriesThumbnail: function(seriesInstanceUid) {
      if (seriesInstanceUid in this.seriesIndex) {
        var index = this.seriesIndex[seriesInstanceUid];
        var series = this.series[index];

        var type = stone.LoadSeriesThumbnail(seriesInstanceUid);
        series.type = type;

        if (type == stone.ThumbnailType.IMAGE) {
          series.thumbnail = stone.GetStringBuffer();
        }

        // https://fr.vuejs.org/2016/02/06/common-gotchas/#Why-isn%E2%80%99t-the-DOM-updating
        this.$set(this.series, index, series);
      }
    },

    UpdateIsSeriesComplete: function(studyInstanceUid, seriesInstanceUid) {
      if (seriesInstanceUid in this.seriesIndex) {
        var index = this.seriesIndex[seriesInstanceUid];
        var series = this.series[index];

        var oldComplete = series.complete;
        
        series.complete = stone.IsSeriesComplete(seriesInstanceUid);
        
        if (!oldComplete &&
            series.complete)
        {
          series.numberOfFrames = stone.GetSeriesNumberOfFrames(seriesInstanceUid);
          
          if (seriesInstanceUid in pendingSeriesPdf_) {
            stone.FetchPdf(studyInstanceUid, seriesInstanceUid);
            delete pendingSeriesPdf_[seriesInstanceUid];
          }

          if (stone.LoadMultiframeInstancesFromSeries(seriesInstanceUid)) {
            series.multiframeInstances = JSON.parse(stone.GetStringBuffer());
          }
        }

        // https://fr.vuejs.org/2016/02/06/common-gotchas/#Why-isn%E2%80%99t-the-DOM-updating
        this.$set(this.series, index, series);

        if ('tags' in this.viewport1Content.series &&
            this.viewport1Content.series.tags[SERIES_INSTANCE_UID] == seriesInstanceUid) {
          this.$set(this.viewport1Content.series, series);
        }

        if ('tags' in this.viewport2Content.series &&
            this.viewport2Content.series.tags[SERIES_INSTANCE_UID] == seriesInstanceUid) {
          this.$set(this.viewport2Content.series, series);
        }

        if ('tags' in this.viewport3Content.series &&
            this.viewport3Content.series.tags[SERIES_INSTANCE_UID] == seriesInstanceUid) {
          this.$set(this.viewport3Content.series, series);
        }

        if ('tags' in this.viewport4Content.series &&
            this.viewport4Content.series.tags[SERIES_INSTANCE_UID] == seriesInstanceUid) {
          this.$set(this.viewport4Content.series, series);
        }
      }
    },

    SetWindowing: function(center, width) {
      this.showWindowing = false;
      var canvas = this.GetActiveCanvas();
      if (canvas != '') {
        stone.SetWindowing(canvas, center, width);
      }
    },

    InvertContrast: function() {
      var canvas = this.GetActiveCanvas();
      if (canvas != '') {
        stone.InvertContrast(canvas);
      }
    },

    FlipX: function() {
      var canvas = this.GetActiveCanvas();
      if (canvas != '') {
        stone.FlipX(canvas);
      }
    },

    FlipY: function() {
      var canvas = this.GetActiveCanvas();
      if (canvas != '') {
        stone.FlipY(canvas);
      }
    },

    ApplyPreferences: function() {
      this.modalPreferences = false;

      if ((stone.IsSoftwareRendering() != 0) != this.settingSoftwareRendering) {
        document.location.reload();
      }
    },

    HideAllTooltips: function() {
      $('[data-toggle="tooltip"]').tooltip('hide');
    },

    SetMouseButtonActions: function(left, middle, right) {
      this.mouseActionsVisible = false;
      stone.SetMouseButtonActions(left, middle, right);
    },

    LoadOsiriXAnnotations: function(xml, clearPrevious)
    {
      if (stone.LoadOsiriXAnnotations(xml, clearPrevious)) {
        var seriesInstanceUid = stone.GetStringBuffer();

        this.SetViewportLayout('1x1');
        this.leftVisible = false;
        this.SetViewportSeriesInstanceUid(1, seriesInstanceUid);
          
        stone.FocusFirstOsiriXAnnotation('canvas1');
      }
    },

    ToggleWindowing: function()
    {
      if (this.showWindowing)
      {
        this.showWindowing = false;
      }
      else
      {
        stone.LoadWindowingPresets(this.GetActiveCanvas());
        this.windowingPresets = JSON.parse(stone.GetStringBuffer());

        var p = $('#windowing-popover').last();
        var top = p.offset().top + p.height() + 10;
        $('#windowing-content').css('top', top);
        //$('#windowing-content').css('right', '10');
        //$('#windowing-content').css('left', 'auto');

        this.showWindowing = true;
      }
    },
    
    FormatDate: function(date)
    {
      if (date === undefined ||
          date.length == 0) {
        return '';
      }
      else {
        var format = this.globalConfiguration['DateFormat'];
        if (format === undefined) {
          // No configuration for the date format, use the DICOM tag as such
          return date;
        }
        else {
          var year = date.replace(/^([0-9]{4})([0-9]{2})([0-9]{2})$/, '$1');
          var month = date.replace(/^([0-9]{4})([0-9]{2})([0-9]{2})$/, '$2');
          var day = date.replace(/^([0-9]{4})([0-9]{2})([0-9]{2})$/, '$3');
          return format.replace(/YYYY/g, year).replace(/MM/g, month).replace(/DD/g, day);
        }
      }
    },

    DownloadJpeg: function()
    {
      var canvas = document.getElementById(this.GetActiveCanvas());
      SaveDataUriScheme('StoneWebViewerScreenshot.jpg', canvas.toDataURL('image/jpeg'));
    },

    SetCombinedToolActions: function()
    {
      var left = stone.WebViewerAction.WINDOWING;
      var middle = stone.WebViewerAction.PAN;
      var right = stone.WebViewerAction.ZOOM;

      var behaviour = this.globalConfiguration['CombinedToolBehaviour'];
      if (behaviour !== undefined) {
        left = ConvertMouseAction(behaviour['LeftMouseButton'], left);
        middle = ConvertMouseAction(behaviour['MiddleMouseButton'], middle);
        right = ConvertMouseAction(behaviour['RightMouseButton'], right);
      }
      
      this.SetMouseButtonActions(left, middle, right);
    },

    CheckIsDownloadComplete: function()
    {
      if (this.creatingArchive &&
          this.archiveJob.length > 0) {      

        var that = this;
        axios.get(that.globalConfiguration.OrthancApiRoot + '/jobs/' + that.archiveJob)
          .then(function(response) {
            console.log('Progress of archive job ' + that.archiveJob + ': ' + response.data['Progress'] + '%');
            var state = response.data['State'];
            if (state == 'Success') {
              that.creatingArchive = false;
              var uri = that.globalConfiguration.OrthancApiRoot + '/jobs/' + that.archiveJob + '/archive';

              /**
               * The use of "window.open()" below might be blocked
               * (depending on the browser criteria to block popup).
               * As a consequence, we prefer to set "window.location".
               * https://www.nngroup.com/articles/the-top-ten-web-design-mistakes-of-1999/
               **/
              // window.open(uri, '_blank');
              window.location = uri;
            }
            else if (state == 'Running') {
              setTimeout(that.CheckIsDownloadComplete, 1000);
            }
            else {
              alert('Error while creating the archive in Orthanc: ' + response.data['ErrorDescription']);
              that.creatingArchive = false;
            }
          })
          .catch(function(error) {
            alert('The archive job is not available anymore in Orthanc');
            that.creatingArchive = false;
          });
        }
    },

    DownloadStudy: function(studyInstanceUid)
    {
      console.log('Creating archive for study: ' + studyInstanceUid);

      var that = this;
      axios.post(this.globalConfiguration.OrthancApiRoot + '/tools/lookup', studyInstanceUid)
        .then(function(response) {
          if (response.data.length != 1) {
            throw('');
          }
          else {
            var orthancId = response.data[0]['ID'];
            axios.post(that.globalConfiguration.OrthancApiRoot + '/studies/' + orthancId + '/archive',
                       {
                         'Asynchronous' : true
                       })
              .then(function(response) {
                that.creatingArchive = true;
                that.archiveJob = response.data.ID;
                setTimeout(that.CheckIsDownloadComplete, 1000);
              });
          }
        })
        .catch(function (error) {
          alert('Cannot find the study in Orthanc');
        });
    }
  },
  
  mounted: function() {
    this.SetViewportLayout('1x1');

    if (localStorage.settingNotDiagnostic) {
      this.settingNotDiagnostic = (localStorage.settingNotDiagnostic == '1');
    }
    
    if (localStorage.settingSoftwareRendering) {
      this.settingSoftwareRendering = (localStorage.settingSoftwareRendering == '1');
    }
    
    this.modalNotDiagnostic = this.settingNotDiagnostic;

    var that = this;
    
    window.addEventListener('MultiframeInstanceThumbnailLoaded', function(args) {
      that.$set(that.multiframeInstanceThumbnails, args.detail.sopInstanceUid, args.detail.thumbnail);
    });

    window.addEventListener('ThumbnailLoaded', function(args) {
      //var studyInstanceUid = args.detail.studyInstanceUid;
      var seriesInstanceUid = args.detail.seriesInstanceUid;
      that.UpdateSeriesThumbnail(seriesInstanceUid);
    });

    window.addEventListener('MetadataLoaded', function(args) {
      var studyInstanceUid = args.detail.studyInstanceUid;
      var seriesInstanceUid = args.detail.seriesInstanceUid;
      that.UpdateIsSeriesComplete(studyInstanceUid, seriesInstanceUid);
    });
  }
});



window.addEventListener('StoneInitialized', function() {
  stone.Setup(Module);
  stone.SetDicomWebRoot(app.globalConfiguration.DicomWebRoot,
                        true /* assume "/rendered" is available in DICOMweb (could be a configuration option) */);
  stone.SetSoftwareRendering(localStorage.settingSoftwareRendering == '1');

  if ('DicomCacheSize' in app.globalConfiguration) {
    stone.SetDicomCacheSize(app.globalConfiguration.DicomCacheSize);
  }
  
  console.warn('Stone properly initialized');

  app.SetCombinedToolActions();
  
  var selectedStudies = getParameterFromUrl('selectedStudies');
  var patient = getParameterFromUrl('patient');
  var study = getParameterFromUrl('study');
  var series = getParameterFromUrl('series');

  if (selectedStudies !== undefined) {
    app.selectedStudies = selectedStudies.split(',');
  } else {
    app.selectedStudies = [];
  }

  if (study !== undefined &&
      series !== undefined) {
    console.warn('Loading series: ' + series + ' from study: ' + study);
    stone.FetchSeries(study, series);
    app.leftMode = 'full';
  }
  else {
    var empty = true;

    if (study !== undefined) {
      var studies = study.split(',');
      if (studies.length != 0) {
        empty = false;
        for (var i = 0; i < studies.length; i++) {
          console.warn('Loading study: ' + studies[i]);
          stone.FetchStudy(studies[i]);
        }
      }
    }

    if (patient !== undefined) {
      var patients = patient.split(',');
      if (patients.length != 0) {
        empty = false;
        for (var i = 0; i < patients.length; i++) {
          console.warn('Loading patient: ' + patients[i]);
          stone.FetchPatient(patients[i]);
        }
      }
    }

    if (empty) {
      alert('No study, nor patient was provided in the URL!');
    }
  }
});


window.addEventListener('ResourcesLoaded', function() {
  console.log('resources loaded');

  var studies = [];
  for (var i = 0; i < stone.GetStudiesCount(); i++) {
    stone.LoadStudyTags(i);
    studies.push(JSON.parse(stone.GetStringBuffer()));
  }

  var series = [];
  for (var i = 0; i < stone.GetSeriesCount(); i++) {
    stone.LoadSeriesTags(i);
    series.push(JSON.parse(stone.GetStringBuffer()));
  }

  app.SetResources(studies, series);

  for (var i = 0; i < app.series.length; i++) {
    var studyInstanceUid = app.series[i].tags[STUDY_INSTANCE_UID];
    var seriesInstanceUid = app.series[i].tags[SERIES_INSTANCE_UID];
    app.UpdateSeriesThumbnail(seriesInstanceUid);
    app.UpdateIsSeriesComplete(studyInstanceUid, seriesInstanceUid);
  }
});


window.addEventListener('StoneException', function() {
  console.error('Exception catched in Stone');
});




function ParseJsonWithComments(json)
{
  if (typeof(json) == 'string') {
    // https://stackoverflow.com/a/62945875/881731
    return JSON.parse(json.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
                                   (m, g) => g ? "" : m));
  } else {
    return json;
  }
}


$(document).ready(function() {
  RefreshTooltips();

  //app.modalWarning = true;

  axios.get(CONFIGURATION_SOURCE)
    .then(function(response) {
      app.globalConfiguration = ParseJsonWithComments(response.data) ['StoneWebViewer'];

      if (app.globalConfiguration === undefined) {
        console.warn('Empty configuration file');
        app.globalConfiguration = {};
      }

      // Option 1: Loading script using plain HTML
      
      /*
        var script = document.createElement('script');
        script.src = WASM_SOURCE;
        script.type = 'text/javascript';
        document.body.appendChild(script);
      */

      // Option 2: Loading script using AJAX (gives the opportunity to
      // explicitly report errors)

      axios.get(WASM_SOURCE)
        .then(function (response) {
          var script = document.createElement('script');
          script.innerHTML = response.data;
          script.type = 'text/javascript';
          document.body.appendChild(script);
        })
        .catch(function (error) {
          alert('Cannot load the WebAssembly framework');
        });
    })
    .catch(function (error) {
      alert('Cannot load the configuration file');
    });  
});


// "Prevent Bootstrap dropdown from closing on clicks" for the list of
// studies: https://stackoverflow.com/questions/26639346
$('.dropdown-menu').click(function(e) {
  e.stopPropagation();
});


// Disable the selection of text using the mouse
document.onselectstart = new Function ('return false');


window.addEventListener('message', function(e) {
  if ('type' in e.data) {
    if (e.data.type == 'show-osirix-annotations') {
      var expectedOrigin = app.globalConfiguration['ExpectedMessageOrigin'];
      
      if (expectedOrigin === undefined) {
        alert('Dynamic actions are disabled in the Stone Web viewer, ' +
              'set the configuration option "ExpectedMessageOrigin".');
      }    
      else if (expectedOrigin != '*' &&
               e.origin !== expectedOrigin) {
        alert('Bad origin for a dynamic action in the Stone Web viewer: "' + e.origin +
              '", whereas the message must have origin: "' + expectedOrigin + '"');
      }
      else if (e.data.type == 'show-osirix-annotations') {
        var clear = true;  // Whether to clear previous annotations
        if ('clear' in e.data) {
          clear = e.data.clear;
        }
        
        app.LoadOsiriXAnnotations(e.data.xml, clear);
      }
    }
    else {
      console.log('Unknown type of dynamic action in the Stone Web viewer: ' + e.data.type);
    }
  }
});
