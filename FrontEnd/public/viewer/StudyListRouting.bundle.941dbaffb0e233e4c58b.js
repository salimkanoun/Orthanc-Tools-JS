(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ 940:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/prop-types/index.js
var prop_types = __webpack_require__(1);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-router/esm/react-router.js + 1 modules
var react_router = __webpack_require__(75);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-redux/es/index.js + 21 modules
var es = __webpack_require__(59);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/index.js + 33 modules
var src = __webpack_require__(13);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-i18next/dist/es/index.js + 9 modules
var dist_es = __webpack_require__(34);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/ui/src/index.js + 119 modules
var ui_src = __webpack_require__(16);

// EXTERNAL MODULE: ./connectedComponents/ConnectedHeader.js + 8 modules
var ConnectedHeader = __webpack_require__(972);

// EXTERNAL MODULE: ./routes/routesUtil.js
var routesUtil = __webpack_require__(169);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/moment/moment.js
var moment = __webpack_require__(6);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);

// CONCATENATED MODULE: ./googleCloud/utils/helpers.js
function formatFileSize(size) {
  if (size === 0) return '0 B';
  var n = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, n)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][n];
}
function httpErrorToStr(error) {
  if (!error) return 'Unknown error';

  if (error.response) {
    try {
      var jsonResponse = JSON.parse(error.response);
      if (jsonResponse.error && jsonResponse.error.code && jsonResponse.error.message) return jsonResponse.error.code + ' - ' + jsonResponse.error.message;
    } catch (err) {
      return error.response;
    }
  }

  return error.message || 'Unknown error.';
}
/* eslint-disable */

function checkDicomFile(arrayBuffer) {
  if (arrayBuffer.length <= 132) return false;
  var arr = new Uint8Array(arrayBuffer.slice(128, 132)); // bytes from 128 to 132 must be "DICM"

  return Array.from('DICM').every(function (char, i) {
    return char.charCodeAt(0) === arr[i];
  });
}
// CONCATENATED MODULE: ./googleCloud/utils/CancellationToken.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CancellationToken =
/*#__PURE__*/
function () {
  function CancellationToken() {
    _classCallCheck(this, CancellationToken);

    this.cancelled = false;
  }

  _createClass(CancellationToken, [{
    key: "get",
    value: function get() {
      return this.cancelled;
    }
  }, {
    key: "set",
    value: function set(value) {
      this.cancelled = value;
    }
  }]);

  return CancellationToken;
}();


// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/dicomweb-client/build/dicomweb-client.es.js
var dicomweb_client_es = __webpack_require__(27);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/errorHandler.js
var errorHandler = __webpack_require__(36);

// CONCATENATED MODULE: ./googleCloud/api/DicomUploadService.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function DicomUploadService_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DicomUploadService_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DicomUploadService_createClass(Constructor, protoProps, staticProps) { if (protoProps) DicomUploadService_defineProperties(Constructor.prototype, protoProps); if (staticProps) DicomUploadService_defineProperties(Constructor, staticProps); return Constructor; }





var DicomUploadService_DicomUploadService =
/*#__PURE__*/
function () {
  function DicomUploadService() {
    DicomUploadService_classCallCheck(this, DicomUploadService);
  }

  DicomUploadService_createClass(DicomUploadService, [{
    key: "smartUpload",
    value: function () {
      var _smartUpload = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(files, url, uploadCallback, cancellationToken) {
        var _this = this;

        var CHUNK_SIZE, MAX_PARALLEL_JOBS, filesArray, parallelJobsCount, completed, processJob;
        return regeneratorRuntime.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                CHUNK_SIZE = 1; // Only one file per request is supported so far

                MAX_PARALLEL_JOBS = 50; // FIXME: tune MAX_PARALLEL_JOBS number

                filesArray = Array.from(files);

                if (!(filesArray.length === 0)) {
                  _context3.next = 5;
                  break;
                }

                throw new Error('No files were provided.');

              case 5:
                parallelJobsCount = Math.min(filesArray.length, MAX_PARALLEL_JOBS);
                completed = false;

                processJob =
                /*#__PURE__*/
                function () {
                  var _ref = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee(resolve, reject) {
                    var _loop, _ret;

                    return regeneratorRuntime.wrap(function _callee$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _loop =
                            /*#__PURE__*/
                            regeneratorRuntime.mark(function _loop() {
                              var chunk, error;
                              return regeneratorRuntime.wrap(function _loop$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      if (!cancellationToken.get()) {
                                        _context.next = 2;
                                        break;
                                      }

                                      return _context.abrupt("return", {
                                        v: void 0
                                      });

                                    case 2:
                                      chunk = filesArray.slice(0, CHUNK_SIZE);
                                      filesArray = filesArray.slice(CHUNK_SIZE);
                                      error = null;
                                      _context.prev = 5;

                                      if (!(chunk.length > 1)) {
                                        _context.next = 8;
                                        break;
                                      }

                                      throw new Error('Not implemented');

                                    case 8:
                                      if (!(chunk.length === 1)) {
                                        _context.next = 11;
                                        break;
                                      }

                                      _context.next = 11;
                                      return _this.simpleUpload(chunk[0], url);

                                    case 11:
                                      _context.next = 16;
                                      break;

                                    case 13:
                                      _context.prev = 13;
                                      _context.t0 = _context["catch"](5);
                                      // It looks like a stupid bug of Babel that err is not an actual Exception object
                                      error = httpErrorToStr(_context.t0);

                                    case 16:
                                      chunk.forEach(function (file) {
                                        return uploadCallback(file.fileId, error);
                                      });

                                      if (!(!completed && filesArray.length === 0)) {
                                        _context.next = 21;
                                        break;
                                      }

                                      completed = true;
                                      resolve();
                                      return _context.abrupt("return", {
                                        v: void 0
                                      });

                                    case 21:
                                    case "end":
                                      return _context.stop();
                                  }
                                }
                              }, _loop, null, [[5, 13]]);
                            });

                          case 1:
                            if (!(filesArray.length > 0)) {
                              _context2.next = 8;
                              break;
                            }

                            return _context2.delegateYield(_loop(), "t0", 3);

                          case 3:
                            _ret = _context2.t0;

                            if (!(_typeof(_ret) === "object")) {
                              _context2.next = 6;
                              break;
                            }

                            return _context2.abrupt("return", _ret.v);

                          case 6:
                            _context2.next = 1;
                            break;

                          case 8:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function processJob(_x5, _x6) {
                    return _ref.apply(this, arguments);
                  };
                }();

                _context3.next = 10;
                return new Promise(function (resolve) {
                  for (var i = 0; i < parallelJobsCount; i++) {
                    processJob(resolve);
                  }
                });

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2);
      }));

      function smartUpload(_x, _x2, _x3, _x4) {
        return _smartUpload.apply(this, arguments);
      }

      return smartUpload;
    }()
  }, {
    key: "simpleUpload",
    value: function () {
      var _simpleUpload = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(file, url) {
        var client, loadedFile, content;
        return regeneratorRuntime.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                client = this.getClient(url);
                _context4.next = 3;
                return this.readFile(file);

              case 3:
                loadedFile = _context4.sent;
                content = loadedFile.content;

                if (checkDicomFile(content)) {
                  _context4.next = 7;
                  break;
                }

                throw new Error('This is not a valid DICOM file.');

              case 7:
                _context4.next = 9;
                return client.storeInstances({
                  datasets: [content]
                });

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee3, this);
      }));

      function simpleUpload(_x7, _x8) {
        return _simpleUpload.apply(this, arguments);
      }

      return simpleUpload;
    }()
  }, {
    key: "readFile",
    value: function readFile(file) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();

        reader.onload = function () {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            content: reader.result
          });
        };

        reader.onerror = function (error) {
          return reject(error);
        };

        reader.readAsArrayBuffer(file);
      });
    }
  }, {
    key: "setRetrieveAuthHeaderFunction",
    value: function setRetrieveAuthHeaderFunction(func) {
      this.retrieveAuthHeaderFunc = func;
    }
  }, {
    key: "getClient",
    value: function getClient(url) {
      var headers = this.retrieveAuthHeaderFunc();
      var errorInterceptor = errorHandler["a" /* default */].getHTTPErrorHandler(); // TODO: a bit weird we are creating a new dicomweb client instance for every upload

      return new dicomweb_client_es["a" /* api */].DICOMwebClient({
        url: url,
        headers: headers
      });
    }
  }]);

  return DicomUploadService;
}();

/* harmony default export */ var api_DicomUploadService = (new DicomUploadService_DicomUploadService());
// EXTERNAL MODULE: ./googleCloud/DicomUploader.css
var googleCloud_DicomUploader = __webpack_require__(988);

// CONCATENATED MODULE: ./googleCloud/DicomUploader.js
function DicomUploader_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { DicomUploader_typeof = function _typeof(obj) { return typeof obj; }; } else { DicomUploader_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return DicomUploader_typeof(obj); }

