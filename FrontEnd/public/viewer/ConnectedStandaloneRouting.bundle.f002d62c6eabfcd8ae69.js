(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ 942:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-redux/es/index.js + 21 modules
var es = __webpack_require__(59);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/index.js + 33 modules
var src = __webpack_require__(13);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/prop-types/index.js
var prop_types = __webpack_require__(1);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/querystring-es3/index.js
var querystring_es3 = __webpack_require__(966);
var querystring_es3_default = /*#__PURE__*/__webpack_require__.n(querystring_es3);

// EXTERNAL MODULE: ./App.js + 33 modules
var App = __webpack_require__(253);

// EXTERNAL MODULE: ./connectedComponents/ConnectedViewer.js + 16 modules
var ConnectedViewer = __webpack_require__(960);

// EXTERNAL MODULE: ./connectedComponents/ConnectedViewerRetrieveStudyData.js + 1 modules
var ConnectedViewerRetrieveStudyData = __webpack_require__(961);

// EXTERNAL MODULE: ./routes/NotFound.js
var NotFound = __webpack_require__(492);

// CONCATENATED MODULE: ./routes/StandaloneRouting.js
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









var log = src["a" /* default */].log,
    metadata = src["a" /* default */].metadata,
    utils = src["a" /* default */].utils;
var studyMetadataManager = utils.studyMetadataManager;
var OHIFStudyMetadata = metadata.OHIFStudyMetadata;

var StandaloneRouting_StandaloneRouting =
/*#__PURE__*/
function (_Component) {
  _inherits(StandaloneRouting, _Component);

  function StandaloneRouting() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, StandaloneRouting);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(StandaloneRouting)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      studies: null,
      server: null,
      studyInstanceUIDs: null,
      seriesInstanceUIDs: null,
      error: null,
      loading: true
    });

    return _this;
  }

  _createClass(StandaloneRouting, [{
    key: "parseQueryAndRetrieveDICOMWebData",
    value: function parseQueryAndRetrieveDICOMWebData(query) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var url = query.url;

        if (!url) {
          return reject(new Error('No URL was specified. Use ?url=$yourURL'));
        } // Define a request to the server to retrieve the study data
        // as JSON, given a URL that was in the Route


        var oReq = new XMLHttpRequest(); // Add event listeners for request failure

        oReq.addEventListener('error', function (error) {
          log.warn('An error occurred while retrieving the JSON data');
          reject(error);
        }); // When the JSON has been returned, parse it into a JavaScript Object
        // and render the OHIF Viewer with this data

        oReq.addEventListener('load', function (event) {
          if (event.target.status === 404) {
            reject(new Error('No JSON data found'));
          } // Parse the response content
          // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText


          if (!oReq.responseText) {
            log.warn('Response was undefined');
            reject(new Error('Response was undefined'));
          }

          log.info(JSON.stringify(oReq.responseText, null, 2));
          var data = JSON.parse(oReq.responseText);

          if (data.servers) {
            if (!query.studyInstanceUIDs) {
              log.warn('No study instance uids specified');
              reject(new Error('No study instance uids specified'));
            }

            var server = data.servers.dicomWeb[0];
            server.type = 'dicomWeb';
            log.warn('Activating server', server);

            _this2.props.activateServer(server);

            var studyInstanceUIDs = query.studyInstanceUIDs.split(';');
            var seriesInstanceUIDs = query.seriesInstanceUIDs ? query.seriesInstanceUIDs.split(';') : [];
            resolve({
              server: server,
              studyInstanceUIDs: studyInstanceUIDs,
              seriesInstanceUIDs: seriesInstanceUIDs
            });
          } else {
            // Parse data here and add to metadata provider.
            var metadataProvider = src["a" /* default */].cornerstone.metadataProvider;
            var StudyInstanceUID;
            var SeriesInstanceUID;
            data.studies.forEach(function (study) {
              StudyInstanceUID = study.StudyInstanceUID;
              study.series.forEach(function (series) {
                SeriesInstanceUID = series.SeriesInstanceUID;
                series.instances.forEach(function (instance) {
                  var imageId = instance.url,
                      naturalizedDicom = instance.metadata; // Add instance to metadata provider.

                  metadataProvider.addInstance(naturalizedDicom); // Add imageId specific mapping to this data as the URL isn't necessarliy WADO-URI.

                  metadataProvider.addImageIdToUIDs(imageId, {
                    StudyInstanceUID: StudyInstanceUID,
                    SeriesInstanceUID: SeriesInstanceUID,
                    SOPInstanceUID: naturalizedDicom.SOPInstanceUID
                  });
                });
              });
            });
            resolve({
              studies: data.studies,
              studyInstanceUIDs: []
            });
          }
        }); // Open the Request to the server for the JSON data
        // In this case we have a server-side route called /api/
        // which responds to GET requests with the study data

        log.info("Sending Request to: ".concat(url));
        oReq.open('GET', url);
        oReq.setRequestHeader('Accept', 'application/json'); // Fire the request to the server

        oReq.send();
      });
    }
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var search, query, _ref, server, studies, studyInstanceUIDs, seriesInstanceUIDs, _mapStudiesToNewForma, updatedStudies, updatedStudiesInstanceUIDs;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                search = this.props.location.search; // Remove ? prefix which is included for some reason

                search = search.slice(1, search.length);
                query = querystring_es3_default.a.parse(search);
                _context.next = 6;
                return this.parseQueryAndRetrieveDICOMWebData(query);

              case 6:
                _ref = _context.sent;
                server = _ref.server;
                studies = _ref.studies;
                studyInstanceUIDs = _ref.studyInstanceUIDs;
                seriesInstanceUIDs = _ref.seriesInstanceUIDs;

                if (studies) {
                  _mapStudiesToNewForma = StandaloneRouting_mapStudiesToNewFormat(studies), updatedStudies = _mapStudiesToNewForma.studies, updatedStudiesInstanceUIDs = _mapStudiesToNewForma.studyInstanceUIDs;
                  studies = updatedStudies;
                  studyInstanceUIDs = updatedStudiesInstanceUIDs;
                }

                this.setState({
                  studies: studies,
                  server: server,
                  studyInstanceUIDs: studyInstanceUIDs,
                  seriesInstanceUIDs: seriesInstanceUIDs,
                  loading: false
                });
                _context.next = 18;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](0);
                this.setState({
                  error: _context.t0.message,
                  loading: false
                });

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 15]]);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var message = this.state.error ? "Error: ".concat(JSON.stringify(this.state.error)) : 'Loading...';

      if (this.state.error || this.state.loading) {
        return react_default.a.createElement(NotFound["a" /* default */], {
          message: message,
          showGoBackButton: this.state.error
        });
      }

      return this.state.studies ? react_default.a.createElement(ConnectedViewer["a" /* default */], {
        studies: this.state.studies
      }) : react_default.a.createElement(ConnectedViewerRetrieveStudyData["a" /* default */], {
        studyInstanceUIDs: this.state.studyInstanceUIDs,
        seriesInstanceUIDs: this.state.seriesInstanceUIDs,
        server: this.state.server
      });
    }
  }]);

  return StandaloneRouting;
}(react["Component"]);

