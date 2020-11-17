(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[9],{

/***/ 948:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/prop-types/index.js
var prop_types = __webpack_require__(1);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/utils/index.js + 15 modules
var utils = __webpack_require__(134);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/user.js
var user = __webpack_require__(41);

// EXTERNAL MODULE: ./connectedComponents/ConnectedViewerRetrieveStudyData.js + 1 modules
var ConnectedViewerRetrieveStudyData = __webpack_require__(991);

// EXTERNAL MODULE: ./customHooks/useServer.js
var useServer = __webpack_require__(985);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-router/esm/react-router.js + 1 modules
var react_router = __webpack_require__(75);

// CONCATENATED MODULE: ./customHooks/useQuery.js

/**
 * hook that builds on useLocation to parse
 * the query string for you.
 *
 * @name useQuery
 */

/* harmony default export */ var useQuery = (function () {
  return new URLSearchParams(Object(react_router["f" /* useLocation */])().search);
});
// CONCATENATED MODULE: ./routes/ViewerRouting.js


 //




var UrlUtil = utils["a" /* default */].urlUtil;
/**
 * Get array of seriesUIDs from param or from queryString
 * @param {*} seriesInstanceUIDs
 * @param {*} location
 */

var getSeriesInstanceUIDs = function getSeriesInstanceUIDs(seriesInstanceUIDs, routeLocation) {
  var queryFilters = UrlUtil.queryString.getQueryFilters(routeLocation);
  var querySeriesUIDs = queryFilters && queryFilters['seriesInstanceUID'];

  var _seriesInstanceUIDs = seriesInstanceUIDs || querySeriesUIDs;

  return UrlUtil.paramString.parseParam(_seriesInstanceUIDs);
};

function ViewerRouting(_ref) {
  var routeMatch = _ref.match,
      routeLocation = _ref.location;
  var _routeMatch$params = routeMatch.params,
      project = _routeMatch$params.project,
      location = _routeMatch$params.location,
      dataset = _routeMatch$params.dataset,
      dicomStore = _routeMatch$params.dicomStore,
      studyInstanceUIDs = _routeMatch$params.studyInstanceUIDs,
      seriesInstanceUIDs = _routeMatch$params.seriesInstanceUIDs; // Set the user's default authToken for outbound DICOMWeb requests.
  // Is only applied if target server does not set `requestOptions` property.
  //
  // See: `getAuthorizationHeaders.js`

  var query = useQuery();
  var authToken = query.get('token');

  if (authToken) {
    user["a" /* default */].getAccessToken = function () {
      return authToken;
    };
  }

  var server = Object(useServer["a" /* default */])({
    project: project,
    location: location,
    dataset: dataset,
    dicomStore: dicomStore
  });
  var studyUIDs = UrlUtil.paramString.parseParam(studyInstanceUIDs);
  var seriesUIDs = getSeriesInstanceUIDs(seriesInstanceUIDs, routeLocation);

  if (server && studyUIDs) {
    return react_default.a.createElement(ConnectedViewerRetrieveStudyData["a" /* default */], {
      studyInstanceUIDs: studyUIDs,
      seriesInstanceUIDs: seriesUIDs
    });
  }

  return null;
}

ViewerRouting.propTypes = {
  match: prop_types_default.a.shape({
    params: prop_types_default.a.shape({
      studyInstanceUIDs: prop_types_default.a.string.isRequired,
      seriesInstanceUIDs: prop_types_default.a.string,
      dataset: prop_types_default.a.string,
      dicomStore: prop_types_default.a.string,
      location: prop_types_default.a.string,
      project: prop_types_default.a.string
    })
  }),
  location: prop_types_default.a.any
};
/* harmony default export */ var routes_ViewerRouting = __webpack_exports__["default"] = (ViewerRouting);

/***/ }),

/***/ 964:
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

/***/ 972:
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

/***/ 985:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return useServer; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _googleCloud_api_GoogleCloudApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(964);
/* harmony import */ var _usePrevious__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(968);
/* harmony import */ var _googleCloud_utils_getServers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(972);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(58);
/* harmony import */ var lodash_isequal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(229);
/* harmony import */ var lodash_isequal__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash_isequal__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(76);





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

/***/ })

}]);