function DicomUploader_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DicomUploader_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DicomUploader_createClass(Constructor, protoProps, staticProps) { if (protoProps) DicomUploader_defineProperties(Constructor.prototype, protoProps); if (staticProps) DicomUploader_defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (DicomUploader_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








var DicomUploader_DicomUploader =
/*#__PURE__*/
function (_Component) {
  _inherits(DicomUploader, _Component);

  function DicomUploader() {
    var _getPrototypeOf2;

    var _this;

    DicomUploader_classCallCheck(this, DicomUploader);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DicomUploader)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      status: 'Upload',
      isCancelled: false,
      errorsCount: 0,
      files: null,
      uploadedVolume: null,
      wholeVolumeStr: null,
      isFilesListHidden: true,
      timeLeft: null,
      uploadedList: null,
      totalCount: 0,
      successfullyUploadedCount: 0,
      lastFile: '',
      uploadContext: null // this is probably not needed, but we use this variable to distinguish between different downloads

    });

    _defineProperty(_assertThisInitialized(_this), "uploadFiles", function (files) {
      var filesArray = Array.from(files.target.files);
      var filesDict = {};
      filesArray.forEach(function (file, i) {
        var fileDesc = {
          id: i,
          name: file.name,
          path: file.webkitRelativePath || file.name,
          size: file.size,
          error: null,
          processed: false,
          processedInUI: false
        };
        filesDict[i] = fileDesc;
        file.fileId = i;
      });
      var wholeVolume = filesArray.map(function (f) {
        return f.size;
      }).reduce(function (a, b) {
        return a + b;
      });
      var uploadContext = Math.random();

      _this.setState({
        status: 'Uploading...',
        files: filesDict,
        uploadedList: [],
        uploadedVolume: 0,
        lastFile: filesArray[0].name,
        totalCount: filesArray.length,
        wholeVolumeStr: formatFileSize(wholeVolume),
        uploadContext: uploadContext,
        cancellationToken: new CancellationToken()
      });

      var cancellationToken = new CancellationToken();

      var uploadCallback = function uploadCallback(fileId, error) {
        return uploadContext === _this.state.uploadContext && _this.uploadCallback.call(_assertThisInitialized(_this), fileId, error);
      };

      api_DicomUploadService.setRetrieveAuthHeaderFunction(_this.props.retrieveAuthHeaderFunction);
      api_DicomUploadService.smartUpload(files.target.files, _this.props.url, uploadCallback, cancellationToken);
    });

    _defineProperty(_assertThisInitialized(_this), "renderTableRow", function (file) {
      var error = null;

      if (file.error !== null) {
        error = react_default.a.createElement("p", {
          style: {
            color: 'red'
          }
        }, file.error);
      }

      return react_default.a.createElement("tr", {
        key: file.id
      }, react_default.a.createElement("td", {
        className: "project"
      }, file.name, " ", error));
    });

    return _this;
  }

  DicomUploader_createClass(DicomUploader, [{
    key: "filesLeft",
    value: function filesLeft() {
      return this.state.uploadedList.length + ' of ' + this.state.totalCount + ' files';
    }
  }, {
    key: "volumeLeft",
    value: function volumeLeft() {
      var left = formatFileSize(this.state.uploadedVolume);
      return left + ' of ' + this.state.wholeVolumeStr;
    }
  }, {
    key: "percents",
    value: function percents() {
      return parseInt(100 * this.state.uploadedList.length / Object.keys(this.state.files).length);
    }
  }, {
    key: "isFinished",
    value: function isFinished() {
      return this.state.isCancelled || Object.keys(this.state.files).length === this.state.uploadedList.length;
    }
  }, {
    key: "errorsMessage",
    value: function errorsMessage() {
      var errors = this.state.errorsCount === 1 ? ' error' : ' errors';
      return this.state.errorsCount + errors + ' while uploading, click for more info';
    }
  }, {
    key: "uploadCallback",
    value: function uploadCallback(fileId, error) {
      var file = this.state.files[fileId];
      file.processed = true;

      if (!error) {
        var uploadedVolume = this.state.uploadedVolume + file.size;
        this.setState({
          uploadedVolume: uploadedVolume
        });
      } else {
        file.error = error;
        this.setState({
          errorsCount: this.state.errorsCount + 1
        });
      }

      this.setState({
        lastFile: file.name
      });
      var uploadedList = this.state.uploadedList;
      uploadedList.push(file);
      this.setState({
        uploadedList: uploadedList
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.files === null) {
        return react_default.a.createElement("div", {
          className: "dicom-uploader"
        }, react_default.a.createElement("div", {
          className: "button"
        }, react_default.a.createElement("label", {
          htmlFor: "file"
        }, react_default.a.createElement("img", {
          src: "./assets/Button_File.svg",
          alt: "upload file"
        })), react_default.a.createElement("input", {
          className: "invisible-input",
          onChange: this.uploadFiles,
          type: "file",
          id: "file",
          multiple: true
        })), react_default.a.createElement("div", {
          className: "button"
        }, react_default.a.createElement("label", {
          htmlFor: "folder"
        }, react_default.a.createElement("img", {
          src: "./assets/Button_Folder.svg",
          alt: "upload folder"
        })), react_default.a.createElement("input", {
          className: "invisible-input",
          type: "file",
          onChange: this.uploadFiles,
          id: "folder",
          webkitdirectory: "true",
          mozdirectory: "true",
          multiple: true
        })));
      }

      return react_default.a.createElement("table", {
        id: "tblProjectList",
        className: "table noselect"
      }, react_default.a.createElement("thead", null, react_default.a.createElement("tr", null, react_default.a.createElement("th", {
        className: "table-header"
      }, this.percents(), "% ", this.filesLeft()))), react_default.a.createElement("tbody", {
        id: "ProjectList"
      }, this.state.uploadedList.map(this.renderTableRow)));
    }
  }]);

  return DicomUploader;
}(react["Component"]);

_defineProperty(DicomUploader_DicomUploader, "propTypes", {
  id: prop_types_default.a.string,
  event: prop_types_default.a.string,
  url: prop_types_default.a.string,
  retrieveAuthHeaderFunction: prop_types_default.a.func
});


// EXTERNAL MODULE: ./App.js + 33 modules
var App = __webpack_require__(253);

// CONCATENATED MODULE: ./googleCloud/DicomFileUploaderModal.js






function DicomFileUploaderModal(_ref) {
  var _ref$isOpen = _ref.isOpen,
      isOpen = _ref$isOpen === void 0 ? false : _ref$isOpen,
      onClose = _ref.onClose,
      url = _ref.url,
      retrieveAuthHeaderFunction = _ref.retrieveAuthHeaderFunction,
      t = _ref.t;
  var UIModalService = App["e" /* servicesManager */].services.UIModalService;

  var showDicomStorePickerModal = function showDicomStorePickerModal() {
    if (!UIModalService) {
      return;
    }

    UIModalService.show({
      content: DicomUploader_DicomUploader,
      title: t('Upload DICOM Files'),
      contentProps: {
        url: url,
        retrieveAuthHeaderFunction: retrieveAuthHeaderFunction
      },
      onClose: onClose
    });
  };

  return react_default.a.createElement(react_default.a.Fragment, null, isOpen && showDicomStorePickerModal());
}

DicomFileUploaderModal.propTypes = {
  isOpen: prop_types_default.a.bool.isRequired,
  retrieveAuthHeaderFunction: prop_types_default.a.func.isRequired,
  onClose: prop_types_default.a.func,
  url: prop_types_default.a.string
};
/* harmony default export */ var googleCloud_DicomFileUploaderModal = (Object(dist_es["d" /* withTranslation */])('Common')(DicomFileUploaderModal));
// CONCATENATED MODULE: ./googleCloud/ConnectedDicomFilesUploader.js




var isActive = function isActive(a) {
  return a.active === true;
};

var ConnectedDicomFilesUploader_mapStateToProps = function mapStateToProps(state) {
  var activeServer = state.servers.servers.find(isActive); // TODO: Not sure I like this approach since it means we are recreating
  // this function every time redux changes

  var retrieveAuthHeaderFunction = function retrieveAuthHeaderFunction() {
    return src["a" /* default */].DICOMWeb.getAuthorizationHeader(activeServer);
  };

  return {
    retrieveAuthHeaderFunction: retrieveAuthHeaderFunction,
    url: activeServer && activeServer.qidoRoot
  };
};

var ConnectedDicomFileUploader = Object(es["b" /* connect */])(ConnectedDicomFilesUploader_mapStateToProps, null)(googleCloud_DicomFileUploaderModal);
/* harmony default export */ var ConnectedDicomFilesUploader = (ConnectedDicomFileUploader);
// EXTERNAL MODULE: ./googleCloud/api/GoogleCloudApi.js
var GoogleCloudApi = __webpack_require__(958);

// EXTERNAL MODULE: ./googleCloud/googleCloud.css
var googleCloud = __webpack_require__(956);

// CONCATENATED MODULE: ./googleCloud/DicomStoreList.js
function DicomStoreList_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { DicomStoreList_typeof = function _typeof(obj) { return typeof obj; }; } else { DicomStoreList_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return DicomStoreList_typeof(obj); }

function DicomStoreList_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DicomStoreList_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DicomStoreList_createClass(Constructor, protoProps, staticProps) { if (protoProps) DicomStoreList_defineProperties(Constructor.prototype, protoProps); if (staticProps) DicomStoreList_defineProperties(Constructor, staticProps); return Constructor; }

function DicomStoreList_possibleConstructorReturn(self, call) { if (call && (DicomStoreList_typeof(call) === "object" || typeof call === "function")) { return call; } return DicomStoreList_assertThisInitialized(self); }

function DicomStoreList_getPrototypeOf(o) { DicomStoreList_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return DicomStoreList_getPrototypeOf(o); }

function DicomStoreList_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function DicomStoreList_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) DicomStoreList_setPrototypeOf(subClass, superClass); }

function DicomStoreList_setPrototypeOf(o, p) { DicomStoreList_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return DicomStoreList_setPrototypeOf(o, p); }