_defineProperty(StandaloneRouting_StandaloneRouting, "propTypes", {
  location: prop_types_default.a.object,
  store: prop_types_default.a.object,
  setServers: prop_types_default.a.func
});

var StandaloneRouting_mapStudiesToNewFormat = function _mapStudiesToNewFormat(studies) {
  studyMetadataManager.purge();
  /* Map studies to new format, update metadata manager? */

  var uniqueStudyUIDs = new Set();
  var updatedStudies = studies.map(function (study) {
    var studyMetadata = new OHIFStudyMetadata(study, study.StudyInstanceUID);
    var sopClassHandlerModules = App["c" /* extensionManager */].modules['sopClassHandlerModule'];
    study.displaySets = study.displaySets || studyMetadata.createDisplaySets(sopClassHandlerModules);
    studyMetadata.setDisplaySets(study.displaySets);
    studyMetadataManager.add(studyMetadata);
    uniqueStudyUIDs.add(study.StudyInstanceUID);
    return study;
  });
  return {
    studies: updatedStudies,
    studyInstanceUIDs: Array.from(uniqueStudyUIDs)
  };
};

/* harmony default export */ var routes_StandaloneRouting = (StandaloneRouting_StandaloneRouting);
// CONCATENATED MODULE: ./connectedComponents/ConnectedStandaloneRouting.js



var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    activateServer: function activateServer(server) {
      var action = {
        type: 'ACTIVATE_SERVER',
        server: server
      };
      dispatch(action);
    }
  };
};

var ConnectedStandaloneRouting = Object(es["b" /* connect */])(null, mapDispatchToProps)(routes_StandaloneRouting);
/* harmony default export */ var connectedComponents_ConnectedStandaloneRouting = __webpack_exports__["default"] = (ConnectedStandaloneRouting);

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

