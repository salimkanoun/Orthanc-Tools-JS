(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[12],{

/***/ 1001:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 1008:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/index.js + 33 modules
var src = __webpack_require__(13);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-redux/es/index.js + 21 modules
var es = __webpack_require__(59);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/prop-types/index.js
var prop_types = __webpack_require__(1);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// CONCATENATED MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-pdf/src/OHIFComponentPlugin.js



function OHIFComponentPlugin(props) {
  return react_default.a.createElement(react_default.a.Fragment, null, props.children);
}

OHIFComponentPlugin.propTypes = {
  id: prop_types_default.a.string.isRequired,
  init: prop_types_default.a.func.isRequired,
  destroy: prop_types_default.a.func.isRequired,
  children: prop_types_default.a.node
};
/* harmony default export */ var src_OHIFComponentPlugin = (OHIFComponentPlugin);
// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/dicom-parser/dist/dicomParser.min.js
var dicomParser_min = __webpack_require__(97);
var dicomParser_min_default = /*#__PURE__*/__webpack_require__.n(dicomParser_min);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/pdfjs-dist/build/pdf.js
var build_pdf = __webpack_require__(970);
var pdf_default = /*#__PURE__*/__webpack_require__.n(build_pdf);

// CONCATENATED MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-pdf/src/TypedArrayProp.js
// https://github.com/facebook/prop-types/issues/69
var TypedArrayProp = {
  any: function any(props, propName, componentName) {
    var obj = props[propName];

    if (!(obj instanceof Float64Array || obj instanceof Float32Array || obj instanceof Int32Array || obj instanceof Int16Array || obj instanceof Int8Array || obj instanceof Uint32Array || obj instanceof Uint16Array || obj instanceof Uint8Array || obj instanceof Uint8ClampedArray)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected a typed array.');
    }
  },
  float64: function float64(props, propName, componentName) {
    if (!(props[propName] instanceof Float64Array)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected a Float64Array.');
    }
  },
  float32: function float32(props, propName, componentName) {
    if (!(props[propName] instanceof Float32Array)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected a Float32Array.');
    }
  },
  float: function float(props, propName, componentName) {
    if (!(props[propName] instanceof Float64Array || props[propName] instanceof Float32Array)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected a Float32Array or Float64Array.');
    }
  },
  int32: function int32(props, propName, componentName) {
    if (!(props[propName] instanceof Int32Array)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected an Int32Array.');
    }
  },
  int16: function int16(props, propName, componentName) {
    if (!(props[propName] instanceof Int16Array)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected an In16Array.');
    }
  },
  int8: function int8(props, propName, componentName) {
    if (!(props[propName] instanceof Int8Array)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected an Int8Array.');
    }
  },
  int: function int(props, propName, componentName) {
    if (!(props[propName] instanceof Int32Array || props[propName] instanceof Int16Array || props[propName] instanceof Int8Array)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected an Int32Array, In16Array, or Int8Array.');
    }
  },
  uint32: function uint32(props, propName, componentName) {
    if (!(props[propName] instanceof Uint32Array)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected a Uint32Array.');
    }
  },
  uint16: function uint16(props, propName, componentName) {
    if (!(props[propName] instanceof Uint16Array)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected a Uint16Array.');
    }
  },
  uint8: function uint8(props, propName, componentName) {
    if (!(props[propName] instanceof Uint8Array)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected a Uint8Array.');
    }
  },
  uint8clamped: function uint8clamped(props, propName, componentName) {
    if (!(props[propName] instanceof Uint8ClampedArray)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected a Uint8ClampedArray.');
    }
  },
  uint: function uint(props, propName, componentName) {
    if (!(props[propName] instanceof Uint32Array || props[propName] instanceof Uint16Array || props[propName] instanceof Uint8Array || props[propName] instanceof Uint8ClampedArray)) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Expected a Uint32Array, Uint16Array, Uint8Array, or Uint8ClampedArray.');
    }
  }
};

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-pdf/src/DicomPDFViewport.css
var src_DicomPDFViewport = __webpack_require__(1001);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/pdfjs-dist/build/pdf.worker.entry.js
var pdf_worker_entry = __webpack_require__(1002);
var pdf_worker_entry_default = /*#__PURE__*/__webpack_require__.n(pdf_worker_entry);

// CONCATENATED MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-pdf/src/DicomPDFViewport.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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









pdf_default.a.GlobalWorkerOptions.workerSrc = pdf_worker_entry_default.a; // TODO: Should probably use dcmjs for this

var SOP_CLASS_UIDS = {
  ENCAPSULATED_PDF: '1.2.840.10008.5.1.4.1.1.104.1'
};

var DicomPDFViewport_DicomPDFViewport =
/*#__PURE__*/
function (_Component) {
  _inherits(DicomPDFViewport, _Component);

  function DicomPDFViewport(props) {
    var _this;

    _classCallCheck(this, DicomPDFViewport);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DicomPDFViewport).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "updatePDFCanvas",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var _this$state, pdf, scale, currentPageIndex, context, page, viewport, renderContext, textContent;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$state = _this.state, pdf = _this$state.pdf, scale = _this$state.scale, currentPageIndex = _this$state.currentPageIndex;
              context = _this.canvas.getContext('2d');
              _context.next = 4;
              return pdf.getPage(currentPageIndex);

            case 4:
              page = _context.sent;
              viewport = page.getViewport({
                scale: scale
              });
              _this.canvas.height = viewport.height;
              _this.canvas.width = viewport.width;
              renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              _context.next = 11;
              return page.render(renderContext);

            case 11:
              _context.next = 13;
              return page.getTextContent();

            case 13:
              textContent = _context.sent;
              _this.textLayer.innerHTML = '';
              _this.textLayer.style.height = viewport.height + 'px';
              _this.textLayer.style.width = viewport.width + 'px';
              pdf_default.a.renderTextLayer({
                textContent: textContent,
                container: _this.textLayer,
                viewport: viewport,
                textDivs: []
              });

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    _defineProperty(_assertThisInitialized(_this), "getPDFFileUrl", function (dataSet, byteArray) {
      var pdfByteArray = byteArray;

      if (dataSet) {
        var SOPClassUID = dataSet.string('x00080016');

        if (SOPClassUID !== SOP_CLASS_UIDS.ENCAPSULATED_PDF) {
          throw new Error('This is not a DICOM-encapsulated PDF');
        }

        var fileTag = dataSet.elements.x00420011;
        var offset = fileTag.dataOffset;
        var remainder = offset + fileTag.length;
        pdfByteArray = dataSet.byteArray.slice(offset, remainder);
      }

      var PDF = new Blob([pdfByteArray], {
        type: 'application/pdf'
      });
      var fileURL = URL.createObjectURL(PDF);
      return fileURL;
    });

    _defineProperty(_assertThisInitialized(_this), "onPageChange",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(event) {
        var _this$state2, currentPageIndex, pdf, newPageIndex, action;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$state2 = _this.state, currentPageIndex = _this$state2.currentPageIndex, pdf = _this$state2.pdf;
                newPageIndex = currentPageIndex;
                action = event.target.getAttribute('data-pager');

                if (!(action === 'prev')) {
                  _context2.next = 8;
                  break;
                }

                if (!(currentPageIndex === 1)) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return");

              case 6:
                newPageIndex -= 1;

                if (currentPageIndex < 0) {
                  newPageIndex = 0;
                }

              case 8:
                if (!(action === 'next')) {
                  _context2.next = 13;
                  break;
                }

                if (!(currentPageIndex === pdf.numPages - 1)) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt("return");

              case 11:
                newPageIndex += 1;

                if (currentPageIndex > pdf.numPages - 1) {
                  newPageIndex = pdf.numPages - 1;
                }

              case 13:
                _this.setState(function (state) {
                  return _objectSpread({}, state, {
                    currentPageIndex: newPageIndex
                  });
                });

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "onZoomChange", function () {
      var newZoomValue = _this.state.scale;
      var action = event.target.getAttribute('data-pager');

      if (action === '+') {
        newZoomValue += 0.25;
      }

      if (action === '-') {
        newZoomValue -= 0.25;
      }

      _this.setState(function (state) {
        return _objectSpread({}, state, {
          scale: newZoomValue
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "parseByteArray", function (byteArray) {
      var options = {
        untilTag: ''
      };
      var dataSet;

      try {
        dataSet = dicomParser_min_default.a.parseDicom(byteArray, options);
      } catch (error) {
        _this.setState(function (state) {
          return _objectSpread({}, state, {
            error: error
          });
        });
      }

      return dataSet;
    });

    _defineProperty(_assertThisInitialized(_this), "setViewportActiveHandler", function () {
      var _this$props = _this.props,
          setViewportActive = _this$props.setViewportActive,
          viewportIndex = _this$props.viewportIndex,
          activeViewportIndex = _this$props.activeViewportIndex;

      if (viewportIndex !== activeViewportIndex) {
        setViewportActive(viewportIndex);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "downloadPDFCanvas", function () {
      var fileURL = _this.state.fileURL;
      var a = document.createElement('a');
      a.href = fileURL;
      a.download = fileURL.substr(fileURL.lastIndexOf('/') + 1);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    _this.state = {
      fileURL: null,
      error: null,
      currentPageIndex: 1,
      pdf: null,
      scale: 1
    };
    _this.canvas = Object(react["createRef"])();
    _this.textLayer = Object(react["createRef"])();
    return _this;
  }

  _createClass(DicomPDFViewport, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var _this2 = this;

        var dataSet, fileURL, pdf;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                dataSet = this.parseByteArray(this.props.byteArray);
                fileURL = this.getPDFFileUrl(dataSet, this.props.byteArray);
                this.setState(function (state) {
                  return _objectSpread({}, state, {
                    fileURL: fileURL
                  });
                });

                if (this.props.useNative) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 6;
                return pdf_default.a.getDocument(fileURL).promise;

              case 6:
                pdf = _context3.sent;
                this.setState(function (state) {
                  return _objectSpread({}, state, {
                    pdf: pdf
                  });
                }, function () {
                  return _this2.updatePDFCanvas();
                });

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$state3 = this.state,
          currentPageIndex = _this$state3.currentPageIndex,
          scale = _this$state3.scale;
      var newValidScale = prevState.scale !== scale && scale > 0;
      var newValidPageNumber = prevState.currentPageIndex !== currentPageIndex && currentPageIndex > 0;

      if (newValidScale || newValidPageNumber) {
        this.updatePDFCanvas();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$state4 = this.state,
          fileURL = _this$state4.fileURL,
          pdf = _this$state4.pdf,
          error = _this$state4.error;
      return react_default.a.createElement("div", {
        className: 'DicomPDFViewport',
        onClick: this.setViewportActiveHandler,
        onScroll: this.setViewportActiveHandler,
        style: {
          width: '100%',
          height: '100%'
        }
      }, !this.props.useNative ? react_default.a.createElement(react_default.a.Fragment, null, react_default.a.createElement("div", {
        id: "toolbar"
      }, react_default.a.createElement("div", {
        id: "pager"
      }, pdf && pdf.numPages > 1 && react_default.a.createElement(react_default.a.Fragment, null, react_default.a.createElement("button", {
        "data-pager": "prev",
        onClick: this.onPageChange
      }, "<"), react_default.a.createElement("button", {
        "data-pager": "next",
        onClick: this.onPageChange
      }, ">")), react_default.a.createElement("button", {
        "data-pager": "-",
        onClick: this.onZoomChange
      }, "-"), react_default.a.createElement("button", {
        "data-pager": "+",
        onClick: this.onZoomChange
      }, "+"), react_default.a.createElement("button", {
        onClick: this.downloadPDFCanvas
      }, "Download"))), react_default.a.createElement("div", {
        id: "canvas"
      }, react_default.a.createElement("div", {
        id: "pdf-canvas-container"
      }, react_default.a.createElement("canvas", {
        id: "pdf-canvas",
        ref: function ref(canvas) {
          return _this3.canvas = canvas;
        }
      }), react_default.a.createElement("div", {
        id: "text-layer",
        ref: function ref(textLayer) {
          return _this3.textLayer = textLayer;
        }
      })))) : react_default.a.createElement("object", {
        "aria-label": "PDF Viewer",
        data: fileURL,
        type: "application/pdf",
        width: "100%",
        height: "100%"
      }), error && react_default.a.createElement("h2", null, JSON.stringify(error)));
    }
  }]);

  return DicomPDFViewport;
}(react["Component"]);

_defineProperty(DicomPDFViewport_DicomPDFViewport, "propTypes", {
  byteArray: TypedArrayProp.uint8,
  useNative: prop_types_default.a.bool,
  viewportData: prop_types_default.a.object,
  activeViewportIndex: prop_types_default.a.number,
  setViewportActive: prop_types_default.a.func,
  viewportIndex: prop_types_default.a.number
});

_defineProperty(DicomPDFViewport_DicomPDFViewport, "defaultProps", {
  useNative: false
});

/* harmony default export */ var dicom_pdf_src_DicomPDFViewport = (DicomPDFViewport_DicomPDFViewport);
// CONCATENATED MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-pdf/src/OHIFDicomPDFViewport.js
function OHIFDicomPDFViewport_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { OHIFDicomPDFViewport_typeof = function _typeof(obj) { return typeof obj; }; } else { OHIFDicomPDFViewport_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return OHIFDicomPDFViewport_typeof(obj); }

function OHIFDicomPDFViewport_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function OHIFDicomPDFViewport_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function OHIFDicomPDFViewport_createClass(Constructor, protoProps, staticProps) { if (protoProps) OHIFDicomPDFViewport_defineProperties(Constructor.prototype, protoProps); if (staticProps) OHIFDicomPDFViewport_defineProperties(Constructor, staticProps); return Constructor; }

function OHIFDicomPDFViewport_possibleConstructorReturn(self, call) { if (call && (OHIFDicomPDFViewport_typeof(call) === "object" || typeof call === "function")) { return call; } return OHIFDicomPDFViewport_assertThisInitialized(self); }

function OHIFDicomPDFViewport_getPrototypeOf(o) { OHIFDicomPDFViewport_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return OHIFDicomPDFViewport_getPrototypeOf(o); }

function OHIFDicomPDFViewport_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function OHIFDicomPDFViewport_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) OHIFDicomPDFViewport_setPrototypeOf(subClass, superClass); }

function OHIFDicomPDFViewport_setPrototypeOf(o, p) { OHIFDicomPDFViewport_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return OHIFDicomPDFViewport_setPrototypeOf(o, p); }

function OHIFDicomPDFViewport_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var DicomLoaderService = src["a" /* default */].utils.DicomLoaderService;

var OHIFDicomPDFViewport_OHIFDicomPDFViewport =
/*#__PURE__*/
function (_Component) {
  OHIFDicomPDFViewport_inherits(OHIFDicomPDFViewport, _Component);

  function OHIFDicomPDFViewport() {
    var _getPrototypeOf2;

    var _this;

    OHIFDicomPDFViewport_classCallCheck(this, OHIFDicomPDFViewport);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = OHIFDicomPDFViewport_possibleConstructorReturn(this, (_getPrototypeOf2 = OHIFDicomPDFViewport_getPrototypeOf(OHIFDicomPDFViewport)).call.apply(_getPrototypeOf2, [this].concat(args)));

    OHIFDicomPDFViewport_defineProperty(OHIFDicomPDFViewport_assertThisInitialized(_this), "state", {
      byteArray: null,
      error: null
    });

    return _this;
  }

  OHIFDicomPDFViewport_createClass(OHIFDicomPDFViewport, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props$viewportD = this.props.viewportData,
          displaySet = _this$props$viewportD.displaySet,
          studies = _this$props$viewportD.studies;
      DicomLoaderService.findDicomDataPromise(displaySet, studies).then(function (data) {
        return _this2.setState({
          byteArray: new Uint8Array(data)
        });
      }, function (error) {
        _this2.setState({
          error: error
        });

        throw new Error(error);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          setViewportActive = _this$props.setViewportActive,
          viewportIndex = _this$props.viewportIndex,
          activeViewportIndex = _this$props.activeViewportIndex;
      var _this$state = this.state,
          byteArray = _this$state.byteArray,
          error = _this$state.error;
      var id = OHIFDicomPDFViewport.id,
          init = OHIFDicomPDFViewport.init,
          destroy = OHIFDicomPDFViewport.destroy;
      var pluginProps = {
        id: id,
        init: init,
        destroy: destroy
      };
      return react_default.a.createElement(src_OHIFComponentPlugin, pluginProps, byteArray && react_default.a.createElement(dicom_pdf_src_DicomPDFViewport, {
        byteArray: byteArray,
        setViewportActive: setViewportActive,
        viewportIndex: viewportIndex,
        activeViewportIndex: activeViewportIndex
      }), error && react_default.a.createElement("h2", null, JSON.stringify(error)));
    }
  }], [{
    key: "init",
    value: function init() {
      console.log('DicomPDFViewport init()');
    }
  }, {
    key: "destroy",
    value: function destroy() {
      console.log('DicomPDFViewport destroy()');
    }
  }]);

  return OHIFDicomPDFViewport;
}(react["Component"]);

OHIFDicomPDFViewport_defineProperty(OHIFDicomPDFViewport_OHIFDicomPDFViewport, "propTypes", {
  studies: prop_types_default.a.object,
  displaySet: prop_types_default.a.object,
  viewportIndex: prop_types_default.a.number,
  viewportData: prop_types_default.a.object,
  activeViewportIndex: prop_types_default.a.number,
  setViewportActive: prop_types_default.a.func
});

OHIFDicomPDFViewport_defineProperty(OHIFDicomPDFViewport_OHIFDicomPDFViewport, "id", 'DicomPDFViewportPDF');

/* harmony default export */ var src_OHIFDicomPDFViewport = (OHIFDicomPDFViewport_OHIFDicomPDFViewport);
// CONCATENATED MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-pdf/src/ConnectedOHIFDicomPDFViewer.js



var _setViewportActive = src["a" /* default */].redux.actions.setViewportActive;

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var activeViewportIndex = state.viewports.activeViewportIndex;
  return {
    activeViewportIndex: activeViewportIndex
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  var viewportIndex = ownProps.viewportIndex;
  return {
    setViewportActive: function setViewportActive() {
      dispatch(_setViewportActive(viewportIndex));
    }
  };
};

var ConnectedOHIFDicomPDFViewer = Object(es["b" /* connect */])(mapStateToProps, mapDispatchToProps)(src_OHIFDicomPDFViewport);
/* harmony default export */ var src_ConnectedOHIFDicomPDFViewer = __webpack_exports__["default"] = (ConnectedOHIFDicomPDFViewer);

/***/ }),

/***/ 994:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 995:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 996:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 997:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

}]);