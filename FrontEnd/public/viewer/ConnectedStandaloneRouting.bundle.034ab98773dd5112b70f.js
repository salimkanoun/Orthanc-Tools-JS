(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ 949:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-redux/es/index.js + 21 modules
var es = __webpack_require__(58);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/index.js + 28 modules
var src = __webpack_require__(16);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/prop-types/index.js
var prop_types = __webpack_require__(1);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/querystring-es3/index.js
var querystring_es3 = __webpack_require__(986);
var querystring_es3_default = /*#__PURE__*/__webpack_require__.n(querystring_es3);

// EXTERNAL MODULE: ./App.js + 33 modules
var App = __webpack_require__(255);

// EXTERNAL MODULE: ./connectedComponents/ConnectedViewer.js + 16 modules
var ConnectedViewer = __webpack_require__(973);

// EXTERNAL MODULE: ./connectedComponents/ConnectedViewerRetrieveStudyData.js + 1 modules
var ConnectedViewerRetrieveStudyData = __webpack_require__(991);

// EXTERNAL MODULE: ./routes/NotFound.js
var NotFound = __webpack_require__(494);

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

/***/ 986:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(987);
exports.encode = exports.stringify = __webpack_require__(988);


/***/ }),

/***/ 987:
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

/***/ 988:
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