function DicomStoreList_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var DicomStoreList_DicomStoreList =
/*#__PURE__*/
function (_Component) {
  DicomStoreList_inherits(DicomStoreList, _Component);

  function DicomStoreList() {
    var _getPrototypeOf2;

    var _this;

    DicomStoreList_classCallCheck(this, DicomStoreList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = DicomStoreList_possibleConstructorReturn(this, (_getPrototypeOf2 = DicomStoreList_getPrototypeOf(DicomStoreList)).call.apply(_getPrototypeOf2, [this].concat(args)));

    DicomStoreList_defineProperty(DicomStoreList_assertThisInitialized(_this), "state", {
      search: ''
    });

    DicomStoreList_defineProperty(DicomStoreList_assertThisInitialized(_this), "renderTableRow", function (store) {
      return react_default.a.createElement("tr", {
        key: store.name,
        className: _this.state.highlightedItem === store.name ? 'noselect active' : 'noselect',
        onMouseEnter: function onMouseEnter() {
          _this.onHighlightItem(store.name);
        },
        onClick: function onClick() {
          _this.props.onSelect(store);
        }
      }, react_default.a.createElement("td", {
        className: "project"
      }, store.name.split('/')[7]));
    });

    return _this;
  }

  DicomStoreList_createClass(DicomStoreList, [{
    key: "onHighlightItem",
    value: function onHighlightItem(store) {
      this.setState({
        highlightedItem: store
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          stores = _this$props.stores,
          filter = _this$props.filter,
          error = _this$props.error;

      if (error) {
        return react_default.a.createElement("p", null, error);
      }

      var loadingIcon = react_default.a.createElement(ui_src["j" /* Icon */], {
        name: "circle-notch",
        className: "loading-icon-spin loading-icon"
      });

      if (loading) {
        return loadingIcon;
      }

      var body = react_default.a.createElement("tbody", {
        id: "StoreList"
      }, stores.filter(function (store) {
        return store.name.split('/')[7].toLowerCase().includes(filter.toLowerCase()) || filter == "";
      }).map(this.renderTableRow));
      return react_default.a.createElement("table", {
        id: "tblStoreList",
        className: "gcp-table table noselect"
      }, react_default.a.createElement("thead", null, react_default.a.createElement("tr", null, react_default.a.createElement("th", null, this.props.t('DICOM Store')))), stores && body);
    }
  }]);

  return DicomStoreList;
}(react["Component"]);

DicomStoreList_defineProperty(DicomStoreList_DicomStoreList, "propTypes", {
  stores: prop_types_default.a.array,
  loading: prop_types_default.a.bool.isRequired,
  error: prop_types_default.a.string,
  onSelect: prop_types_default.a.func
});

DicomStoreList_defineProperty(DicomStoreList_DicomStoreList, "defaultProps", {
  loading: true
});

/* harmony default export */ var googleCloud_DicomStoreList = (Object(dist_es["d" /* withTranslation */])('Common')(DicomStoreList_DicomStoreList));
// CONCATENATED MODULE: ./googleCloud/DicomStorePicker.js
function DicomStorePicker_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { DicomStorePicker_typeof = function _typeof(obj) { return typeof obj; }; } else { DicomStorePicker_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return DicomStorePicker_typeof(obj); }

function DicomStorePicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function DicomStorePicker_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { DicomStorePicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { DicomStorePicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function DicomStorePicker_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DicomStorePicker_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DicomStorePicker_createClass(Constructor, protoProps, staticProps) { if (protoProps) DicomStorePicker_defineProperties(Constructor.prototype, protoProps); if (staticProps) DicomStorePicker_defineProperties(Constructor, staticProps); return Constructor; }

function DicomStorePicker_possibleConstructorReturn(self, call) { if (call && (DicomStorePicker_typeof(call) === "object" || typeof call === "function")) { return call; } return DicomStorePicker_assertThisInitialized(self); }

function DicomStorePicker_getPrototypeOf(o) { DicomStorePicker_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return DicomStorePicker_getPrototypeOf(o); }

function DicomStorePicker_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function DicomStorePicker_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) DicomStorePicker_setPrototypeOf(subClass, superClass); }

function DicomStorePicker_setPrototypeOf(o, p) { DicomStorePicker_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return DicomStorePicker_setPrototypeOf(o, p); }

function DicomStorePicker_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var DicomStorePicker_DicomStorePicker =
/*#__PURE__*/
function (_Component) {
  DicomStorePicker_inherits(DicomStorePicker, _Component);

  function DicomStorePicker() {
    var _getPrototypeOf2;

    var _this;

    DicomStorePicker_classCallCheck(this, DicomStorePicker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = DicomStorePicker_possibleConstructorReturn(this, (_getPrototypeOf2 = DicomStorePicker_getPrototypeOf(DicomStorePicker)).call.apply(_getPrototypeOf2, [this].concat(args)));

    DicomStorePicker_defineProperty(DicomStorePicker_assertThisInitialized(_this), "state", {
      error: null,
      loading: true,
      stores: [],
      locations: [],
      filterStr: ''
    });

    return _this;
  }

  DicomStorePicker_createClass(DicomStorePicker, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = DicomStorePicker_asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                GoogleCloudApi["a" /* default */].setAccessToken(this.props.accessToken);
                _context.next = 3;
                return GoogleCloudApi["a" /* default */].loadDicomStores(this.props.dataset.name);

              case 3:
                response = _context.sent;

                if (!response.isError) {
                  _context.next = 7;
                  break;
                }

                this.setState({
                  error: response.message
                });
                return _context.abrupt("return");

              case 7:
                this.setState({
                  stores: response.data.dicomStores || [],
                  loading: false
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          stores = _this$state.stores,
          loading = _this$state.loading,
          error = _this$state.error,
          filterStr = _this$state.filterStr;
      var onSelect = this.props.onSelect;
      return react_default.a.createElement("div", null, react_default.a.createElement("input", {
        className: "form-control gcp-input",
        type: "text",
        value: filterStr,
        onChange: function onChange(e) {
          return _this2.setState({
            filterStr: e.target.value
          });
        }
      }), react_default.a.createElement(googleCloud_DicomStoreList, {
        stores: stores,
        loading: loading,
        error: error,
        filter: filterStr,
        onSelect: onSelect
      }));
    }
  }]);

  return DicomStorePicker;
}(react["Component"]);

DicomStorePicker_defineProperty(DicomStorePicker_DicomStorePicker, "propTypes", {
  dataset: prop_types_default.a.object,
  onSelect: prop_types_default.a.func,
  accessToken: prop_types_default.a.string.isRequired
});


// CONCATENATED MODULE: ./googleCloud/DatasetsList.js
function DatasetsList_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { DatasetsList_typeof = function _typeof(obj) { return typeof obj; }; } else { DatasetsList_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return DatasetsList_typeof(obj); }

function DatasetsList_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DatasetsList_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DatasetsList_createClass(Constructor, protoProps, staticProps) { if (protoProps) DatasetsList_defineProperties(Constructor.prototype, protoProps); if (staticProps) DatasetsList_defineProperties(Constructor, staticProps); return Constructor; }

function DatasetsList_possibleConstructorReturn(self, call) { if (call && (DatasetsList_typeof(call) === "object" || typeof call === "function")) { return call; } return DatasetsList_assertThisInitialized(self); }

function DatasetsList_getPrototypeOf(o) { DatasetsList_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return DatasetsList_getPrototypeOf(o); }

function DatasetsList_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function DatasetsList_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) DatasetsList_setPrototypeOf(subClass, superClass); }

function DatasetsList_setPrototypeOf(o, p) { DatasetsList_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return DatasetsList_setPrototypeOf(o, p); }

function DatasetsList_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var DatasetsList_DatasetsList =
/*#__PURE__*/
function (_Component) {
  DatasetsList_inherits(DatasetsList, _Component);

  function DatasetsList() {
    var _getPrototypeOf2;

    var _this;

    DatasetsList_classCallCheck(this, DatasetsList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = DatasetsList_possibleConstructorReturn(this, (_getPrototypeOf2 = DatasetsList_getPrototypeOf(DatasetsList)).call.apply(_getPrototypeOf2, [this].concat(args)));

    DatasetsList_defineProperty(DatasetsList_assertThisInitialized(_this), "state", {
      search: ''
    });

    DatasetsList_defineProperty(DatasetsList_assertThisInitialized(_this), "renderTableRow", function (dataset) {
      return react_default.a.createElement("tr", {
        key: dataset.name,
        className: _this.state.highlightedItem === dataset.name ? 'noselect active' : 'noselect',
        onMouseEnter: function onMouseEnter() {
          _this.onHighlightItem(dataset.name);
        },
        onClick: function onClick() {
          _this.props.onSelect(dataset);
        }
      }, react_default.a.createElement("td", null, dataset.name.split('/')[5]));
    });

    return _this;
  }

  DatasetsList_createClass(DatasetsList, [{
    key: "onHighlightItem",
    value: function onHighlightItem(dataset) {
      this.setState({
        highlightedItem: dataset
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          datasets = _this$props.datasets,
          filter = _this$props.filter,
          error = _this$props.error;

      if (error) {
        return react_default.a.createElement("p", null, error);
      }

      var loadingIcon = react_default.a.createElement(ui_src["j" /* Icon */], {
        name: "circle-notch",
        className: "loading-icon-spin loading-icon"
      });

      if (loading) {
        return loadingIcon;
      }

      var body = react_default.a.createElement("tbody", {
        id: "DatasetList"
      }, datasets.filter(function (dataset) {
        return dataset.name.split('/')[5].toLowerCase().includes(filter.toLowerCase()) || filter == "";
      }).map(this.renderTableRow));
      return react_default.a.createElement("table", {
        id: "tblDatasetList",
        className: "gcp-table table noselect"
      }, react_default.a.createElement("thead", null, react_default.a.createElement("tr", null, react_default.a.createElement("th", null, this.props.t('Dataset')))), datasets && body);
    }
  }]);

  return DatasetsList;
}(react["Component"]);

DatasetsList_defineProperty(DatasetsList_DatasetsList, "propTypes", {
  datasets: prop_types_default.a.array,
  loading: prop_types_default.a.bool,
  error: prop_types_default.a.string,
  onSelect: prop_types_default.a.func
});

DatasetsList_defineProperty(DatasetsList_DatasetsList, "defaultProps", {
  loading: true
});

/* harmony default export */ var googleCloud_DatasetsList = (Object(dist_es["d" /* withTranslation */])('Common')(DatasetsList_DatasetsList));
// CONCATENATED MODULE: ./googleCloud/DatasetPicker.js
function DatasetPicker_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { DatasetPicker_typeof = function _typeof(obj) { return typeof obj; }; } else { DatasetPicker_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return DatasetPicker_typeof(obj); }

function DatasetPicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function DatasetPicker_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { DatasetPicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { DatasetPicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function DatasetPicker_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DatasetPicker_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DatasetPicker_createClass(Constructor, protoProps, staticProps) { if (protoProps) DatasetPicker_defineProperties(Constructor.prototype, protoProps); if (staticProps) DatasetPicker_defineProperties(Constructor, staticProps); return Constructor; }

function DatasetPicker_possibleConstructorReturn(self, call) { if (call && (DatasetPicker_typeof(call) === "object" || typeof call === "function")) { return call; } return DatasetPicker_assertThisInitialized(self); }

function DatasetPicker_getPrototypeOf(o) { DatasetPicker_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return DatasetPicker_getPrototypeOf(o); }

function DatasetPicker_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function DatasetPicker_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) DatasetPicker_setPrototypeOf(subClass, superClass); }

function DatasetPicker_setPrototypeOf(o, p) { DatasetPicker_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return DatasetPicker_setPrototypeOf(o, p); }

function DatasetPicker_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var DatasetPicker_DatasetPicker =
/*#__PURE__*/
function (_Component) {
  DatasetPicker_inherits(DatasetPicker, _Component);

  function DatasetPicker() {
    var _getPrototypeOf2;

    var _this;

    DatasetPicker_classCallCheck(this, DatasetPicker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = DatasetPicker_possibleConstructorReturn(this, (_getPrototypeOf2 = DatasetPicker_getPrototypeOf(DatasetPicker)).call.apply(_getPrototypeOf2, [this].concat(args)));

    DatasetPicker_defineProperty(DatasetPicker_assertThisInitialized(_this), "state", {
      error: null,
      loading: true,
      datasets: [],
      filterStr: ''
    });

    return _this;
  }

  DatasetPicker_createClass(DatasetPicker, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = DatasetPicker_asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                GoogleCloudApi["a" /* default */].setAccessToken(this.props.accessToken);
                _context.next = 3;
                return GoogleCloudApi["a" /* default */].loadDatasets(this.props.project.projectId, this.props.location.locationId);

              case 3:
                response = _context.sent;

                if (!response.isError) {
                  _context.next = 7;
                  break;
                }

                this.setState({
                  error: response.message
                });
                return _context.abrupt("return");

              case 7:
                this.setState({
                  datasets: response.data.datasets || [],
                  loading: false
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          datasets = _this$state.datasets,
          loading = _this$state.loading,
          error = _this$state.error,
          filterStr = _this$state.filterStr;
      var onSelect = this.props.onSelect;
      return react_default.a.createElement("div", null, react_default.a.createElement("input", {
        className: "form-control gcp-input",
        type: "text",
        value: filterStr,
        onChange: function onChange(e) {
          return _this2.setState({
            filterStr: e.target.value
          });
        }
      }), react_default.a.createElement(googleCloud_DatasetsList, {
        datasets: datasets,
        loading: loading,
        error: error,
        filter: filterStr,
        onSelect: onSelect
      }));
    }
  }]);

  return DatasetPicker;
}(react["Component"]);

DatasetPicker_defineProperty(DatasetPicker_DatasetPicker, "propTypes", {
  project: prop_types_default.a.object,
  location: prop_types_default.a.object,
  onSelect: prop_types_default.a.func,
  accessToken: prop_types_default.a.string
});


// CONCATENATED MODULE: ./googleCloud/ProjectsList.js
function ProjectsList_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ProjectsList_typeof = function _typeof(obj) { return typeof obj; }; } else { ProjectsList_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ProjectsList_typeof(obj); }

function ProjectsList_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProjectsList_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProjectsList_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProjectsList_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProjectsList_defineProperties(Constructor, staticProps); return Constructor; }

function ProjectsList_possibleConstructorReturn(self, call) { if (call && (ProjectsList_typeof(call) === "object" || typeof call === "function")) { return call; } return ProjectsList_assertThisInitialized(self); }

function ProjectsList_getPrototypeOf(o) { ProjectsList_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return ProjectsList_getPrototypeOf(o); }

function ProjectsList_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function ProjectsList_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) ProjectsList_setPrototypeOf(subClass, superClass); }