/***/ 959:
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(577);

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;


/***/ }),

/***/ 961:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-redux/es/index.js + 21 modules
var es = __webpack_require__(59);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/classes/metadata/index.js + 3 modules
var metadata = __webpack_require__(84);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/studies/index.js + 6 modules
var src_studies = __webpack_require__(163);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/utils/index.js + 15 modules
var utils = __webpack_require__(133);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/log.js
var log = __webpack_require__(7);

// EXTERNAL MODULE: ./customHooks/usePrevious.js
var usePrevious = __webpack_require__(957);

// EXTERNAL MODULE: ./connectedComponents/ConnectedViewer.js + 16 modules
var ConnectedViewer = __webpack_require__(960);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/prop-types/index.js
var prop_types = __webpack_require__(1);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// EXTERNAL MODULE: ./App.js + 33 modules
var App = __webpack_require__(253);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/ui/src/index.js + 119 modules
var src = __webpack_require__(16);

// EXTERNAL MODULE: ./context/AppContext.js
var AppContext = __webpack_require__(90);

// CONCATENATED MODULE: ./connectedComponents/ViewerRetrieveStudyData.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }







 // Contexts


var OHIFStudyMetadata = metadata["a" /* default */].OHIFStudyMetadata,
    OHIFSeriesMetadata = metadata["a" /* default */].OHIFSeriesMetadata;
var retrieveStudiesMetadata = src_studies["a" /* default */].retrieveStudiesMetadata,
    deleteStudyMetadataPromise = src_studies["a" /* default */].deleteStudyMetadataPromise;
var studyMetadataManager = utils["a" /* default */].studyMetadataManager,
    makeCancelable = utils["a" /* default */].makeCancelable;

var _promoteToFront = function _promoteToFront(list, value, searchMethod) {
  var response = _toConsumableArray(list);

  var promoted = false;
  var index = response.findIndex(searchMethod.bind(undefined, value));

  if (index > 0) {
    var first = response.splice(index, 1);
    response = [].concat(_toConsumableArray(first), _toConsumableArray(response));
  }

  if (index >= 0) {
    promoted = true;
  }

  return {
    promoted: promoted,
    data: response
  };
};
/**
 * Promote series to front if find found equivalent on filters object
 * @param {Object} study - study reference to promote series against
 * @param {Object} [filters] - Object containing filters to be applied
 * @param {string} [filter.seriesInstanceUID] - series instance uid to filter results against
 * @param {boolean} isFilterStrategy - if filtering by query param strategy ON
 */


var _promoteList = function _promoteList(study, studyMetadata, filters, isFilterStrategy) {
  var promoted = false; // Promote only if no filter should be applied

  if (!isFilterStrategy) {
    _sortStudyDisplaySet(study, studyMetadata);

    promoted = _promoteStudyDisplaySet(study, studyMetadata, filters);
  }

  return promoted;
};

var _promoteStudyDisplaySet = function _promoteStudyDisplaySet(study, studyMetadata, filters) {
  var promoted = false;
  var queryParamsLength = Object.keys(filters).length;
  var shouldPromoteToFront = queryParamsLength > 0;

  if (shouldPromoteToFront) {
    var seriesInstanceUID = filters.seriesInstanceUID;

    var _seriesLookup = function _seriesLookup(valueToCompare, displaySet) {
      return displaySet.SeriesInstanceUID === valueToCompare;
    };

    var promotedResponse = _promoteToFront(studyMetadata.getDisplaySets(), seriesInstanceUID, _seriesLookup);

    study.displaySets = promotedResponse.data;
    promoted = promotedResponse.promoted;
  }

  return promoted;
};
/**
 * Method to identify if query param (from url) was applied to given list
 * @param {Object} study - study reference to promote series against
 * @param {Object} [filters] - Object containing filters to be applied
 * @param {string} [filter.seriesInstanceUID] - series instance uid to filter results against
 * @param {boolean} isFilterStrategy - if filtering by query param strategy ON
 */


