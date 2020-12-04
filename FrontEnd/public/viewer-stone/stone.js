
const Stone = function() {
  this.ThumbnailType = {
    IMAGE: 0,
    NO_PREVIEW: 1,
    PDF: 2,
    VIDEO: 3,
    LOADING: 4,
    UNKNOWN: 5
  };

  this.DisplayedFrameQuality = {
    NONE: 0,
    LOW: 1,
    HIGH: 2
  };

  this.WebViewerAction = {
    WINDOWING: 0,
    ZOOM: 1,
    PAN: 2,
    ROTATE: 3,
    CROSSHAIR: 4
  };

  this._SetDicomWebRoot = undefined;
  this._SetDicomWebThroughOrthanc = undefined;
  this._SetDicomCacheSize = undefined;
  this._FetchAllStudies = undefined;
  this._FetchPatient = undefined;
  this._FetchStudy = undefined;
  this._FetchSeries = undefined;
  this._GetStudiesCount = undefined;
  this._GetSeriesCount = undefined;
  this._GetStringBuffer = undefined;
  this._LoadStudyTags = undefined;
  this._LoadSeriesTags = undefined;
  this._LoadSeriesThumbnail = undefined;
  this._SpeedUpFetchSeriesMetadata = undefined;
  this._IsSeriesComplete = undefined;
  this._LoadSeriesInViewport = undefined;
  this._LoadMultipartInstanceInViewport = undefined;
  this._AllViewportsUpdateSize = undefined;
  this._DecrementFrame = undefined;
  this._IncrementFrame = undefined;
  this._GoToFirstFrame = undefined;
  this._GoToLastFrame = undefined;
  this._ShowReferenceLines = undefined;
  this._SetWindowing = undefined;
  this._InvertContrast = undefined;
  this._FlipX = undefined;
  this._FlipY = undefined;
  this._SetSoftwareRendering = undefined;
  this._IsSoftwareRendering = undefined;
  this._SetMouseButtonActions = undefined;
  this._FitForPrint = undefined;
  this._LoadOsiriXAnnotations = undefined;
  this._FocusFirstOsiriXAnnotation = undefined;
  this._FetchPdf = undefined;
  this._GetCineRate = undefined;
  this._GetSeriesNumberOfFrames = undefined;
  this._LoadWindowingPresets = undefined;
  this._SetSynchronizedBrowsingEnabled = undefined;
  this._LoadMultiframeInstancesFromSeries = undefined;
};