function ProjectsList_setPrototypeOf(o, p) { ProjectsList_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return ProjectsList_setPrototypeOf(o, p); }

function ProjectsList_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var ProjectsList_ProjectsList =
/*#__PURE__*/
function (_Component) {
  ProjectsList_inherits(ProjectsList, _Component);

  function ProjectsList() {
    var _getPrototypeOf2;

    var _this;

    ProjectsList_classCallCheck(this, ProjectsList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = ProjectsList_possibleConstructorReturn(this, (_getPrototypeOf2 = ProjectsList_getPrototypeOf(ProjectsList)).call.apply(_getPrototypeOf2, [this].concat(args)));

    ProjectsList_defineProperty(ProjectsList_assertThisInitialized(_this), "state", {
      search: '',
      highlightedItem: null
    });

    ProjectsList_defineProperty(ProjectsList_assertThisInitialized(_this), "renderTableRow", function (project) {
      return react_default.a.createElement("tr", {
        key: project.projectId,
        className: _this.state.highlightedItem === project.projectId ? 'noselect active' : 'noselect',
        onMouseEnter: function onMouseEnter() {
          _this.onHighlightItem(project.projectId);
        },
        onClick: function onClick() {
          _this.onHighlightItem(project.projectId);

          _this.props.onSelect(project);
        }
      }, react_default.a.createElement("td", null, project.name), react_default.a.createElement("td", null, project.projectId));
    });

    return _this;
  }

  ProjectsList_createClass(ProjectsList, [{
    key: "onHighlightItem",
    value: function onHighlightItem(project) {
      this.setState({
        highlightedItem: project
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          projects = _this$props.projects,
          filter = _this$props.filter,
          error = _this$props.error;

      if (error) {
        return react_default.a.createElement("p", null, error);
      }

      var loadingIcon = react_default.a.createElement(ui_src["j" /* Icon */], {
        name: "circle-notch",
        className: "loading-icon-spin loading-icon"
      });

      if (loading) {
        return loadingIcon;
      }

      var lowerCaseFilter = filter.toLowerCase();
      var filteredProjects = projects.filter(function (project) {
        return typeof project.name === 'string' && (filter === "" || project.name.toLowerCase().includes(lowerCaseFilter));
      });
      var body = react_default.a.createElement("tbody", {
        id: "ProjectList"
      }, filteredProjects.map(this.renderTableRow));
      return react_default.a.createElement("table", {
        id: "tblProjectList",
        className: "gcp-table table noselect"
      }, react_default.a.createElement("thead", null, react_default.a.createElement("tr", null, react_default.a.createElement("th", null, this.props.t('Project')), react_default.a.createElement("th", null, this.props.t('ID')))), projects && body);
    }
  }]);

  return ProjectsList;
}(react["Component"]);

ProjectsList_defineProperty(ProjectsList_ProjectsList, "propTypes", {
  projects: prop_types_default.a.array,
  loading: prop_types_default.a.bool.isRequired,
  error: prop_types_default.a.string,
  onSelect: prop_types_default.a.func.isRequired,
  t: prop_types_default.a.func
});

ProjectsList_defineProperty(ProjectsList_ProjectsList, "defaultProps", {
  loading: true
});

/* harmony default export */ var googleCloud_ProjectsList = (Object(dist_es["d" /* withTranslation */])('Common')(ProjectsList_ProjectsList));
// CONCATENATED MODULE: ./googleCloud/ProjectPicker.js
function ProjectPicker_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ProjectPicker_typeof = function _typeof(obj) { return typeof obj; }; } else { ProjectPicker_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ProjectPicker_typeof(obj); }

function ProjectPicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function ProjectPicker_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { ProjectPicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { ProjectPicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ProjectPicker_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProjectPicker_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProjectPicker_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProjectPicker_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProjectPicker_defineProperties(Constructor, staticProps); return Constructor; }

function ProjectPicker_possibleConstructorReturn(self, call) { if (call && (ProjectPicker_typeof(call) === "object" || typeof call === "function")) { return call; } return ProjectPicker_assertThisInitialized(self); }

function ProjectPicker_getPrototypeOf(o) { ProjectPicker_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return ProjectPicker_getPrototypeOf(o); }

function ProjectPicker_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function ProjectPicker_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) ProjectPicker_setPrototypeOf(subClass, superClass); }

function ProjectPicker_setPrototypeOf(o, p) { ProjectPicker_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return ProjectPicker_setPrototypeOf(o, p); }

function ProjectPicker_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var ProjectPicker_ProjectPicker =
/*#__PURE__*/
function (_Component) {
  ProjectPicker_inherits(ProjectPicker, _Component);

  function ProjectPicker() {
    var _getPrototypeOf2;

    var _this;

    ProjectPicker_classCallCheck(this, ProjectPicker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = ProjectPicker_possibleConstructorReturn(this, (_getPrototypeOf2 = ProjectPicker_getPrototypeOf(ProjectPicker)).call.apply(_getPrototypeOf2, [this].concat(args)));

    ProjectPicker_defineProperty(ProjectPicker_assertThisInitialized(_this), "state", {
      error: null,
      loading: true,
      projects: []
    });

    return _this;
  }

  ProjectPicker_createClass(ProjectPicker, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = ProjectPicker_asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                GoogleCloudApi["a" /* default */].setAccessToken(this.props.accessToken);
                _context.next = 3;
                return GoogleCloudApi["a" /* default */].loadProjects();

              case 3:
                response = _context.sent;

                if (!response.isError) {
                  _context.next = 7;
                  break;
                }

                this.setState({
                  error: response.message
                });
                return _context.abrupt("return");

              case 7:
                this.setState({
                  projects: response.data.projects || [],
                  filterStr: '',
                  loading: false
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          projects = _this$state.projects,
          loading = _this$state.loading,
          filterStr = _this$state.filterStr,
          error = _this$state.error;
      var onSelect = this.props.onSelect;
      return react_default.a.createElement("div", null, react_default.a.createElement("input", {
        className: "form-control gcp-input",
        type: "text",
        value: filterStr,
        onChange: function onChange(e) {
          return _this2.setState({
            filterStr: e.target.value
          });
        }
      }), react_default.a.createElement(googleCloud_ProjectsList, {
        projects: projects,
        loading: loading,
        filter: filterStr,
        error: error,
        onSelect: onSelect
      }));
    }
  }]);

  return ProjectPicker;
}(react["Component"]);

ProjectPicker_defineProperty(ProjectPicker_ProjectPicker, "propTypes", {
  onSelect: prop_types_default.a.func,
  accessToken: prop_types_default.a.string
});


// CONCATENATED MODULE: ./googleCloud/LocationsList.js
function LocationsList_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { LocationsList_typeof = function _typeof(obj) { return typeof obj; }; } else { LocationsList_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return LocationsList_typeof(obj); }

function LocationsList_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function LocationsList_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function LocationsList_createClass(Constructor, protoProps, staticProps) { if (protoProps) LocationsList_defineProperties(Constructor.prototype, protoProps); if (staticProps) LocationsList_defineProperties(Constructor, staticProps); return Constructor; }

function LocationsList_possibleConstructorReturn(self, call) { if (call && (LocationsList_typeof(call) === "object" || typeof call === "function")) { return call; } return LocationsList_assertThisInitialized(self); }

function LocationsList_getPrototypeOf(o) { LocationsList_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return LocationsList_getPrototypeOf(o); }

function LocationsList_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function LocationsList_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) LocationsList_setPrototypeOf(subClass, superClass); }

function LocationsList_setPrototypeOf(o, p) { LocationsList_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return LocationsList_setPrototypeOf(o, p); }

