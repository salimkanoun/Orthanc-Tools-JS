(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[14],{

/***/ 1009:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/prop-types/index.js
var prop_types = __webpack_require__(1);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/index.js + 33 modules
var src = __webpack_require__(13);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-redux/es/index.js + 21 modules
var es = __webpack_require__(59);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/dcmjs/build/dcmjs.es.js
var dcmjs_es = __webpack_require__(30);

// CONCATENATED MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-html/src/TypedArrayProp.js
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

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-html/src/DicomHtmlViewport.css
var src_DicomHtmlViewport = __webpack_require__(991);

// CONCATENATED MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-html/src/DicomHtmlViewport.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







function getRelationshipString(data) {
  switch (data.RelationshipType) {
    case 'HAS CONCEPT MOD':
      return 'Concept modifier: ';

    case 'HAS OBS CONTEXT':
      return 'Observation context: ';

    default:
      return '';
  }
}

var getMeaningString = function getMeaningString(data) {
  if (data.ConceptNameCodeSequence) {
    var CodeMeaning = data.ConceptNameCodeSequence.CodeMeaning;
    return "".concat(CodeMeaning, " = ");
  }

  return '';
};

function getValueString(data) {
  switch (data.ValueType) {
    case 'CODE':
      var _data$ConceptNameCode = data.ConceptNameCodeSequence,
          CodeMeaning = _data$ConceptNameCode.CodeMeaning,
          CodeValue = _data$ConceptNameCode.CodeValue,
          CodingSchemeDesignator = _data$ConceptNameCode.CodingSchemeDesignator;
      return "".concat(CodeMeaning, " (").concat(CodeValue, ", ").concat(CodingSchemeDesignator, ")");

    case 'PNAME':
      return data.PersonName;

    case 'TEXT':
      return data.TextValue;

    case 'UIDREF':
      return data.UID;

    case 'NUM':
      var MeasuredValueSequence = data.MeasuredValueSequence;
      var numValue = MeasuredValueSequence.NumericValue;
      var codeValue = MeasuredValueSequence.MeasurementUnitsCodeSequence.CodeValue;
      return "".concat(numValue, " ").concat(codeValue);
  }
}

function constructPlainValue(data) {
  var value = getValueString(data);

  if (value) {
    return getRelationshipString(data) + getMeaningString(data) + value;
  }
}

function constructContentSequence(data, header) {
  if (!data.ContentSequence) {
    return;
  }

  var items = data.ContentSequence.map(function (item) {
    return parseContent(item);
  }).filter(function (item) {
    return item;
  });

  if (!items.length) {
    return;
  }

  var result = {
    items: items
  };

  if (header) {
    result.header = header;
  }

  return result;
}

function parseContent(data) {
  if (data.ValueType) {
    if (data.ValueType === 'CONTAINER') {
      var header = data.ConceptNameCodeSequence.CodeMeaning;
      return constructContentSequence(data, header);
    }

    return constructPlainValue(data);
  }

  if (data.ContentSequence) {
    return constructContentSequence(data);
  }
}

var _dcmjs$data = dcmjs_es["a" /* default */].data,
    DicomMetaDictionary = _dcmjs$data.DicomMetaDictionary,
    DicomMessage = _dcmjs$data.DicomMessage;

function getMainData(data) {
  var root = [];
  var patientValue = "".concat(data.PatientName, " (").concat(data.PatientSex, ", #").concat(data.PatientID, ")");
  root.push(getMainDataItem('Patient', patientValue));
  var studyValue = data.StudyDescription;
  root.push(getMainDataItem('Study', studyValue));
  var seriesValue = "".concat(data.SeriesDescription, " (#").concat(data.SeriesNumber, ")");
  root.push(getMainDataItem('Series', seriesValue));
  var manufacturerValue = "".concat(data.Manufacturer, " (").concat(data.ManufacturerModelName, ", #").concat(data.DeviceSerialNumber, ")");
  root.push(getMainDataItem('Manufacturer', manufacturerValue));
  var mainDataObjects = {
    CompletionFlag: 'Completion flag',
    VerificationFlag: 'Verification flag'
  };
  Object.keys(mainDataObjects).forEach(function (key) {
    if (!data[key]) {
      return;
    }

    var item = getMainDataItem(mainDataObjects[key], data[key]);
    root.push(item);
  }); // TODO: Format these dates

  var contentDateTimeValue = "".concat(data.ContentDate, " ").concat(data.ContentTime);
  root.push(getMainDataItem('Content Date/Time', contentDateTimeValue));
  root.push();
  return react_default.a.createElement("div", null, root);
}

var DicomHtmlViewport_getContentSequence = function getContentSequence(data) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var header;

  if (data.ConceptNameCodeSequence) {
    var _data$ConceptNameCode2 = data.ConceptNameCodeSequence,
        CodeMeaning = _data$ConceptNameCode2.CodeMeaning,
        CodeValue = _data$ConceptNameCode2.CodeValue,
        CodingSchemeDesignator = _data$ConceptNameCode2.CodingSchemeDesignator;
    header = "".concat(CodeMeaning, " (").concat(CodeValue, " - ").concat(CodingSchemeDesignator, ")");
  }

  var root = [];

  if (header) {
    var HeaderDynamicLevel = "h".concat(level);
    root.push(react_default.a.createElement(HeaderDynamicLevel, {
      key: header
    }, header));
  }

  Object.keys(data).forEach(function (key) {
    var value = data[key];
    var content;

    if (value instanceof Object) {
      content = getContentSequence(value, level + 1);
    } else {
      content = react_default.a.createElement("div", {
        key: key
      }, key, " - ", data[key]);
    }

    root.push(content);
  });
  return react_default.a.createElement("div", null, root);
};

function getMainDataItem(key, value) {
  return react_default.a.createElement("div", {
    key: key
  }, react_default.a.createElement("b", null, key), ": ", value);
}

var DicomHtmlViewport_DicomHtmlViewport =
/*#__PURE__*/
function (_Component) {
  _inherits(DicomHtmlViewport, _Component);

  function DicomHtmlViewport() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DicomHtmlViewport);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DicomHtmlViewport)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      content: null,
      error: null
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

    return _this;
  }

  _createClass(DicomHtmlViewport, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var dataSet = this.setContentFromByteArray(this.props.byteArray);
    }
  }, {
    key: "setContentFromByteArray",
    value: function setContentFromByteArray(byteArray) {
      var arrayBuffer = byteArray.buffer;
      var dicomData = DicomMessage.readFile(arrayBuffer);
      var dataset = DicomMetaDictionary.naturalizeDataset(dicomData.dict);
      dataset._meta = DicomMetaDictionary.namifyDataset(dicomData.meta);
      var mainData = getMainData(dataset);
      var contentSequence = DicomHtmlViewport_getContentSequence(dataset);
      var content = react_default.a.createElement(react_default.a.Fragment, null, mainData, contentSequence);
      this.setState({
        content: content
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          content = _this$state.content,
          error = _this$state.error;
      return react_default.a.createElement("div", {
        "data-cy": "dicom-html-viewport",
        className: "DicomHtmlViewport",
        onClick: this.setViewportActiveHandler,
        onScroll: this.setViewportActiveHandler
      }, content, error && react_default.a.createElement("h2", null, JSON.stringify(error)));
    }
  }]);

  return DicomHtmlViewport;
}(react["Component"]);

