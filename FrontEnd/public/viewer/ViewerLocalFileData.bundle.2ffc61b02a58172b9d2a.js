(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ 939:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(84);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(133);
/* harmony import */ var _ConnectedViewer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(960);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _App_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(253);
/* harmony import */ var react_dropzone__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1005);
/* harmony import */ var _lib_filesToStudies__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(969);
/* harmony import */ var _ViewerLocalFileData_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(990);
/* harmony import */ var _ViewerLocalFileData_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_ViewerLocalFileData_css__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(34);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }










var OHIFStudyMetadata = _ohif_core__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].OHIFStudyMetadata;
var studyMetadataManager = _ohif_core__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].studyMetadataManager;

var dropZoneLinkDialog = function dropZoneLinkDialog(onDrop, i18n, dir) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_dropzone__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"], {
    onDrop: onDrop,
    noDrag: true
  }, function (_ref) {
    var getRootProps = _ref.getRootProps,
        getInputProps = _ref.getInputProps;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", _extends({}, getRootProps(), {
      className: "link-dialog"
    }), dir ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, i18n('Load folders'), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", _extends({}, getInputProps(), {
      webkitdirectory: "true",
      mozdirectory: "true"
    }))) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, i18n('Load files'), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", getInputProps())));
  });
};

var linksDialogMessage = function linksDialogMessage(onDrop, i18n) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, i18n('Or click to '), dropZoneLinkDialog(onDrop, i18n), i18n(' or '), dropZoneLinkDialog(onDrop, i18n, true), i18n(' from dialog'));
};

var ViewerLocalFileData =
/*#__PURE__*/
function (_Component) {
  _inherits(ViewerLocalFileData, _Component);

  function ViewerLocalFileData() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ViewerLocalFileData);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ViewerLocalFileData)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      studies: null,
      loading: false,
      error: null
    });

    _defineProperty(_assertThisInitialized(_this), "updateStudies", function (studies) {
      // Render the viewer when the data is ready
      studyMetadataManager.purge(); // Map studies to new format, update metadata manager?

      var updatedStudies = studies.map(function (study) {
        var studyMetadata = new OHIFStudyMetadata(study, study.StudyInstanceUID);
        var sopClassHandlerModules = _App_js__WEBPACK_IMPORTED_MODULE_5__[/* extensionManager */ "c"].modules['sopClassHandlerModule'];
        study.displaySets = study.displaySets || studyMetadata.createDisplaySets(sopClassHandlerModules);
        studyMetadata.setDisplaySets(study.displaySets);
        studyMetadata.forEachDisplaySet(function (displayset) {
          displayset.localFile = true;
        });
        studyMetadataManager.add(studyMetadata);
        return study;
      });

      _this.setState({
        studies: updatedStudies
      });
    });

    return _this;
  }

  _createClass(ViewerLocalFileData, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var onDrop =
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(acceptedFiles) {
          var studies, updatedStudies;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _this2.setState({
                    loading: true
                  });

                  _context.next = 3;
                  return Object(_lib_filesToStudies__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"])(acceptedFiles);

                case 3:
                  studies = _context.sent;
                  updatedStudies = _this2.updateStudies(studies);

                  if (updatedStudies) {
                    _context.next = 7;
                    break;
                  }

                  return _context.abrupt("return");

                case 7:
                  _this2.setState({
                    studies: updatedStudies,
                    loading: false
                  });

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function onDrop(_x) {
          return _ref2.apply(this, arguments);
        };
      }();

      if (this.state.error) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Error: ", JSON.stringify(this.state.error));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_dropzone__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"], {
        onDrop: onDrop,
        noClick: true
      }, function (_ref3) {
        var getRootProps = _ref3.getRootProps,
            getInputProps = _ref3.getInputProps;
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({}, getRootProps(), {
          style: {
            width: '100%',
            height: '100%'
          }
        }), _this2.state.studies ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ConnectedViewer_js__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"], {
          studies: _this2.state.studies,
          studyInstanceUIDs: _this2.state.studies && _this2.state.studies.map(function (a) {
            return a.StudyInstanceUID;
          })
        }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: 'drag-drop-instructions'
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: 'drag-drop-contents'
        }, _this2.state.loading ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, _this2.props.t('Loading...')) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, _this2.props.t('Drag and Drop DICOM files here to load them in the Viewer')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, linksDialogMessage(onDrop, _this2.props.t))))));
      });
    }
  }]);

  return ViewerLocalFileData;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

_defineProperty(ViewerLocalFileData, "propTypes", {
  studies: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.array
});

/* harmony default export */ __webpack_exports__["default"] = (Object(react_i18next__WEBPACK_IMPORTED_MODULE_9__[/* withTranslation */ "d"])('Common')(ViewerLocalFileData));

/***/ }),