function LocationsList_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var LocationsList_LocationsList =
/*#__PURE__*/
function (_Component) {
  LocationsList_inherits(LocationsList, _Component);

  function LocationsList() {
    var _getPrototypeOf2;

    var _this;

    LocationsList_classCallCheck(this, LocationsList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = LocationsList_possibleConstructorReturn(this, (_getPrototypeOf2 = LocationsList_getPrototypeOf(LocationsList)).call.apply(_getPrototypeOf2, [this].concat(args)));

    LocationsList_defineProperty(LocationsList_assertThisInitialized(_this), "state", {
      search: ''
    });

    LocationsList_defineProperty(LocationsList_assertThisInitialized(_this), "renderTableRow", function (location) {
      return react_default.a.createElement("tr", {
        key: location.locationId,
        className: _this.state.highlightedItem === location.locationId ? 'noselect active' : 'noselect',
        onMouseEnter: function onMouseEnter() {
          _this.onHighlightItem(location.locationId);
        },
        onClick: function onClick() {
          _this.props.onSelect(location);
        }
      }, react_default.a.createElement("td", null, location.name.split('/')[3]));
    });

    return _this;
  }

  LocationsList_createClass(LocationsList, [{
    key: "onHighlightItem",
    value: function onHighlightItem(locationId) {
      this.setState({
        highlightedItem: locationId
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          locations = _this$props.locations,
          filter = _this$props.filter,
          error = _this$props.error;

      if (error) {
        return react_default.a.createElement("p", null, error);
      }

      var loadingIcon = react_default.a.createElement(ui_src["j" /* Icon */], {
        name: "circle-notch",
        className: "loading-icon-spin loading-icon"
      });

      if (loading) {
        return loadingIcon;
      }

      var body = react_default.a.createElement("tbody", {
        id: "LocationList"
      }, locations.filter(function (location) {
        return location.name.split('/')[3].toLowerCase().includes(filter.toLowerCase()) || filter == "";
      }).map(this.renderTableRow));
      return react_default.a.createElement("table", {
        id: "tblLocationList",
        className: "gcp-table table noselect"
      }, react_default.a.createElement("thead", null, react_default.a.createElement("tr", null, react_default.a.createElement("th", null, this.props.t('Location')))), locations && body);
    }
  }]);

  return LocationsList;
}(react["Component"]);

LocationsList_defineProperty(LocationsList_LocationsList, "propTypes", {
  locations: prop_types_default.a.array,
  loading: prop_types_default.a.bool.isRequired,
  error: prop_types_default.a.string,
  onSelect: prop_types_default.a.func
});

LocationsList_defineProperty(LocationsList_LocationsList, "defaultProps", {
  loading: true
});

/* harmony default export */ var googleCloud_LocationsList = (Object(dist_es["d" /* withTranslation */])('Common')(LocationsList_LocationsList));
// CONCATENATED MODULE: ./googleCloud/LocationPicker.js
function LocationPicker_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { LocationPicker_typeof = function _typeof(obj) { return typeof obj; }; } else { LocationPicker_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return LocationPicker_typeof(obj); }

function LocationPicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function LocationPicker_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { LocationPicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { LocationPicker_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function LocationPicker_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function LocationPicker_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function LocationPicker_createClass(Constructor, protoProps, staticProps) { if (protoProps) LocationPicker_defineProperties(Constructor.prototype, protoProps); if (staticProps) LocationPicker_defineProperties(Constructor, staticProps); return Constructor; }

function LocationPicker_possibleConstructorReturn(self, call) { if (call && (LocationPicker_typeof(call) === "object" || typeof call === "function")) { return call; } return LocationPicker_assertThisInitialized(self); }

function LocationPicker_getPrototypeOf(o) { LocationPicker_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return LocationPicker_getPrototypeOf(o); }

function LocationPicker_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function LocationPicker_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) LocationPicker_setPrototypeOf(subClass, superClass); }

function LocationPicker_setPrototypeOf(o, p) { LocationPicker_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return LocationPicker_setPrototypeOf(o, p); }

function LocationPicker_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var LocationPicker_LocationPicker =
/*#__PURE__*/
function (_Component) {
  LocationPicker_inherits(LocationPicker, _Component);

  function LocationPicker() {
    var _getPrototypeOf2;

    var _this;

    LocationPicker_classCallCheck(this, LocationPicker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = LocationPicker_possibleConstructorReturn(this, (_getPrototypeOf2 = LocationPicker_getPrototypeOf(LocationPicker)).call.apply(_getPrototypeOf2, [this].concat(args)));

    LocationPicker_defineProperty(LocationPicker_assertThisInitialized(_this), "state", {
      error: null,
      loading: true,
      locations: [],
      filterStr: ''
    });

    return _this;
  }

  LocationPicker_createClass(LocationPicker, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = LocationPicker_asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                GoogleCloudApi["a" /* default */].setAccessToken(this.props.accessToken);
                _context.next = 3;
                return GoogleCloudApi["a" /* default */].loadLocations(this.props.project.projectId);

              case 3:
                response = _context.sent;

                if (!response.isError) {
                  _context.next = 7;
                  break;
                }

                this.setState({
                  error: response.message
                });
                return _context.abrupt("return");

              case 7:
                this.setState({
                  locations: response.data.locations || [],
                  loading: false
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          locations = _this$state.locations,
          loading = _this$state.loading,
          error = _this$state.error,
          filterStr = _this$state.filterStr;
      var onSelect = this.props.onSelect;
      return react_default.a.createElement("div", null, react_default.a.createElement("input", {
        className: "form-control gcp-input",
        type: "text",
        value: filterStr,
        onChange: function onChange(e) {
          return _this2.setState({
            filterStr: e.target.value
          });
        }
      }), react_default.a.createElement(googleCloud_LocationsList, {
        locations: locations,
        loading: loading,
        error: error,
        filter: filterStr,
        onSelect: onSelect
      }));
    }
  }]);

  return LocationPicker;
}(react["Component"]);

LocationPicker_defineProperty(LocationPicker_LocationPicker, "propTypes", {
  project: prop_types_default.a.object,
  onSelect: prop_types_default.a.func,
  accessToken: prop_types_default.a.string
});


// CONCATENATED MODULE: ./googleCloud/DatasetSelector.js
function DatasetSelector_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { DatasetSelector_typeof = function _typeof(obj) { return typeof obj; }; } else { DatasetSelector_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return DatasetSelector_typeof(obj); }

function DatasetSelector_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DatasetSelector_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DatasetSelector_createClass(Constructor, protoProps, staticProps) { if (protoProps) DatasetSelector_defineProperties(Constructor.prototype, protoProps); if (staticProps) DatasetSelector_defineProperties(Constructor, staticProps); return Constructor; }

function DatasetSelector_possibleConstructorReturn(self, call) { if (call && (DatasetSelector_typeof(call) === "object" || typeof call === "function")) { return call; } return DatasetSelector_assertThisInitialized(self); }

function DatasetSelector_getPrototypeOf(o) { DatasetSelector_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return DatasetSelector_getPrototypeOf(o); }

function DatasetSelector_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function DatasetSelector_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) DatasetSelector_setPrototypeOf(subClass, superClass); }

function DatasetSelector_setPrototypeOf(o, p) { DatasetSelector_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return DatasetSelector_setPrototypeOf(o, p); }

function DatasetSelector_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











var DatasetSelector_DatasetSelector =
/*#__PURE__*/
function (_Component) {
  DatasetSelector_inherits(DatasetSelector, _Component);

  function DatasetSelector() {
    var _getPrototypeOf2;

    var _this;

    DatasetSelector_classCallCheck(this, DatasetSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = DatasetSelector_possibleConstructorReturn(this, (_getPrototypeOf2 = DatasetSelector_getPrototypeOf(DatasetSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));

    DatasetSelector_defineProperty(DatasetSelector_assertThisInitialized(_this), "state", {
      project: null,
      location: null,
      dataset: null,
      unloading: false
    });

    DatasetSelector_defineProperty(DatasetSelector_assertThisInitialized(_this), "onProjectSelect", function (project) {
      _this.setState({
        project: project
      });
    });

    DatasetSelector_defineProperty(DatasetSelector_assertThisInitialized(_this), "onLocationSelect", function (location) {
      _this.setState({
        location: location
      });
    });

    DatasetSelector_defineProperty(DatasetSelector_assertThisInitialized(_this), "onDatasetSelect", function (dataset) {
      _this.setState({
        dataset: dataset
      });
    });

    DatasetSelector_defineProperty(DatasetSelector_assertThisInitialized(_this), "onProjectClick", function () {
      _this.setState({
        dataset: null,
        location: null,
        project: null
      });
    });

    DatasetSelector_defineProperty(DatasetSelector_assertThisInitialized(_this), "onLocationClick", function () {
      _this.setState({
        dataset: null,
        location: null
      });
    });

    DatasetSelector_defineProperty(DatasetSelector_assertThisInitialized(_this), "onDatasetClick", function () {
      _this.setState({
        dataset: null
      });
    });

    DatasetSelector_defineProperty(DatasetSelector_assertThisInitialized(_this), "onDicomStoreSelect", function (dicomStoreJson) {
      var dicomStore = dicomStoreJson.name;
      var parts = dicomStore.split('/');
      var result = {
        wadoUriRoot: GoogleCloudApi["a" /* default */].urlBase + "/".concat(dicomStore, "/dicomWeb"),
        qidoRoot: GoogleCloudApi["a" /* default */].urlBase + "/".concat(dicomStore, "/dicomWeb"),
        wadoRoot: GoogleCloudApi["a" /* default */].urlBase + "/".concat(dicomStore, "/dicomWeb"),
        project: parts[1],
        location: parts[3],
        dataset: parts[5],
        dicomStore: parts[7]
      };

      _this.props.setServers(result);
    });

    return _this;
  }

  DatasetSelector_createClass(DatasetSelector, [{
    key: "render",
    value: function render() {
      var accessToken = this.props.user.access_token;
      var _this$state = this.state,
          project = _this$state.project,
          location = _this$state.location,
          dataset = _this$state.dataset;
      var onProjectClick = this.onProjectClick,
          onLocationClick = this.onLocationClick,
          onDatasetClick = this.onDatasetClick,
          onProjectSelect = this.onProjectSelect,
          onLocationSelect = this.onLocationSelect,
          onDatasetSelect = this.onDatasetSelect,
          onDicomStoreSelect = this.onDicomStoreSelect;
      var projectBreadcrumbs = react_default.a.createElement("div", {
        className: "gcp-picker--path"
      }, react_default.a.createElement("span", null, this.props.t('Select a Project')));

      if (project) {
        projectBreadcrumbs = react_default.a.createElement("div", {
          className: "gcp-picker--path"
        }, react_default.a.createElement("span", {
          onClick: onProjectClick
        }, project.name), project && location && react_default.a.createElement("span", {
          onClick: onLocationClick
        }, ' ', "-> ", location.name.split('/')[3]), project && location && dataset && react_default.a.createElement("span", {
          onClick: onDatasetClick
        }, ' ', "-> ", dataset.name.split('/')[5]));
      }

      return react_default.a.createElement(react_default.a.Fragment, null, projectBreadcrumbs, !project && react_default.a.createElement(ProjectPicker_ProjectPicker, {
        accessToken: accessToken,
        onSelect: onProjectSelect
      }), project && !location && react_default.a.createElement(LocationPicker_LocationPicker, {
        accessToken: accessToken,
        project: project,
        onSelect: onLocationSelect
      }), project && location && !dataset && react_default.a.createElement(DatasetPicker_DatasetPicker, {
        accessToken: accessToken,
        project: project,
        location: location,
        onSelect: onDatasetSelect
      }), project && location && dataset && react_default.a.createElement(DicomStorePicker_DicomStorePicker, {
        accessToken: accessToken,
        dataset: dataset,
        onSelect: onDicomStoreSelect
      }));
    }
  }]);

  return DatasetSelector;
}(react["Component"]);

DatasetSelector_defineProperty(DatasetSelector_DatasetSelector, "propTypes", {
  id: prop_types_default.a.string,
  event: prop_types_default.a.string,
  user: prop_types_default.a.object,
  canClose: prop_types_default.a.string,
  setServers: prop_types_default.a.func.isRequired
});

/* harmony default export */ var googleCloud_DatasetSelector = (Object(dist_es["d" /* withTranslation */])('Common')(DatasetSelector_DatasetSelector));
// EXTERNAL MODULE: ./googleCloud/utils/getServers.js
var getServers = __webpack_require__(963);

// CONCATENATED MODULE: ./googleCloud/DicomStorePickerModal.js








function DicomStorePickerModal(_ref) {
  var _ref$isOpen = _ref.isOpen,
      isOpen = _ref$isOpen === void 0 ? false : _ref$isOpen,
      setServers = _ref.setServers,
      onClose = _ref.onClose,
      user = _ref.user,
      url = _ref.url,
      t = _ref.t;
  var UIModalService = App["e" /* servicesManager */].services.UIModalService;

  var showDicomStorePickerModal = function showDicomStorePickerModal() {
    var handleEvent = function handleEvent(data) {
      var servers = getServers["a" /* getServers */](data, data.dicomstore);
      setServers(servers); // Force auto close

      UIModalService.hide();
      onClose();
    };

    if (UIModalService) {
      UIModalService.show({
        content: googleCloud_DatasetSelector,
        title: t('Google Cloud Healthcare API'),
        contentProps: {
          setServers: handleEvent,
          user: user,
          url: url
        },
        onClose: onClose
      });
    }
  };

  return react_default.a.createElement(react_default.a.Fragment, null, isOpen && showDicomStorePickerModal());
}

DicomStorePickerModal.propTypes = {
  isOpen: prop_types_default.a.bool.isRequired,
  setServers: prop_types_default.a.func.isRequired,
  onClose: prop_types_default.a.func,
  user: prop_types_default.a.object.isRequired,
  url: prop_types_default.a.string
};
/* harmony default export */ var googleCloud_DicomStorePickerModal = (Object(dist_es["d" /* withTranslation */])('Common')(DicomStorePickerModal));
// CONCATENATED MODULE: ./googleCloud/ConnectedDicomStorePicker.js



var ConnectedDicomStorePicker_isActive = function isActive(a) {
  return a.active === true;
};

var ConnectedDicomStorePicker_mapStateToProps = function mapStateToProps(state) {
  var activeServer = state.servers.servers.find(ConnectedDicomStorePicker_isActive);
  return {
    user: state.oidc && state.oidc.user,
    url: activeServer && activeServer.qidoRoot
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    setServers: function setServers(servers) {
      var action = {
        type: 'SET_SERVERS',
        servers: servers
      };
      dispatch(action);
    }
  };
};

var ConnectedDicomStorePicker = Object(es["b" /* connect */])(ConnectedDicomStorePicker_mapStateToProps, mapDispatchToProps)(googleCloud_DicomStorePickerModal);
/* harmony default export */ var googleCloud_ConnectedDicomStorePicker = (ConnectedDicomStorePicker);
// EXTERNAL MODULE: ./lib/filesToStudies.js + 4 modules
var filesToStudies = __webpack_require__(969);

// EXTERNAL MODULE: ./context/UserManagerContext.js
var UserManagerContext = __webpack_require__(255);

// EXTERNAL MODULE: ./context/WhiteLabelingContext.js
var WhiteLabelingContext = __webpack_require__(236);

// EXTERNAL MODULE: ./context/AppContext.js
var AppContext = __webpack_require__(90);

// CONCATENATED MODULE: ./studylist/StudyListRoute.js
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { StudyListRoute_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function StudyListRoute_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function StudyListRoute_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function StudyListRoute_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { StudyListRoute_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { StudyListRoute_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }












 // Contexts




var UrlUtil = src["a" /* default */].utils.urlUtil;

function StudyListRoute(props) {
  var history = props.history,
      server = props.server,
      user = props.user,
      studyListFunctionsEnabled = props.studyListFunctionsEnabled;

  var _useTranslation = Object(dist_es["c" /* useTranslation */])('Common'),
      _useTranslation2 = _slicedToArray(_useTranslation, 1),
      t = _useTranslation2[0]; // ~~ STATE


  var _useState = Object(react["useState"])({
    fieldName: 'PatientName',
    direction: 'desc'
  }),
      _useState2 = _slicedToArray(_useState, 2),
      sort = _useState2[0],
      setSort = _useState2[1];

  var _useState3 = Object(react["useState"])({
    studyDateTo: null,
    studyDateFrom: null,
    PatientName: '',
    PatientID: '',
    AccessionNumber: '',
    StudyDate: '',
    modalities: '',
    StudyDescription: '',
    //
    patientNameOrId: '',
    accessionOrModalityOrDescription: '',
    //
    allFields: ''
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      filterValues = _useState4[0],
      setFilterValues = _useState4[1];

  var _useState5 = Object(react["useState"])([]),
      _useState6 = _slicedToArray(_useState5, 2),
      studies = _useState6[0],
      setStudies = _useState6[1];

  var _useState7 = Object(react["useState"])({
    isSearchingForStudies: false,
    error: null
  }),
      _useState8 = _slicedToArray(_useState7, 2),
      searchStatus = _useState8[0],
      setSearchStatus = _useState8[1];

  var _useState9 = Object(react["useState"])(null),
      _useState10 = _slicedToArray(_useState9, 2),
      activeModalId = _useState10[0],
      setActiveModalId = _useState10[1];

  var _useState11 = Object(react["useState"])(25),
      _useState12 = _slicedToArray(_useState11, 2),
      rowsPerPage = _useState12[0],
      setRowsPerPage = _useState12[1];

  var _useState13 = Object(react["useState"])(0),
      _useState14 = _slicedToArray(_useState13, 2),
      pageNumber = _useState14[0],
      setPageNumber = _useState14[1];

  var appContext = Object(react["useContext"])(AppContext["c" /* default */]); // ~~ RESPONSIVE

  var displaySize = Object(ui_src["K" /* useMedia */])(['(min-width: 1750px)', '(min-width: 1000px) and (max-width: 1749px)', '(max-width: 999px)'], ['large', 'medium', 'small'], 'small'); // ~~ DEBOUNCED INPUT

  var debouncedSort = Object(ui_src["J" /* useDebounce */])(sort, 200);
  var debouncedFilters = Object(ui_src["J" /* useDebounce */])(filterValues, 250); // Google Cloud Adapter for DICOM Store Picking

  var _appContext$appConfig = appContext.appConfig,
      appConfig = _appContext$appConfig === void 0 ? {} : _appContext$appConfig;
  var isGoogleCHAIntegrationEnabled = !server && appConfig.enableGoogleCloudAdapter;

  if (isGoogleCHAIntegrationEnabled && activeModalId !== 'DicomStorePicker') {
    setActiveModalId('DicomStorePicker');
  } // Called when relevant state/props are updated
  // Watches filters and sort, debounced


  Object(react["useEffect"])(function () {
    var fetchStudies =
    /*#__PURE__*/
    function () {
      var _ref = StudyListRoute_asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                setSearchStatus({
                  error: null,
                  isSearchingForStudies: true
                });
                _context.next = 4;
                return getStudyList(server, debouncedFilters, debouncedSort, rowsPerPage, pageNumber, displaySize);

              case 4:
                response = _context.sent;
                setStudies(response);
                setSearchStatus({
                  error: null,
                  isSearchingForStudies: false
                });
                _context.next = 13;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                console.warn(_context.t0);
                setSearchStatus({
                  error: true,
                  isFetching: false
                });

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 9]]);
      }));

      return function fetchStudies() {
        return _ref.apply(this, arguments);
      };
    }();

    if (server) {
      fetchStudies();
    }
  }, // TODO: Can we update studies directly?
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [debouncedFilters, debouncedSort, rowsPerPage, pageNumber, displaySize, server]); // TODO: Update Server
  // if (this.props.server !== prevProps.server) {
  //   this.setState({
  //     modalComponentId: null,
  //     searchData: null,
  //     studies: null,
  //   });
  // }

  var onDrop =
  /*#__PURE__*/
  function () {
    var _ref2 = StudyListRoute_asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(acceptedFiles) {
      var studiesFromFiles;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return Object(filesToStudies["a" /* default */])(acceptedFiles);

            case 3:
              studiesFromFiles = _context2.sent;
              setStudies(studiesFromFiles);
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              setSearchStatus({
                isSearchingForStudies: false,
                error: _context2.t0
              });

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 7]]);
    }));

    return function onDrop(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  if (searchStatus.error) {
    return react_default.a.createElement("div", null, "Error: ", JSON.stringify(searchStatus.error));
  } else if (studies === [] && !activeModalId) {
    return react_default.a.createElement("div", null, "Loading...");
  }

  var healthCareApiButtons = null;
  var healthCareApiWindows = null;

  if (appConfig.enableGoogleCloudAdapter) {
    var isModalOpen = activeModalId === 'DicomStorePicker';
    updateURL(isModalOpen, appConfig, server, history);
    healthCareApiWindows = react_default.a.createElement(googleCloud_ConnectedDicomStorePicker, {
      isOpen: activeModalId === 'DicomStorePicker',
      onClose: function onClose() {
        return setActiveModalId(null);
      }
    });
    healthCareApiButtons = react_default.a.createElement("div", {
      className: "form-inline btn-group pull-right",
      style: {
        padding: '20px'
      }
    }, react_default.a.createElement("button", {
      className: "btn btn-primary",
      onClick: function onClick() {
        return setActiveModalId('DicomStorePicker');
      }
    }, t('Change DICOM Store')));
  }

  function handleSort(fieldName) {
    var sortFieldName = fieldName;
    var sortDirection = 'asc';

    if (fieldName === sort.fieldName) {
      if (sort.direction === 'asc') {
        sortDirection = 'desc';
      } else {
        sortFieldName = null;
        sortDirection = null;
      }
    }

    setSort({
      fieldName: sortFieldName,
      direction: sortDirection
    });
  }

  function handleFilterChange(fieldName, value) {
    setFilterValues(function (state) {
      return _objectSpread({}, state, StudyListRoute_defineProperty({}, fieldName, value));
    });
  }

  return react_default.a.createElement(react_default.a.Fragment, null, studyListFunctionsEnabled ? react_default.a.createElement(ConnectedDicomFilesUploader, {
    isOpen: activeModalId === 'DicomFilesUploader',
    onClose: function onClose() {
      return setActiveModalId(null);
    }
  }) : null, healthCareApiWindows, react_default.a.createElement(WhiteLabelingContext["a" /* default */].Consumer, null, function (whiteLabeling) {
    return react_default.a.createElement(UserManagerContext["a" /* default */].Consumer, null, function (userManager) {
      return react_default.a.createElement(ConnectedHeader["a" /* default */], {
        useLargeLogo: true,
        user: user,
        userManager: userManager
      }, whiteLabeling && whiteLabeling.createLogoComponentFn && whiteLabeling.createLogoComponentFn(react_default.a));
    });
  }), react_default.a.createElement("div", {
    className: "study-list-header"
  }, react_default.a.createElement("div", {
    className: "header"
  }, react_default.a.createElement("h1", {
    style: {
      fontWeight: 300,
      fontSize: '22px'
    }
  }, t('StudyList'))), react_default.a.createElement("div", {
    className: "actions"
  }, studyListFunctionsEnabled && healthCareApiButtons, studyListFunctionsEnabled && react_default.a.createElement(ui_src["q" /* PageToolbar */], {
    onImport: function onImport() {
      return setActiveModalId('DicomFilesUploader');
    }
  }), react_default.a.createElement("span", {
    className: "study-count"
  }, studies.length))), react_default.a.createElement("div", {
    className: "table-head-background"
  }), react_default.a.createElement("div", {
    className: "study-list-container"
  }, react_default.a.createElement(ui_src["z" /* StudyList */], {
    isLoading: searchStatus.isSearchingForStudies,
    hasError: searchStatus.error === true // Rows
    ,
    studies: studies,
    onSelectItem: function onSelectItem(studyInstanceUID) {
      var viewerPath = routesUtil["c" /* parseViewerPath */](appConfig, server, {
        studyInstanceUIDs: studyInstanceUID
      });
      history.push(viewerPath);
    } // Table Header
    ,
    sort: sort,
    onSort: handleSort,
    filterValues: filterValues,
    onFilterChange: handleFilterChange,
    studyListDateFilterNumDays: appConfig.studyListDateFilterNumDays,
    displaySize: displaySize
  }), react_default.a.createElement(ui_src["E" /* TablePagination */], {
    currentPage: pageNumber,
    nextPageFunc: function nextPageFunc() {
      return setPageNumber(pageNumber + 1);
    },
    prevPageFunc: function prevPageFunc() {
      return setPageNumber(pageNumber - 1);
    },
    onRowsPerPageChange: function onRowsPerPageChange(Rows) {
      return setRowsPerPage(Rows);
    },
    rowsPerPage: rowsPerPage,
    recordCount: studies.length
  })));
}