Stone.prototype.Setup = function(Module) {
  this._SetDicomWebRoot = Module.cwrap('SetDicomWebRoot', null, [ 'string', 'int' ]);
  this._SetDicomWebThroughOrthanc = Module.cwrap('SetDicomWebThroughOrthanc', null, [ 'string', 'string', 'int' ]);
  this._SetDicomCacheSize = Module.cwrap('SetDicomCacheSize', null, [ 'int' ]);
  this._FetchAllStudies = Module.cwrap('FetchAllStudies', null, [  ]);
  this._FetchPatient = Module.cwrap('FetchPatient', null, [ 'string' ]);
  this._FetchStudy = Module.cwrap('FetchStudy', null, [ 'string' ]);
  this._FetchSeries = Module.cwrap('FetchSeries', null, [ 'string', 'string' ]);
  this._GetStudiesCount = Module.cwrap('GetStudiesCount', 'int', [  ]);
  this._GetSeriesCount = Module.cwrap('GetSeriesCount', 'int', [  ]);
  this._GetStringBuffer = Module.cwrap('GetStringBuffer', 'string', [  ]);
  this._LoadStudyTags = Module.cwrap('LoadStudyTags', null, [ 'int' ]);
  this._LoadSeriesTags = Module.cwrap('LoadSeriesTags', null, [ 'int' ]);
  this._LoadSeriesThumbnail = Module.cwrap('LoadSeriesThumbnail', 'int', [ 'string' ]);
  this._SpeedUpFetchSeriesMetadata = Module.cwrap('SpeedUpFetchSeriesMetadata', null, [ 'string', 'string' ]);
  this._IsSeriesComplete = Module.cwrap('IsSeriesComplete', 'int', [ 'string' ]);
  this._LoadSeriesInViewport = Module.cwrap('LoadSeriesInViewport', 'int', [ 'string', 'string' ]);
  this._LoadMultipartInstanceInViewport = Module.cwrap('LoadMultipartInstanceInViewport', 'int', [ 'string', 'string', 'string' ]);
  this._AllViewportsUpdateSize = Module.cwrap('AllViewportsUpdateSize', null, [ 'int' ]);
  this._DecrementFrame = Module.cwrap('DecrementFrame', 'int', [ 'string', 'int' ]);
  this._IncrementFrame = Module.cwrap('IncrementFrame', 'int', [ 'string', 'int' ]);
  this._GoToFirstFrame = Module.cwrap('GoToFirstFrame', null, [ 'string' ]);
  this._GoToLastFrame = Module.cwrap('GoToLastFrame', null, [ 'string' ]);
  this._ShowReferenceLines = Module.cwrap('ShowReferenceLines', null, [ 'int' ]);
  this._SetWindowing = Module.cwrap('SetWindowing', null, [ 'string', 'int', 'int' ]);
  this._InvertContrast = Module.cwrap('InvertContrast', null, [ 'string' ]);
  this._FlipX = Module.cwrap('FlipX', null, [ 'string' ]);
  this._FlipY = Module.cwrap('FlipY', null, [ 'string' ]);
  this._SetSoftwareRendering = Module.cwrap('SetSoftwareRendering', null, [ 'int' ]);
  this._IsSoftwareRendering = Module.cwrap('IsSoftwareRendering', 'int', [  ]);
  this._SetMouseButtonActions = Module.cwrap('SetMouseButtonActions', null, [ 'int', 'int', 'int' ]);
  this._FitForPrint = Module.cwrap('FitForPrint', null, [  ]);
  this._LoadOsiriXAnnotations = Module.cwrap('LoadOsiriXAnnotations', 'int', [ 'string', 'int' ]);
  this._FocusFirstOsiriXAnnotation = Module.cwrap('FocusFirstOsiriXAnnotation', null, [ 'string' ]);
  this._FetchPdf = Module.cwrap('FetchPdf', null, [ 'string', 'string' ]);
  this._GetCineRate = Module.cwrap('GetCineRate', 'int', [ 'string' ]);
  this._GetSeriesNumberOfFrames = Module.cwrap('GetSeriesNumberOfFrames', 'int', [ 'string' ]);
  this._LoadWindowingPresets = Module.cwrap('LoadWindowingPresets', null, [ 'string' ]);
  this._SetSynchronizedBrowsingEnabled = Module.cwrap('SetSynchronizedBrowsingEnabled', null, [ 'int' ]);
  this._LoadMultiframeInstancesFromSeries = Module.cwrap('LoadMultiframeInstancesFromSeries', 'int', [ 'string' ]);
};

Stone.prototype.SetDicomWebRoot = function(uri, useRendered) {
  this._SetDicomWebRoot(uri, useRendered);
};

Stone.prototype.SetDicomWebThroughOrthanc = function(orthancRoot, serverName, hasRendered) {
  this._SetDicomWebThroughOrthanc(orthancRoot, serverName, hasRendered);
};

Stone.prototype.SetDicomCacheSize = function(sizeMB) {
  this._SetDicomCacheSize(sizeMB);
};

Stone.prototype.FetchAllStudies = function() {
  this._FetchAllStudies();
};

Stone.prototype.FetchPatient = function(patientId) {
  this._FetchPatient(patientId);
};

Stone.prototype.FetchStudy = function(studyInstanceUid) {
  this._FetchStudy(studyInstanceUid);
};

Stone.prototype.FetchSeries = function(studyInstanceUid, seriesInstanceUid) {
  this._FetchSeries(studyInstanceUid, seriesInstanceUid);
};

Stone.prototype.GetStudiesCount = function() {
  return this._GetStudiesCount();
};

Stone.prototype.GetSeriesCount = function() {
  return this._GetSeriesCount();
};

Stone.prototype.GetStringBuffer = function() {
  return this._GetStringBuffer();
};