/***/ 969:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoader.min.js
var cornerstoneWADOImageLoader_min = __webpack_require__(55);
var cornerstoneWADOImageLoader_min_default = /*#__PURE__*/__webpack_require__.n(cornerstoneWADOImageLoader_min);

// CONCATENATED MODULE: ./lib/localFileLoaders/fileLoader.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FileLoader =
/*#__PURE__*/
function () {
  function FileLoader() {
    _classCallCheck(this, FileLoader);

    _defineProperty(this, "fileType", void 0);
  }

  _createClass(FileLoader, [{
    key: "loadFile",
    value: function loadFile(file, imageId) {}
  }, {
    key: "getDataset",
    value: function getDataset(image, imageId) {}
  }, {
    key: "getStudies",
    value: function getStudies(dataset, imageId) {}
  }]);

  return FileLoader;
}();


// CONCATENATED MODULE: ./lib/localFileLoaders/pdfFileLoader.js
var pdfFileLoader_temp;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function pdfFileLoader_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function pdfFileLoader_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function pdfFileLoader_createClass(Constructor, protoProps, staticProps) { if (protoProps) pdfFileLoader_defineProperties(Constructor.prototype, protoProps); if (staticProps) pdfFileLoader_defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function pdfFileLoader_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var PDFFileLoader = new (pdfFileLoader_temp =
/*#__PURE__*/
function (_FileLoader) {
  _inherits(_temp, _FileLoader);

  function _temp() {
    var _getPrototypeOf2;

    var _this;

    pdfFileLoader_classCallCheck(this, _temp);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_temp)).call.apply(_getPrototypeOf2, [this].concat(args)));

    pdfFileLoader_defineProperty(_assertThisInitialized(_this), "fileType", 'application/pdf');

    return _this;
  }

  pdfFileLoader_createClass(_temp, [{
    key: "loadFile",
    value: function loadFile(file, imageId) {
      return cornerstoneWADOImageLoader_min_default.a.wadouri.loadFileRequest(imageId);
    }
  }, {
    key: "getDataset",
    value: function getDataset(image, imageId) {
      var dataset = {};
      dataset.imageId = image.imageId || imageId;
      return dataset;
    }
  }, {
    key: "getStudies",
    value: function getStudies(dataset, imageId) {
      return this.getDefaultStudy(imageId);
    }
  }, {
    key: "getDefaultStudy",
    value: function getDefaultStudy(imageId) {
      var study = {
        StudyInstanceUID: '',
        StudyDate: '',
        StudyTime: '',
        AccessionNumber: '',
        ReferringPhysicianName: '',
        PatientName: '',
        PatientID: '',
        PatientBirthdate: '',
        PatientSex: '',
        StudyId: '',
        StudyDescription: '',
        series: [{
          SeriesInstanceUID: '',
          SeriesDescription: '',
          SeriesNumber: '',
          instances: [{
            metadata: {
              SOPInstanceUID: '',
              SOPClassUID: '1.2.840.10008.5.1.4.1.1.104.1',
              Rows: '',
              Columns: '',
              NumberOfFrames: 0,
              InstanceNumber: 1
            },
            getImageId: function getImageId() {
              return imageId;
            },
            isLocalFile: true
          }]
        }]
      };
      return study;
    }
  }]);

  return _temp;
}(FileLoader), pdfFileLoader_temp)();
/* harmony default export */ var pdfFileLoader = (PDFFileLoader);
// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(30);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/index.js + 33 modules
var src = __webpack_require__(13);

// CONCATENATED MODULE: ./lib/localFileLoaders/dicomFileLoader.js
var dicomFileLoader_temp;

function dicomFileLoader_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { dicomFileLoader_typeof = function _typeof(obj) { return typeof obj; }; } else { dicomFileLoader_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return dicomFileLoader_typeof(obj); }

function dicomFileLoader_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function dicomFileLoader_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function dicomFileLoader_createClass(Constructor, protoProps, staticProps) { if (protoProps) dicomFileLoader_defineProperties(Constructor.prototype, protoProps); if (staticProps) dicomFileLoader_defineProperties(Constructor, staticProps); return Constructor; }

function dicomFileLoader_possibleConstructorReturn(self, call) { if (call && (dicomFileLoader_typeof(call) === "object" || typeof call === "function")) { return call; } return dicomFileLoader_assertThisInitialized(self); }

function dicomFileLoader_getPrototypeOf(o) { dicomFileLoader_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return dicomFileLoader_getPrototypeOf(o); }

function dicomFileLoader_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function dicomFileLoader_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) dicomFileLoader_setPrototypeOf(subClass, superClass); }

function dicomFileLoader_setPrototypeOf(o, p) { dicomFileLoader_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return dicomFileLoader_setPrototypeOf(o, p); }

