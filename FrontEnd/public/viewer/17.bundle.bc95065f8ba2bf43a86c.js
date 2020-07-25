(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[17],{

/***/ 1007:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_resize_detector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1004);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(964);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_2__);
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





var DicomMicroscopyViewport =
/*#__PURE__*/
function (_Component) {
  _inherits(DicomMicroscopyViewport, _Component);

  function DicomMicroscopyViewport(props) {
    var _this;

    _classCallCheck(this, DicomMicroscopyViewport);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DicomMicroscopyViewport).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "state", {
      error: null
    });

    _defineProperty(_assertThisInitialized(_this), "viewer", null);

    _defineProperty(_assertThisInitialized(_this), "onWindowResize", function () {
      _this.debouncedResize();
    });

    _this.container = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    _this.debouncedResize = lodash_debounce__WEBPACK_IMPORTED_MODULE_2___default()(function () {
      if (_this.viewer) _this.viewer.resize();
    }, 100);
    return _this;
  } // install the microscopy renderer into the web page.
  // you should only do this once.


  _createClass(DicomMicroscopyViewport, [{
    key: "installOpenLayersRenderer",
    value: function installOpenLayersRenderer(container, displaySet) {
      var _this2 = this;

      var dicomWebClient = displaySet.dicomWebClient;
      var searchInstanceOptions = {
        studyInstanceUID: displaySet.StudyInstanceUID,
        seriesInstanceUID: displaySet.SeriesInstanceUID
      };
      dicomWebClient.searchForInstances(searchInstanceOptions).then(function (instances) {
        var promises = [];

        for (var i = 0; i < instances.length; i++) {
          var sopInstanceUID = instances[i]['00080018']['Value'][0];
          var retrieveInstanceOptions = {
            studyInstanceUID: displaySet.StudyInstanceUID,
            seriesInstanceUID: displaySet.SeriesInstanceUID,
            sopInstanceUID: sopInstanceUID
          };
          var promise = dicomWebClient.retrieveInstanceMetadata(retrieveInstanceOptions).then(function (metadata) {
            var ImageType = metadata[0]['00080008']['Value'];

            if (ImageType[2] === 'VOLUME') {
              return metadata[0];
            }
          });
          promises.push(promise);
        }

        return Promise.all(promises);
      }).then(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(metadata) {
          var _ref2, api, microscopyViewer;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  metadata = metadata.filter(function (m) {
                    return m;
                  });
                  _context.next = 3;
                  return __webpack_require__.e(/* import() | dicom-microscopy-viewer */ 10).then(__webpack_require__.t.bind(null, 1003, 7));

                case 3:
                  _ref2 = _context.sent;
                  api = _ref2.api;
                  microscopyViewer = api.VLWholeSlideMicroscopyImageViewer;
                  _this2.viewer = new microscopyViewer({
                    client: dicomWebClient,
                    metadata: metadata,
                    retrieveRendered: false
                  });

                  _this2.viewer.render({
                    container: container
                  });

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var displaySet = this.props.viewportData.displaySet;
      this.installOpenLayersRenderer(this.container.current, displaySet);
    }
  }, {
    key: "render",
    value: function render() {
      var style = {
        width: '100%',
        height: '100%'
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: 'DicomMicroscopyViewer',
        style: style
      }, react_resize_detector__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"] && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_resize_detector__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"], {
        handleWidth: true,
        handleHeight: true,
        onResize: this.onWindowResize
      }), this.state.error ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, JSON.stringify(this.state.error)) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: style,
        ref: this.container
      }));
    }
  }]);

  return DicomMicroscopyViewport;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (DicomMicroscopyViewport);

/***/ })

}]);