_defineProperty(DicomHtmlViewport_DicomHtmlViewport, "propTypes", {
  byteArray: TypedArrayProp.uint8,
  setViewportActive: prop_types_default.a.func.isRequired,
  viewportIndex: prop_types_default.a.number.isRequired,
  activeViewportIndex: prop_types_default.a.number.isRequired
});

/* harmony default export */ var dicom_html_src_DicomHtmlViewport = (DicomHtmlViewport_DicomHtmlViewport);
// CONCATENATED MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-html/src/ConnectedDicomHtmlViewport.js



var _setViewportActive = src["a" /* default */].redux.actions.setViewportActive;

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var viewportIndex = ownProps.viewportIndex,
      byteArray = ownProps.byteArray;
  var activeViewportIndex = state.viewports.activeViewportIndex;
  return {
    viewportIndex: viewportIndex,
    activeViewportIndex: activeViewportIndex,
    byteArray: byteArray
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

var ConnectedDicomHtmlViewport = Object(es["b" /* connect */])(mapStateToProps, mapDispatchToProps)(dicom_html_src_DicomHtmlViewport);
/* harmony default export */ var src_ConnectedDicomHtmlViewport = (ConnectedDicomHtmlViewport);
// CONCATENATED MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/extensions/dicom-html/src/OHIFDicomHtmlViewport.js
function OHIFDicomHtmlViewport_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { OHIFDicomHtmlViewport_typeof = function _typeof(obj) { return typeof obj; }; } else { OHIFDicomHtmlViewport_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return OHIFDicomHtmlViewport_typeof(obj); }

function OHIFDicomHtmlViewport_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function OHIFDicomHtmlViewport_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function OHIFDicomHtmlViewport_createClass(Constructor, protoProps, staticProps) { if (protoProps) OHIFDicomHtmlViewport_defineProperties(Constructor.prototype, protoProps); if (staticProps) OHIFDicomHtmlViewport_defineProperties(Constructor, staticProps); return Constructor; }

function OHIFDicomHtmlViewport_possibleConstructorReturn(self, call) { if (call && (OHIFDicomHtmlViewport_typeof(call) === "object" || typeof call === "function")) { return call; } return OHIFDicomHtmlViewport_assertThisInitialized(self); }

function OHIFDicomHtmlViewport_getPrototypeOf(o) { OHIFDicomHtmlViewport_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return OHIFDicomHtmlViewport_getPrototypeOf(o); }

function OHIFDicomHtmlViewport_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function OHIFDicomHtmlViewport_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) OHIFDicomHtmlViewport_setPrototypeOf(subClass, superClass); }