StudyListRoute.propTypes = {
  filters: prop_types_default.a.object,
  PatientID: prop_types_default.a.string,
  server: prop_types_default.a.object,
  user: prop_types_default.a.object,
  history: prop_types_default.a.object,
  studyListFunctionsEnabled: prop_types_default.a.bool
};
StudyListRoute.defaultProps = {
  studyListFunctionsEnabled: true
};

function updateURL(isModalOpen, appConfig, server, history) {
  if (isModalOpen) {
    return;
  }

  var listPath = routesUtil["b" /* parseStudyListPath */](appConfig, server);

  if (UrlUtil.paramString.isValidPath(listPath)) {
    var _history$location = history.location,
        location = _history$location === void 0 ? {} : _history$location;

    if (location.pathname !== listPath) {
      history.replace(listPath);
    }
  }
}
/**
 * Not ideal, but we use displaySize to determine how the filters should be used
 * to build the collection of promises we need to fetch a result set.
 *
 * @param {*} server
 * @param {*} filters
 * @param {object} sort
 * @param {string} sort.fieldName - field to sort by
 * @param {string} sort.direction - direction to sort
 * @param {number} rowsPerPage - Number of results to return
 * @param {number} pageNumber - Used to determine results offset
 * @param {string} displaySize - small, medium, large
 * @returns
 */