Stone.prototype.LoadStudyTags = function(i) {
  this._LoadStudyTags(i);
};

Stone.prototype.LoadSeriesTags = function(i) {
  this._LoadSeriesTags(i);
};

Stone.prototype.LoadSeriesThumbnail = function(seriesInstanceUid) {
  return this._LoadSeriesThumbnail(seriesInstanceUid);
};

Stone.prototype.SpeedUpFetchSeriesMetadata = function(studyInstanceUid, seriesInstanceUid) {
  this._SpeedUpFetchSeriesMetadata(studyInstanceUid, seriesInstanceUid);
};

Stone.prototype.IsSeriesComplete = function(seriesInstanceUid) {
  return this._IsSeriesComplete(seriesInstanceUid);
};

Stone.prototype.LoadSeriesInViewport = function(canvas, seriesInstanceUid) {
  return this._LoadSeriesInViewport(canvas, seriesInstanceUid);
};

Stone.prototype.LoadMultipartInstanceInViewport = function(canvas, seriesInstanceUid, sopInstanceUid) {
  return this._LoadMultipartInstanceInViewport(canvas, seriesInstanceUid, sopInstanceUid);
};

Stone.prototype.AllViewportsUpdateSize = function(fitContent) {
  this._AllViewportsUpdateSize(fitContent);
};

Stone.prototype.DecrementFrame = function(canvas, isCircular) {
  return this._DecrementFrame(canvas, isCircular);
};

Stone.prototype.IncrementFrame = function(canvas, isCircular) {
  return this._IncrementFrame(canvas, isCircular);
};

Stone.prototype.GoToFirstFrame = function(canvas) {
  this._GoToFirstFrame(canvas);
};

Stone.prototype.GoToLastFrame = function(canvas) {
  this._GoToLastFrame(canvas);
};

Stone.prototype.ShowReferenceLines = function(show) {
  this._ShowReferenceLines(show);
};

Stone.prototype.SetWindowing = function(canvas, center, width) {
  this._SetWindowing(canvas, center, width);
};

Stone.prototype.InvertContrast = function(canvas) {
  this._InvertContrast(canvas);
};

Stone.prototype.FlipX = function(canvas) {
  this._FlipX(canvas);
};

Stone.prototype.FlipY = function(canvas) {
  this._FlipY(canvas);
};

Stone.prototype.SetSoftwareRendering = function(softwareRendering) {
  this._SetSoftwareRendering(softwareRendering);
};

Stone.prototype.IsSoftwareRendering = function() {
  return this._IsSoftwareRendering();
};

Stone.prototype.SetMouseButtonActions = function(leftAction, middleAction, rightAction) {
  this._SetMouseButtonActions(leftAction, middleAction, rightAction);
};

Stone.prototype.FitForPrint = function() {
  this._FitForPrint();
};

Stone.prototype.LoadOsiriXAnnotations = function(xml, clearPreviousAnnotations) {
  return this._LoadOsiriXAnnotations(xml, clearPreviousAnnotations);
};

Stone.prototype.FocusFirstOsiriXAnnotation = function(canvas) {
  this._FocusFirstOsiriXAnnotation(canvas);
};

Stone.prototype.FetchPdf = function(studyInstanceUid, seriesInstanceUid) {
  this._FetchPdf(studyInstanceUid, seriesInstanceUid);
};

Stone.prototype.GetCineRate = function(canvas) {
  return this._GetCineRate(canvas);
};

Stone.prototype.GetSeriesNumberOfFrames = function(seriesInstanceUid) {
  return this._GetSeriesNumberOfFrames(seriesInstanceUid);
};

Stone.prototype.LoadWindowingPresets = function(canvas) {
  this._LoadWindowingPresets(canvas);
};

Stone.prototype.SetSynchronizedBrowsingEnabled = function(enabled) {
  this._SetSynchronizedBrowsingEnabled(enabled);
};

Stone.prototype.LoadMultiframeInstancesFromSeries = function(seriesInstanceUid) {
  return this._LoadMultiframeInstancesFromSeries(seriesInstanceUid);
};

var stone = new Stone();