function OHIFDicomHtmlViewport_setPrototypeOf(o, p) { OHIFDicomHtmlViewport_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return OHIFDicomHtmlViewport_setPrototypeOf(o, p); }

function OHIFDicomHtmlViewport_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var DicomLoaderService = src["a" /* default */].utils.DicomLoaderService;

var OHIFDicomHtmlViewport_OHIFDicomHtmlViewport =
/*#__PURE__*/
function (_Component) {
  OHIFDicomHtmlViewport_inherits(OHIFDicomHtmlViewport, _Component);

  function OHIFDicomHtmlViewport() {
    var _getPrototypeOf2;

    var _this;

    OHIFDicomHtmlViewport_classCallCheck(this, OHIFDicomHtmlViewport);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = OHIFDicomHtmlViewport_possibleConstructorReturn(this, (_getPrototypeOf2 = OHIFDicomHtmlViewport_getPrototypeOf(OHIFDicomHtmlViewport)).call.apply(_getPrototypeOf2, [this].concat(args)));

    OHIFDicomHtmlViewport_defineProperty(OHIFDicomHtmlViewport_assertThisInitialized(_this), "state", {
      byteArray: null,
      error: null
    });

    return _this;
  }

  OHIFDicomHtmlViewport_createClass(OHIFDicomHtmlViewport, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props$viewportD = this.props.viewportData,
          displaySet = _this$props$viewportD.displaySet,
          studies = _this$props$viewportD.studies;
      DicomLoaderService.findDicomDataPromise(displaySet, studies).then(function (data) {
        var byteArray = new Uint8Array(data);

        _this2.setState({
          byteArray: byteArray
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
      return react_default.a.createElement(react_default.a.Fragment, null, this.state.byteArray && react_default.a.createElement(src_ConnectedDicomHtmlViewport, {
        byteArray: this.state.byteArray,
        viewportIndex: this.props.viewportIndex
      }), this.state.error && react_default.a.createElement("h2", null, JSON.stringify(this.state.error)));
    }
  }]);

  return OHIFDicomHtmlViewport;
}(react["Component"]);

OHIFDicomHtmlViewport_defineProperty(OHIFDicomHtmlViewport_OHIFDicomHtmlViewport, "propTypes", {
  studies: prop_types_default.a.object,
  displaySet: prop_types_default.a.object,
  viewportIndex: prop_types_default.a.number,
  viewportData: prop_types_default.a.object
});

/* harmony default export */ var src_OHIFDicomHtmlViewport = __webpack_exports__["default"] = (OHIFDicomHtmlViewport_OHIFDicomHtmlViewport);

/***/ }),

/***/ 991:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ })

}]);