function getStudyList(_x2, _x3, _x4, _x5, _x6, _x7) {
  return _getStudyList.apply(this, arguments);
}
/**
 *
 *
 * @param {object[]} studies - Array of studies to sort
 * @param {string} studies.StudyDate - Date in 'MMM DD, YYYY' format
 * @param {string} field - name of properties on study to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns
 */


function _getStudyList() {
  _getStudyList = StudyListRoute_asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(server, filters, sort, rowsPerPage, pageNumber, displaySize) {
    var allFields, patientNameOrId, accessionOrModalityOrDescription, sortFieldName, sortDirection, studyDateFrom, studyDateTo, mappedFilters, studies, mappedStudies, sortFieldNameMapping, mappedSortFieldName, sortedStudies, numToTake, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            allFields = filters.allFields, patientNameOrId = filters.patientNameOrId, accessionOrModalityOrDescription = filters.accessionOrModalityOrDescription;
            sortFieldName = sort.fieldName || 'PatientName';
            sortDirection = sort.direction || 'desc';
            studyDateFrom = filters.studyDateFrom || moment_default()().subtract(25000, 'days').toDate();
            studyDateTo = filters.studyDateTo || new Date();
            mappedFilters = {
              PatientID: filters.PatientID,
              PatientName: filters.PatientName,
              AccessionNumber: filters.AccessionNumber,
              StudyDescription: filters.StudyDescription,
              ModalitiesInStudy: filters.modalities,
              // NEVER CHANGE
              studyDateFrom: studyDateFrom,
              studyDateTo: studyDateTo,
              limit: rowsPerPage,
              offset: pageNumber * rowsPerPage,
              fuzzymatching: server.supportsFuzzyMatching === true
            };
            _context3.next = 8;
            return _fetchStudies(server, mappedFilters, displaySize, {
              allFields: allFields,
              patientNameOrId: patientNameOrId,
              accessionOrModalityOrDescription: accessionOrModalityOrDescription
            });

          case 8:
            studies = _context3.sent;
            // Only the fields we use
            mappedStudies = studies.map(function (study) {
              var PatientName = typeof study.PatientName === 'string' ? study.PatientName : undefined;
              return {
                AccessionNumber: study.AccessionNumber,
                // "1"
                modalities: study.modalities,
                // "SEG\\MR"  ​​
                // numberOfStudyRelatedInstances: "3"
                // numberOfStudyRelatedSeries: "3"
                // PatientBirthdate: undefined
                PatientID: study.PatientID,
                // "NOID"
                PatientName: PatientName,
                // "NAME^NONE"
                // PatientSex: "M"
                // referringPhysicianName: undefined
                StudyDate: study.StudyDate,
                // "Jun 28, 2002"
                StudyDescription: study.StudyDescription,
                // "BRAIN"
                // studyId: "No Study ID"
                StudyInstanceUID: study.StudyInstanceUID // "1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.3.0"
                // StudyTime: "160956.0"

              };
            }); // For our smaller displays, map our field name to a single
            // field we can actually sort by.

            sortFieldNameMapping = {
              allFields: 'PatientName',
              patientNameOrId: 'PatientName',
              accessionOrModalityOrDescription: 'modalities'
            };
            mappedSortFieldName = sortFieldNameMapping[sortFieldName] || sortFieldName;
            sortedStudies = _sortStudies(mappedStudies, mappedSortFieldName, sortDirection); // Because we've merged multiple requests, we may have more than
            // our Rows per page. Let's `take` that number from our sorted array.
            // This "might" cause paging issues.

            numToTake = sortedStudies.length < rowsPerPage ? sortedStudies.length : rowsPerPage;
            result = sortedStudies.slice(0, numToTake);
            return _context3.abrupt("return", result);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getStudyList.apply(this, arguments);
}

function _sortStudies(studies, field, order) {
  // Make sure our StudyDate is in a valid format and create copy of studies array
  var sortedStudies = studies.map(function (study) {
    if (!moment_default()(study.StudyDate, 'MMM DD, YYYY', true).isValid()) {
      study.StudyDate = moment_default()(study.StudyDate, 'YYYYMMDD').format('MMM DD, YYYY');
    }

    return study;
  }); // Sort by field

  sortedStudies.sort(function (a, b) {
    var fieldA = a[field];
    var fieldB = b[field];

    if (field === 'StudyDate') {
      fieldA = moment_default()(fieldA).toISOString();
      fieldB = moment_default()(fieldB).toISOString();
    } // Order


    if (order === 'desc') {
      if (fieldA < fieldB) {
        return -1;
      }

      if (fieldA > fieldB) {
        return 1;
      }

      return 0;
    } else {
      if (fieldA > fieldB) {
        return -1;
      }

      if (fieldA < fieldB) {
        return 1;
      }

      return 0;
    }
  });
  return sortedStudies;
}
/**
 * We're forced to do this because DICOMWeb does not support "AND|OR" searches
 * across multiple fields. This allows us to make multiple requests, remove
 * duplicates, and return the result set as if it were supported
 *
 * @param {object} server
 * @param {Object} filters
 * @param {string} displaySize - small, medium, or large
 * @param {string} multi.allFields
 * @param {string} multi.patientNameOrId
 * @param {string} multi.accessionOrModalityOrDescription
 */


function _fetchStudies(_x8, _x9, _x10, _x11) {
  return _fetchStudies2.apply(this, arguments);
}
/**
 *
 *
 * @param {*} filters
 * @param {*} fields - Array of string fields
 * @param {*} value
 */


function _fetchStudies2() {
  _fetchStudies2 = StudyListRoute_asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(server, filters, displaySize, _ref3) {
    var allFields, patientNameOrId, accessionOrModalityOrDescription, queryFiltersArray, firstSet, _firstSet, secondSet, queryPromises, lotsOfStudies, studies;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            allFields = _ref3.allFields, patientNameOrId = _ref3.patientNameOrId, accessionOrModalityOrDescription = _ref3.accessionOrModalityOrDescription;
            queryFiltersArray = [filters];

            if (displaySize === 'small') {
              firstSet = _getQueryFiltersForValue(filters, ['PatientID', 'PatientName', 'AccessionNumber', 'StudyDescription', 'ModalitiesInStudy'], allFields);

              if (firstSet.length) {
                queryFiltersArray = firstSet;
              }
            } else if (displaySize === 'medium') {
              _firstSet = _getQueryFiltersForValue(filters, ['PatientID', 'PatientName'], patientNameOrId);
              secondSet = _getQueryFiltersForValue(filters, ['AccessionNumber', 'StudyDescription', 'ModalitiesInStudy'], accessionOrModalityOrDescription);

              if (_firstSet.length || secondSet.length) {
                queryFiltersArray = _firstSet.concat(secondSet);
              }
            }

            queryPromises = [];
            queryFiltersArray.forEach(function (filter) {
              var searchStudiesPromise = src["a" /* default */].studies.searchStudies(server, filter);
              queryPromises.push(searchStudiesPromise);
            });
            _context4.next = 7;
            return Promise.all(queryPromises);

          case 7:
            lotsOfStudies = _context4.sent;
            studies = []; // Flatten and dedupe

            lotsOfStudies.forEach(function (arrayOfStudies) {
              if (arrayOfStudies) {
                arrayOfStudies.forEach(function (study) {
                  if (!studies.some(function (s) {
                    return s.StudyInstanceUID === study.StudyInstanceUID;
                  })) {
                    studies.push(study);
                  }
                });
              }
            });
            return _context4.abrupt("return", studies);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _fetchStudies2.apply(this, arguments);
}

function _getQueryFiltersForValue(filters, fields, value) {
  var queryFilters = [];

  if (value === '' || !value) {
    return queryFilters;
  }

  fields.forEach(function (field) {
    var filter = Object.assign({
      PatientID: '',
      PatientName: '',
      AccessionNumber: '',
      StudyDescription: '',
      ModalitiesInStudy: ''
    }, filters);
    filter[field] = value;
    queryFilters.push(filter);
  });
  return queryFilters;
}

/* harmony default export */ var studylist_StudyListRoute = (Object(react_router["g" /* withRouter */])(StudyListRoute));
// CONCATENATED MODULE: ./studylist/ConnectedStudyList.js



var ConnectedStudyList_isActive = function isActive(a) {
  return a.active === true;
};

var ConnectedStudyList_mapStateToProps = function mapStateToProps(state) {
  var activeServer = state.servers.servers.find(ConnectedStudyList_isActive);
  return {
    server: activeServer,
    user: state.oidc.user
  };
};

var ConnectedStudyList = Object(es["b" /* connect */])(ConnectedStudyList_mapStateToProps, null)(studylist_StudyListRoute);
/* harmony default export */ var studylist_ConnectedStudyList = (ConnectedStudyList);
// EXTERNAL MODULE: ./customHooks/useServer.js
var useServer = __webpack_require__(965);

// CONCATENATED MODULE: ./studylist/StudyListRouting.js






var StudyListRouting_UrlUtil = src["a" /* default */].utils.urlUtil; // Contexts



function StudyListRouting(_ref) {
  var routeMatch = _ref.match,
      routeLocation = _ref.location;
  var _routeMatch$params = routeMatch.params,
      project = _routeMatch$params.project,
      location = _routeMatch$params.location,
      dataset = _routeMatch$params.dataset,
      dicomStore = _routeMatch$params.dicomStore,
      studyInstanceUIDs = _routeMatch$params.studyInstanceUIDs,
      seriesInstanceUIDs = _routeMatch$params.seriesInstanceUIDs;
  var server = Object(useServer["a" /* default */])({
    project: project,
    location: location,
    dataset: dataset,
    dicomStore: dicomStore
  });

  var _useContext = Object(react["useContext"])(AppContext["c" /* default */]),
      _useContext$appConfig = _useContext.appConfig,
      appConfig = _useContext$appConfig === void 0 ? {} : _useContext$appConfig;

  var filters = StudyListRouting_UrlUtil.queryString.getQueryFilters(routeLocation);
  var studyListFunctionsEnabled = false;

  if (appConfig.studyListFunctionsEnabled) {
    studyListFunctionsEnabled = appConfig.studyListFunctionsEnabled;
  }

  return react_default.a.createElement(studylist_ConnectedStudyList, {
    filters: filters,
    studyListFunctionsEnabled: studyListFunctionsEnabled
  });
}

StudyListRouting.propTypes = {
  location: prop_types_default.a.shape({
    search: prop_types_default.a.string
  }).isRequired
};
/* harmony default export */ var studylist_StudyListRouting = __webpack_exports__["default"] = (Object(react_router["g" /* withRouter */])(StudyListRouting));

/***/ }),

/***/ 956:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 957:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return usePrevious; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function usePrevious(value) {
  var ref = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])();
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/***/ }),