var _isQueryParamApplied = function _isQueryParamApplied(study) {
  var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isFilterStrategy = arguments.length > 2 ? arguments[2] : undefined;
  var seriesInstanceUID = filters.seriesInstanceUID;
  var applied = true; // skip in case no filter or no toast manager

  if (!seriesInstanceUID) {
    return applied;
  }

  var _study$series = study.series,
      series = _study$series === void 0 ? [] : _study$series,
      _study$displaySets = study.displaySets,
      displaySets = _study$displaySets === void 0 ? [] : _study$displaySets;
  var firstSeries = isFilterStrategy ? series[0] : displaySets[0];

  if (!firstSeries || firstSeries.SeriesInstanceUID !== seriesInstanceUID) {
    applied = false;
  }

  return applied;
};

var _showUserMessage = function _showUserMessage(queryParamApplied, message) {
  var dialog = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (queryParamApplied) {
    return;
  }

  var _dialog$show = dialog.show,
      showUserMessage = _dialog$show === void 0 ? function () {} : _dialog$show;
  showUserMessage({
    message: message
  });
};

var ViewerRetrieveStudyData_addSeriesToStudy = function _addSeriesToStudy(studyMetadata, series) {
  var sopClassHandlerModules = App["c" /* extensionManager */].modules['sopClassHandlerModule'];
  var study = studyMetadata.getData();
  var seriesMetadata = new OHIFSeriesMetadata(series, study);
  var existingSeries = studyMetadata.getSeriesByUID(series.SeriesInstanceUID);

  if (existingSeries) {
    studyMetadata.updateSeries(series.SeriesInstanceUID, seriesMetadata);
  } else {
    studyMetadata.addSeries(seriesMetadata);
  }

  studyMetadata.createAndAddDisplaySetsForSeries(sopClassHandlerModules, seriesMetadata);
  study.displaySets = studyMetadata.getDisplaySets();
  study.derivedDisplaySets = studyMetadata.getDerivedDatasets({
    Modality: series.Modality
  });

  _updateStudyMetadataManager(study, studyMetadata);
};

var _updateStudyMetadataManager = function _updateStudyMetadataManager(study, studyMetadata) {
  var StudyInstanceUID = study.StudyInstanceUID;

  if (!studyMetadataManager.get(StudyInstanceUID)) {
    studyMetadataManager.add(studyMetadata);
  }
};

var ViewerRetrieveStudyData_updateStudyDisplaySets = function _updateStudyDisplaySets(study, studyMetadata) {
  var sopClassHandlerModules = App["c" /* extensionManager */].modules['sopClassHandlerModule'];

  if (!study.displaySets) {
    study.displaySets = studyMetadata.createDisplaySets(sopClassHandlerModules);
  }

  if (study.derivedDisplaySets) {
    studyMetadata._addDerivedDisplaySets(study.derivedDisplaySets);
  }

  studyMetadata.setDisplaySets(study.displaySets);
};

var _sortStudyDisplaySet = function _sortStudyDisplaySet(study, studyMetadata) {
  studyMetadata.sortDisplaySets(study.displaySets);
};

var _thinStudyData = function _thinStudyData(study) {
  return {
    StudyInstanceUID: study.StudyInstanceUID,
    series: study.series.map(function (item) {
      return {
        SeriesInstanceUID: item.SeriesInstanceUID
      };
    })
  };
};