function dicomFileLoader_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var metadataProvider = src["a" /* default */].cornerstone.metadataProvider;
var DICOMFileLoader = new (dicomFileLoader_temp =
/*#__PURE__*/
function (_FileLoader) {
  dicomFileLoader_inherits(_temp, _FileLoader);

  function _temp() {
    var _getPrototypeOf2;

    var _this;

    dicomFileLoader_classCallCheck(this, _temp);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = dicomFileLoader_possibleConstructorReturn(this, (_getPrototypeOf2 = dicomFileLoader_getPrototypeOf(_temp)).call.apply(_getPrototypeOf2, [this].concat(args)));

    dicomFileLoader_defineProperty(dicomFileLoader_assertThisInitialized(_this), "fileType", 'application/dicom');

    return _this;
  }

  dicomFileLoader_createClass(_temp, [{
    key: "loadFile",
    value: function loadFile(file, imageId) {
      return cornerstoneWADOImageLoader_min_default.a.wadouri.loadFileRequest(imageId);
    }
  }, {
    key: "getDataset",
    value: function getDataset(image, imageId) {
      var dataset = {};

      try {
        var dicomData = dcmjs_es["a" /* default */].data.DicomMessage.readFile(image);
        dataset = dcmjs_es["a" /* default */].data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);
        metadataProvider.addInstance(dataset);
        dataset._meta = dcmjs_es["a" /* default */].data.DicomMetaDictionary.namifyDataset(dicomData.meta);
      } catch (e) {
        console.error('Error reading dicom file', e);
      } // Set imageId on dataset to be consumed later on


      dataset.imageId = imageId;
      return dataset;
    }
  }, {
    key: "getStudies",
    value: function getStudies(dataset, imageId) {
      return this.getStudyFromDataset(dataset);
    }
  }, {
    key: "getStudyFromDataset",
    value: function getStudyFromDataset() {
      var dataset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var StudyInstanceUID = dataset.StudyInstanceUID,
          StudyDate = dataset.StudyDate,
          StudyTime = dataset.StudyTime,
          AccessionNumber = dataset.AccessionNumber,
          ReferringPhysicianName = dataset.ReferringPhysicianName,
          PatientName = dataset.PatientName,
          PatientID = dataset.PatientID,
          PatientBirthDate = dataset.PatientBirthDate,
          PatientSex = dataset.PatientSex,
          StudyID = dataset.StudyID,
          StudyDescription = dataset.StudyDescription,
          SeriesInstanceUID = dataset.SeriesInstanceUID,
          SeriesDescription = dataset.SeriesDescription,
          SeriesNumber = dataset.SeriesNumber,
          imageId = dataset.imageId;
      var instance = {
        metadata: dataset,
        url: imageId
      };
      var series = {
        SeriesInstanceUID: SeriesInstanceUID,
        SeriesDescription: SeriesDescription,
        SeriesNumber: SeriesNumber,
        instances: [instance]
      };
      var study = {
        StudyInstanceUID: StudyInstanceUID,
        StudyDate: StudyDate,
        StudyTime: StudyTime,
        AccessionNumber: AccessionNumber,
        ReferringPhysicianName: ReferringPhysicianName,
        PatientName: PatientName,
        PatientID: PatientID,
        PatientBirthDate: PatientBirthDate,
        PatientSex: PatientSex,
        StudyID: StudyID,
        StudyDescription: StudyDescription,

        /*
        TODO: in case necessary to uncomment this block, double check every property
        numberOfStudyRelatedSeries: NumberOfStudyRelatedSeries || DICOMWeb.getString(dataset['00201206']),
        numberOfStudyRelatedInstances: NumberOfStudyRelatedInstances || DICOMWeb.getString(dataset['00201208']),
        Modality: Modality || DICOMWeb.getString(dataset['00080060']),
        ModalitiesInStudy: ModalitiesInStudy || DICOMWeb.getString(dataset['00080061']),
        modalities:
        */
        series: [series]
      };
      return study;
    }
  }]);

  return _temp;
}(FileLoader), dicomFileLoader_temp)();
/* harmony default export */ var dicomFileLoader = (DICOMFileLoader);
// CONCATENATED MODULE: ./lib/localFileLoaders/fileLoaderService.js
function fileLoaderService_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { fileLoaderService_typeof = function _typeof(obj) { return typeof obj; }; } else { fileLoaderService_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return fileLoaderService_typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { fileLoaderService_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function fileLoaderService_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function fileLoaderService_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function fileLoaderService_createClass(Constructor, protoProps, staticProps) { if (protoProps) fileLoaderService_defineProperties(Constructor.prototype, protoProps); if (staticProps) fileLoaderService_defineProperties(Constructor, staticProps); return Constructor; }

function fileLoaderService_possibleConstructorReturn(self, call) { if (call && (fileLoaderService_typeof(call) === "object" || typeof call === "function")) { return call; } return fileLoaderService_assertThisInitialized(self); }

function fileLoaderService_getPrototypeOf(o) { fileLoaderService_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return fileLoaderService_getPrototypeOf(o); }

function fileLoaderService_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function fileLoaderService_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) fileLoaderService_setPrototypeOf(subClass, superClass); }