/***/ 958:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GoogleCloudApi =
/*#__PURE__*/
function () {
  function GoogleCloudApi() {
    _classCallCheck(this, GoogleCloudApi);
  }

  _createClass(GoogleCloudApi, [{
    key: "setAccessToken",
    value: function setAccessToken(accessToken) {
      if (!accessToken) console.error('Access token is empty');
      this.accessToken = accessToken;
    }
  }, {
    key: "getUrlBaseDicomWeb",
    value: function getUrlBaseDicomWeb(project, location, dataset, dicomStore) {
      return this.urlBase + "/projects/".concat(project, "/locations/").concat(location, "/datasets/").concat(dataset, "/dicomStores/").concat(dicomStore, "/dicomWeb");
    }
  }, {
    key: "getUrlPath",
    value: function getUrlPath(project, location, dataset, dicomStore) {
      "/projects/".concat(project, "/locations/").concat(location, "/datasets/").concat(dataset, "/dicomStores/").concat(dicomStore);
    }
  }, {
    key: "doRequest",
    value: function () {
      var _doRequest = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(urlStr) {
        var config,
            params,
            url,
            data,
            response,
            subPage,
            key,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                config = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                params = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
                url = new URL(urlStr);
                data = null;
                url.search = new URLSearchParams(params);
                _context.prev = 5;
                _context.next = 8;
                return fetch(url, _objectSpread({}, this.fetchConfig, {
                  config: config
                }));

              case 8:
                response = _context.sent;
                _context.prev = 9;
                _context.next = 12;
                return response.json();

              case 12:
                data = _context.sent;
                _context.next = 17;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](9);

              case 17:
                if (!(response.status >= 200 && response.status < 300 && data != null)) {
                  _context.next = 27;
                  break;
                }

                if (!(data.nextPageToken != null)) {
                  _context.next = 24;
                  break;
                }

                params.pageToken = data.nextPageToken;
                _context.next = 22;
                return this.doRequest(urlStr, config, params);

              case 22:
                subPage = _context.sent;

                for (key in data) {
                  if (data.hasOwnProperty(key)) {
                    data[key] = data[key].concat(subPage.data[key]);
                  }
                }

              case 24:
                return _context.abrupt("return", {
                  isError: false,
                  status: response.status,
                  data: data
                });

              case 27:
                return _context.abrupt("return", {
                  isError: true,
                  status: response.status,
                  message: data && data.error && data.error.message || 'Unknown error'
                });

              case 28:
                _context.next = 35;
                break;

              case 30:
                _context.prev = 30;
                _context.t1 = _context["catch"](5);

                if (!(data && data.error)) {
                  _context.next = 34;
                  break;
                }

                return _context.abrupt("return", {
                  isError: true,
                  status: _context.t1.status,
                  message: _context.t1.response.data.error.message || 'Unspecified error'
                });

              case 34:
                return _context.abrupt("return", {
                  isError: true,
                  message: _context.t1 && _context.t1.message || 'Oops! Something went wrong'
                });

              case 35:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 30], [9, 15]]);
      }));

      function doRequest(_x) {
        return _doRequest.apply(this, arguments);
      }

      return doRequest;
    }()
  }, {
    key: "loadProjects",
    value: function () {
      var _loadProjects = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.doRequest('https://cloudresourcemanager.googleapis.com/v1/projects'));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function loadProjects() {
        return _loadProjects.apply(this, arguments);
      }

      return loadProjects;
    }()
  }, {
    key: "loadLocations",
    value: function () {
      var _loadLocations = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(projectId) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.doRequest("".concat(this.urlBaseProject, "/").concat(projectId, "/locations")));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function loadLocations(_x2) {
        return _loadLocations.apply(this, arguments);
      }

      return loadLocations;
    }()
  }, {
    key: "loadDatasets",
    value: function () {
      var _loadDatasets = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(projectId, locationId) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", this.doRequest("".concat(this.urlBaseProject, "/").concat(projectId, "/locations/").concat(locationId, "/datasets")));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function loadDatasets(_x3, _x4) {
        return _loadDatasets.apply(this, arguments);
      }

      return loadDatasets;
    }()
  }, {
    key: "loadDicomStores",
    value: function () {
      var _loadDicomStores = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(dataset) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", this.doRequest("".concat(this.urlBase, "/").concat(dataset, "/dicomStores")));

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function loadDicomStores(_x5) {
        return _loadDicomStores.apply(this, arguments);
      }

      return loadDicomStores;
    }()
  }, {
    key: "fetchConfig",
    get: function get() {
      if (!this.accessToken) throw new Error('OIDC access_token is not set');
      return {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.accessToken
        }
      };
    }
  }, {
    key: "urlBase",
    get: function get() {
      return this.healthcareApiEndpoint || 'https://healthcare.googleapis.com/v1beta1';
    },
    set: function set(url) {
      this.healthcareApiEndpoint = url;
    }
  }, {
    key: "urlBaseProject",
    get: function get() {
      return this.urlBase + "/projects";
    }
  }]);

  return GoogleCloudApi;
}();

/* harmony default export */ __webpack_exports__["a"] = (new GoogleCloudApi());

/***/ }),

/***/ 963:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getServers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return isValidServer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isEqualServer; });
var getServers = function getServers(data, name) {
  var wadoUriRoot = data.wadoUriRoot,
      qidoRoot = data.qidoRoot,
      wadoRoot = data.wadoRoot,
      _data$dataset = data.dataset,
      dataset = _data$dataset === void 0 ? '' : _data$dataset,
      _data$dicomStore = data.dicomStore,
      dicomStore = _data$dicomStore === void 0 ? '' : _data$dicomStore,
      _data$location = data.location,
      location = _data$location === void 0 ? '' : _data$location,
      _data$project = data.project,
      project = _data$project === void 0 ? '' : _data$project;
  return [{
    name: name,
    dataset: dataset,
    dicomStore: dicomStore,
    location: location,
    project: project,
    imageRendering: 'wadors',
    thumbnailRendering: 'wadors',
    type: 'dicomWeb',
    active: true,
    wadoUriRoot: wadoUriRoot,
    qidoRoot: qidoRoot,
    wadoRoot: wadoRoot,
    supportsFuzzyMatching: false,
    qidoSupportsIncludeField: false
  }];
};

var isValidServer = function isValidServer(server) {
  return server && !!server.dataset && !!server.dicomStore && !!server.location && !!server.project;
};

var isEqualServer = function isEqualServer() {
  var server = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var toCompare = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var serverLength = Object.keys(server).length;
  var toCompareLength = Object.keys(toCompare).length;

  if (!serverLength || !toCompareLength) {
    return false;
  }

  return server.dataset === toCompare.dataset && server.dataset === toCompare.dataset && server.dicomStore === toCompare.dicomStore && server.location === toCompare.location && server.project === toCompare.project;
};



/***/ }),

/***/ 965:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return useServer; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _googleCloud_api_GoogleCloudApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(958);
/* harmony import */ var _usePrevious__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(957);
/* harmony import */ var _googleCloud_utils_getServers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(963);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(59);
/* harmony import */ var lodash_isequal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(227);
/* harmony import */ var lodash_isequal__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash_isequal__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(90);





 // Contexts



var getActiveServer = function getActiveServer(servers) {
  var isActive = function isActive(a) {
    return a.active === true;
  };

  return servers && servers.servers && servers.servers.find(isActive);
};

var getServers = function getServers(appConfig, project, location, dataset, dicomStore) {
  var servers = [];

  if (appConfig.enableGoogleCloudAdapter) {
    _googleCloud_api_GoogleCloudApi__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].urlBase = appConfig.healthcareApiEndpoint;
    var pathUrl = _googleCloud_api_GoogleCloudApi__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].getUrlBaseDicomWeb(project, location, dataset, dicomStore);
    var data = {
      project: project,
      location: location,
      dataset: dataset,
      dicomStore: dicomStore,
      wadoUriRoot: pathUrl,
      qidoRoot: pathUrl,
      wadoRoot: pathUrl
    };
    servers = _googleCloud_utils_getServers__WEBPACK_IMPORTED_MODULE_3__[/* getServers */ "a"](data, dicomStore);

    if (!isValidServer(servers[0], appConfig)) {
      return;
    }
  }

  return servers;
};

var isValidServer = function isValidServer(server, appConfig) {
  if (appConfig.enableGoogleCloudAdapter) {
    return _googleCloud_utils_getServers__WEBPACK_IMPORTED_MODULE_3__[/* isValidServer */ "c"](server);
  }

  return !!server;
};

var setServers = function setServers(dispatch, servers) {
  var action = {
    type: 'SET_SERVERS',
    servers: servers
  };
  dispatch(action);
};

var useServerFromUrl = function useServerFromUrl() {
  var servers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var previousServers = arguments.length > 1 ? arguments[1] : undefined;
  var activeServer = arguments.length > 2 ? arguments[2] : undefined;
  var urlBasedServers = arguments.length > 3 ? arguments[3] : undefined;
  var appConfig = arguments.length > 4 ? arguments[4] : undefined;
  var project = arguments.length > 5 ? arguments[5] : undefined;
  var location = arguments.length > 6 ? arguments[6] : undefined;
  var dataset = arguments.length > 7 ? arguments[7] : undefined;
  var dicomStore = arguments.length > 8 ? arguments[8] : undefined;

  // update state from url available only when gcloud on
  if (!appConfig.enableGoogleCloudAdapter) {
    return false;
  }

  var serverHasChanged = previousServers !== servers && previousServers; // do not update from url. use state instead.

  if (serverHasChanged) {
    return false;
  } // if no valid urlbased servers


  if (!urlBasedServers || !urlBasedServers.length) {
    return false;
  } else if (!servers.length || !activeServer) {
    // no current valid server
    return true;
  }

  var newServer = urlBasedServers[0];
  var exists = servers.some(_googleCloud_utils_getServers__WEBPACK_IMPORTED_MODULE_3__[/* isEqualServer */ "b"].bind(undefined, newServer));
  return !exists;
};

function useServer() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      project = _ref.project,
      location = _ref.location,
      dataset = _ref.dataset,
      dicomStore = _ref.dicomStore;

  // Hooks
  var servers = Object(react_redux__WEBPACK_IMPORTED_MODULE_4__[/* useSelector */ "d"])(function (state) {
    return state && state.servers;
  });
  var previousServers = Object(_usePrevious__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(servers);
  var dispatch = Object(react_redux__WEBPACK_IMPORTED_MODULE_4__[/* useDispatch */ "c"])();

  var _useContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_context_AppContext__WEBPACK_IMPORTED_MODULE_6__[/* default */ "c"]),
      _useContext$appConfig = _useContext.appConfig,
      appConfig = _useContext$appConfig === void 0 ? {} : _useContext$appConfig;

  var activeServer = getActiveServer(servers);
  var urlBasedServers = getServers(appConfig, project, location, dataset, dicomStore) || [];
  var shouldUpdateServer = useServerFromUrl(servers.servers, previousServers, activeServer, urlBasedServers, appConfig, project, location, dataset, dicomStore);

  if (shouldUpdateServer) {
    setServers(dispatch, urlBasedServers);
  } else if (isValidServer(activeServer, appConfig)) {
    return activeServer;
  }
}

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

/***/ 988:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ })

}]);