function ViewerRetrieveStudyData(_ref) {
  var server = _ref.server,
      studyInstanceUIDs = _ref.studyInstanceUIDs,
      seriesInstanceUIDs = _ref.seriesInstanceUIDs,
      clearViewportSpecificData = _ref.clearViewportSpecificData,
      setStudyData = _ref.setStudyData;

  // hooks
  var _useState = Object(react["useState"])(false),
      _useState2 = _slicedToArray(_useState, 2),
      error = _useState2[0],
      setError = _useState2[1];

  var _useState3 = Object(react["useState"])([]),
      _useState4 = _slicedToArray(_useState3, 2),
      studies = _useState4[0],
      setStudies = _useState4[1];

  var _useState5 = Object(react["useState"])(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isStudyLoaded = _useState6[0],
      setIsStudyLoaded = _useState6[1];

  var snackbarContext = Object(src["L" /* useSnackbarContext */])();

  var _useContext = Object(react["useContext"])(AppContext["c" /* default */]),
      _useContext$appConfig = _useContext.appConfig,
      appConfig = _useContext$appConfig === void 0 ? {} : _useContext$appConfig;

  var _appConfig$filterQuer = appConfig.filterQueryParam,
      isFilterStrategy = _appConfig$filterQuer === void 0 ? false : _appConfig$filterQuer,
      maxConcurrentMetadataRequests = appConfig.maxConcurrentMetadataRequests;
  var cancelableSeriesPromises;
  var cancelableStudiesPromises;
  /**
   * Callback method when study is totally loaded
   * @param {object} study study loaded
   * @param {object} studyMetadata studyMetadata for given study
   * @param {Object} [filters] - Object containing filters to be applied
   * @param {string} [filter.seriesInstanceUID] - series instance uid to filter results against
   */

  var studyDidLoad = function studyDidLoad(study, studyMetadata, filters) {
    // User message
    var promoted = _promoteList(study, studyMetadata, filters, isFilterStrategy); // Clear viewport to allow new promoted one to be displayed


    if (promoted) {
      clearViewportSpecificData(0);
    }

    var isQueryParamApplied = _isQueryParamApplied(study, filters, isFilterStrategy); // Show message in case not promoted neither filtered but should to


    _showUserMessage(isQueryParamApplied, 'Query parameters were not applied. Using original series list for given study.', snackbarContext);

    setStudies([].concat(_toConsumableArray(studies), [study]));
    setIsStudyLoaded(true);
  };
  /**
   * Method to process studies. It will update displaySet, studyMetadata, load remaining series, ...
   * @param {Array} studiesData Array of studies retrieved from server
   * @param {Object} [filters] - Object containing filters to be applied
   * @param {string} [filter.seriesInstanceUID] - series instance uid to filter results against
   */


  var processStudies = function processStudies(studiesData, filters) {
    if (Array.isArray(studiesData) && studiesData.length > 0) {
      // Map studies to new format, update metadata manager?
      var _studies = studiesData.map(function (study) {
        setStudyData(study.StudyInstanceUID, _thinStudyData(study));
        var studyMetadata = new OHIFStudyMetadata(study, study.StudyInstanceUID);

        ViewerRetrieveStudyData_updateStudyDisplaySets(study, studyMetadata);

        _updateStudyMetadataManager(study, studyMetadata); // Attempt to load remaning series if any


        cancelableSeriesPromises[study.StudyInstanceUID] = makeCancelable(loadRemainingSeries(studyMetadata)).then(function (result) {
          if (result && !result.isCanceled) {
            studyDidLoad(study, studyMetadata, filters);
          }
        }).catch(function (error) {
          if (error && !error.isCanceled) {
            setError(true);
            log["a" /* default */].error(error);
          }
        });
        return study;
      });

      setStudies(_studies);
    }
  };

  var forceRerender = function forceRerender() {
    return setStudies(function (studies) {
      return _toConsumableArray(studies);
    });
  };

  var loadRemainingSeries =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(studyMetadata) {
      var _studyMetadata$getDat, seriesLoader, loadNextSeries, concurrentRequestsAllowed, promises;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _studyMetadata$getDat = studyMetadata.getData(), seriesLoader = _studyMetadata$getDat.seriesLoader;

              if (seriesLoader) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return");

            case 3:
              loadNextSeries =
              /*#__PURE__*/
              function () {
                var _ref3 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee() {
                  var series;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (seriesLoader.hasNext()) {
                            _context.next = 2;
                            break;
                          }

                          return _context.abrupt("return");

                        case 2:
                          _context.next = 4;
                          return seriesLoader.next();

                        case 4:
                          series = _context.sent;

                          ViewerRetrieveStudyData_addSeriesToStudy(studyMetadata, series);

                          forceRerender();
                          return _context.abrupt("return", loadNextSeries());

                        case 8:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function loadNextSeries() {
                  return _ref3.apply(this, arguments);
                };
              }();

              concurrentRequestsAllowed = maxConcurrentMetadataRequests || studyMetadata.getSeriesCount();
              promises = Array(concurrentRequestsAllowed).fill(null).map(loadNextSeries);
              _context2.next = 8;
              return Promise.all(promises);

            case 8:
              return _context2.abrupt("return", _context2.sent);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function loadRemainingSeries(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var loadStudies =
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var filters, seriesInstanceUID, retrieveParams;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              try {
                filters = {}; // Use the first, discard others

                seriesInstanceUID = seriesInstanceUIDs && seriesInstanceUIDs[0];
                retrieveParams = [server, studyInstanceUIDs];

                if (seriesInstanceUID) {
                  filters.seriesInstanceUID = seriesInstanceUID; // Query param filtering controlled by appConfig property

                  if (isFilterStrategy) {
                    retrieveParams.push(filters);
                  }
                }

                cancelableStudiesPromises[studyInstanceUIDs] = makeCancelable(retrieveStudiesMetadata.apply(void 0, retrieveParams)).then(function (result) {
                  if (result && !result.isCanceled) {
                    processStudies(result, filters);
                  }
                }).catch(function (error) {
                  if (error && !error.isCanceled) {
                    setError(true);
                    log["a" /* default */].error(error);
                  }
                });
              } catch (error) {
                if (error) {
                  setError(true);
                  log["a" /* default */].error(error);
                }
              }

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function loadStudies() {
      return _ref4.apply(this, arguments);
    };
  }();

  var purgeCancellablePromises = Object(react["useCallback"])(function () {
    for (var _studyInstanceUIDs in cancelableStudiesPromises) {
      if ('cancel' in cancelableStudiesPromises[_studyInstanceUIDs]) {
        cancelableStudiesPromises[_studyInstanceUIDs].cancel();
      }
    }

    for (var _studyInstanceUIDs2 in cancelableSeriesPromises) {
      if ('cancel' in cancelableSeriesPromises[_studyInstanceUIDs2]) {
        cancelableSeriesPromises[_studyInstanceUIDs2].cancel();

        deleteStudyMetadataPromise(_studyInstanceUIDs2);
        studyMetadataManager.remove(_studyInstanceUIDs2);
      }
    }
  });
  var prevStudyInstanceUIDs = Object(usePrevious["a" /* default */])(studyInstanceUIDs);
  Object(react["useEffect"])(function () {
    var hasStudyInstanceUIDsChanged = !(prevStudyInstanceUIDs && prevStudyInstanceUIDs.every(function (e) {
      return studyInstanceUIDs.includes(e);
    }));

    if (hasStudyInstanceUIDsChanged) {
      studyMetadataManager.purge();
      purgeCancellablePromises();
    }
  }, [prevStudyInstanceUIDs, purgeCancellablePromises, studyInstanceUIDs]);
  Object(react["useEffect"])(function () {
    cancelableSeriesPromises = {};
    cancelableStudiesPromises = {};
    loadStudies();
    return function () {
      purgeCancellablePromises();
    };
  }, []);

  if (error) {
    return react_default.a.createElement("div", null, "Error: ", JSON.stringify(error));
  }

  return react_default.a.createElement(ConnectedViewer["a" /* default */], {
    studies: studies,
    isStudyLoaded: isStudyLoaded,
    studyInstanceUIDs: studyInstanceUIDs
  });
}

ViewerRetrieveStudyData.propTypes = {
  studyInstanceUIDs: prop_types_default.a.array.isRequired,
  seriesInstanceUIDs: prop_types_default.a.array,
  server: prop_types_default.a.object,
  clearViewportSpecificData: prop_types_default.a.func.isRequired,
  setStudyData: prop_types_default.a.func.isRequired
};
/* harmony default export */ var connectedComponents_ViewerRetrieveStudyData = (ViewerRetrieveStudyData);
// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/index.js + 33 modules
var core_src = __webpack_require__(13);

// CONCATENATED MODULE: ./connectedComponents/ConnectedViewerRetrieveStudyData.js



var _OHIF$redux$actions = core_src["a" /* default */].redux.actions,
    _clearViewportSpecificData = _OHIF$redux$actions.clearViewportSpecificData,
    _setStudyData = _OHIF$redux$actions.setStudyData;

var isActive = function isActive(a) {
  return a.active === true;
};

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var activeServer = state.servers.servers.find(isActive);
  return {
    server: ownProps.server || activeServer
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    setStudyData: function setStudyData(StudyInstanceUID, data) {
      dispatch(_setStudyData(StudyInstanceUID, data));
    },
    clearViewportSpecificData: function clearViewportSpecificData() {
      dispatch(_clearViewportSpecificData());
    }
  };
};

var ConnectedViewerRetrieveStudyData = Object(es["b" /* connect */])(mapStateToProps, mapDispatchToProps)(connectedComponents_ViewerRetrieveStudyData);
/* harmony default export */ var connectedComponents_ConnectedViewerRetrieveStudyData = __webpack_exports__["a"] = (ConnectedViewerRetrieveStudyData);

/***/ }),

/***/ 962:
/***/ (function(module, exports, __webpack_require__) {

var baseValues = __webpack_require__(959),
    keys = __webpack_require__(254);

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;


/***/ }),

/***/ 966:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(967);
exports.encode = exports.stringify = __webpack_require__(968);


/***/ }),

/***/ 967:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 968:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ })

}]);