function fileLoaderService_setPrototypeOf(o, p) { fileLoaderService_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return fileLoaderService_setPrototypeOf(o, p); }

function fileLoaderService_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var fileLoaderService_FileLoaderService =
/*#__PURE__*/
function (_FileLoader) {
  fileLoaderService_inherits(FileLoaderService, _FileLoader);

  function FileLoaderService(file) {
    var _this;

    fileLoaderService_classCallCheck(this, FileLoaderService);

    _this = fileLoaderService_possibleConstructorReturn(this, fileLoaderService_getPrototypeOf(FileLoaderService).call(this));

    fileLoaderService_defineProperty(fileLoaderService_assertThisInitialized(_this), "fileType", void 0);

    fileLoaderService_defineProperty(fileLoaderService_assertThisInitialized(_this), "loader", void 0);

    var fileType = file && file.type;
    _this.loader = _this.getLoader(fileType);
    _this.fileType = _this.loader.fileType;
    return _this;
  }

  fileLoaderService_createClass(FileLoaderService, [{
    key: "addFile",
    value: function addFile(file) {
      return cornerstoneWADOImageLoader_min_default.a.wadouri.fileManager.add(file);
    }
  }, {
    key: "loadFile",
    value: function loadFile(file, imageId) {
      return this.loader.loadFile(file, imageId);
    }
  }, {
    key: "getDataset",
    value: function getDataset(image, imageId) {
      return this.loader.getDataset(image, imageId);
    }
  }, {
    key: "getStudies",
    value: function getStudies(dataset, imageId) {
      return this.loader.getStudies(dataset, imageId);
    }
  }, {
    key: "getLoader",
    value: function getLoader(fileType) {
      if (fileType === 'application/pdf') {
        return pdfFileLoader;
      } else {
        // Default to dicom loader
        return dicomFileLoader;
      }
    }
  }], [{
    key: "groupSeries",
    value: function groupSeries(studies) {
      var groupBy = function groupBy(list, groupByKey, listKey) {
        var nonKeyCounter = 1;
        return list.reduce(function (acc, obj) {
          var _acc$key$listKey;

          var key = obj[groupByKey];
          var list = obj[listKey]; // in case key not found, group it using counter

          key = !!key ? key : '' + nonKeyCounter++;

          if (!acc[key]) {
            acc[key] = _objectSpread({}, obj);
            acc[key][listKey] = [];
          }

          (_acc$key$listKey = acc[key][listKey]).push.apply(_acc$key$listKey, _toConsumableArray(list));

          return acc;
        }, {});
      };

      var studiesGrouped = Object.values(groupBy(studies, 'StudyInstanceUID', 'series'));
      var result = studiesGrouped.map(function (studyGroup) {
        var seriesGrouped = groupBy(studyGroup.series, 'SeriesInstanceUID', 'instances');
        studyGroup.series = Object.values(seriesGrouped);
        return studyGroup;
      });
      return result;
    }
  }]);

  return FileLoaderService;
}(FileLoader);

/* harmony default export */ var localFileLoaders_fileLoaderService = (fileLoaderService_FileLoaderService);
// CONCATENATED MODULE: ./lib/filesToStudies.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return filesToStudies; });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



var processFile =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(file) {
    var fileLoaderService, imageId, image, dataset, studies;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            fileLoaderService = new localFileLoaders_fileLoaderService(file);
            imageId = fileLoaderService.addFile(file);
            _context.next = 5;
            return fileLoaderService.loadFile(file, imageId);

          case 5:
            image = _context.sent;
            _context.next = 8;
            return fileLoaderService.getDataset(image, imageId);

          case 8:
            dataset = _context.sent;
            _context.next = 11;
            return fileLoaderService.getStudies(dataset, imageId);

          case 11:
            studies = _context.sent;
            return _context.abrupt("return", studies);

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0.name, ':Error when trying to load and process local files:', _context.t0.message);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));

  return function processFile(_x) {
    return _ref.apply(this, arguments);
  };
}();

function filesToStudies(_x2) {
  return _filesToStudies.apply(this, arguments);
}

function _filesToStudies() {
  _filesToStudies = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(files) {
    var processFilesPromises, studies;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            processFilesPromises = files.map(processFile);
            _context2.next = 3;
            return Promise.all(processFilesPromises);

          case 3:
            studies = _context2.sent;
            return _context2.abrupt("return", localFileLoaders_fileLoaderService.groupSeries(studies.flat()));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _filesToStudies.apply(this, arguments);
}

/***/ }),

/***/ 990:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ })

}]);