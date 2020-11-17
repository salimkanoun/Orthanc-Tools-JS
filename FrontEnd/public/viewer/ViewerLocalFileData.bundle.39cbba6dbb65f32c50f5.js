(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

/***/ 1025:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 946:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(134);
/* harmony import */ var _ConnectedViewer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(973);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _App_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(255);
/* harmony import */ var react_dropzone__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1041);
/* harmony import */ var _lib_filesToStudies__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(990);
/* harmony import */ var _ViewerLocalFileData_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1025);
/* harmony import */ var _ViewerLocalFileData_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_ViewerLocalFileData_css__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(33);
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

/***/ 973:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-redux/es/index.js + 21 modules
var es = __webpack_require__(58);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react/index.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/prop-types/index.js
var prop_types = __webpack_require__(1);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/classnames/index.js
var classnames = __webpack_require__(17);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/index.js + 28 modules
var src = __webpack_require__(16);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/DICOMSR/index.js + 8 modules
var DICOMSR = __webpack_require__(244);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/extensions/MODULE_TYPES.js
var MODULE_TYPES = __webpack_require__(562);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/ui/src/index.js + 119 modules
var ui_src = __webpack_require__(15);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/moment/moment.js
var moment = __webpack_require__(6);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);

// EXTERNAL MODULE: ./connectedComponents/ConnectedHeader.js + 8 modules
var ConnectedHeader = __webpack_require__(989);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-i18next/dist/es/index.js + 9 modules
var dist_es = __webpack_require__(33);

// EXTERNAL MODULE: ./connectedComponents/ToolbarRow.css
var connectedComponents_ToolbarRow = __webpack_require__(974);

// EXTERNAL MODULE: ./App.js + 33 modules
var App = __webpack_require__(255);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/cornerstone-tools/dist/cornerstoneTools.js
var cornerstoneTools = __webpack_require__(7);
var cornerstoneTools_default = /*#__PURE__*/__webpack_require__.n(cornerstoneTools);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/lodash.clonedeep/index.js
var lodash_clonedeep = __webpack_require__(36);
var lodash_clonedeep_default = /*#__PURE__*/__webpack_require__.n(lodash_clonedeep);

// CONCATENATED MODULE: ./connectedComponents/ConnectedCineDialog.js




 // Our target output kills the `as` and "import" throws a keyword error
// import { import as toolImport, getToolState } from 'cornerstone-tools';


var toolImport = cornerstoneTools_default.a.import;
var scrollToIndex = toolImport('util/scrollToIndex');
var setViewportSpecificData = src["a" /* default */].redux.actions.setViewportSpecificData; // Why do I need or care about any of this info?
// A dispatch action should be able to pull this at the time of an event?
// `isPlaying` and `cineFrameRate` might matter, but I think we can prop pass for those.

var ConnectedCineDialog_mapStateToProps = function mapStateToProps(state) {
  // Get activeViewport's `cine` and `stack`
  var _state$viewports = state.viewports,
      viewportSpecificData = _state$viewports.viewportSpecificData,
      activeViewportIndex = _state$viewports.activeViewportIndex;

  var _ref = viewportSpecificData[activeViewportIndex] || {},
      cine = _ref.cine;

  var dom = App["a" /* commandsManager */].runCommand('getActiveViewportEnabledElement');
  var cineData = cine || {
    isPlaying: false,
    cineFrameRate: 24
  }; // New props we're creating?

  return {
    activeEnabledElement: dom,
    activeViewportCineData: cineData,
    activeViewportIndex: state.viewports.activeViewportIndex
  };
};

var ConnectedCineDialog_mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    dispatchSetViewportSpecificData: function dispatchSetViewportSpecificData(viewportIndex, data) {
      dispatch(setViewportSpecificData(viewportIndex, data));
    }
  };
};

var ConnectedCineDialog_mergeProps = function mergeProps(propsFromState, propsFromDispatch, ownProps) {
  var activeEnabledElement = propsFromState.activeEnabledElement,
      activeViewportCineData = propsFromState.activeViewportCineData,
      activeViewportIndex = propsFromState.activeViewportIndex;
  return {
    cineFrameRate: activeViewportCineData.cineFrameRate,
    isPlaying: activeViewportCineData.isPlaying,
    onPlayPauseChanged: function onPlayPauseChanged(isPlaying) {
      var cine = lodash_clonedeep_default()(activeViewportCineData);
      cine.isPlaying = !cine.isPlaying;
      propsFromDispatch.dispatchSetViewportSpecificData(activeViewportIndex, {
        cine: cine
      });
    },
    onFrameRateChanged: function onFrameRateChanged(frameRate) {
      var cine = lodash_clonedeep_default()(activeViewportCineData);
      cine.cineFrameRate = frameRate;
      propsFromDispatch.dispatchSetViewportSpecificData(activeViewportIndex, {
        cine: cine
      });
    },
    onClickNextButton: function onClickNextButton() {
      var stackData = cornerstoneTools_default.a.getToolState(activeEnabledElement, 'stack');
      if (!stackData || !stackData.data || !stackData.data.length) return;
      var _stackData$data$ = stackData.data[0],
          currentImageIdIndex = _stackData$data$.currentImageIdIndex,
          imageIds = _stackData$data$.imageIds;
      if (currentImageIdIndex >= imageIds.length - 1) return;
      scrollToIndex(activeEnabledElement, currentImageIdIndex + 1);
    },
    onClickBackButton: function onClickBackButton() {
      var stackData = cornerstoneTools_default.a.getToolState(activeEnabledElement, 'stack');
      if (!stackData || !stackData.data || !stackData.data.length) return;
      var currentImageIdIndex = stackData.data[0].currentImageIdIndex;
      if (currentImageIdIndex === 0) return;
      scrollToIndex(activeEnabledElement, currentImageIdIndex - 1);
    },
    onClickSkipToStart: function onClickSkipToStart() {
      var stackData = cornerstoneTools_default.a.getToolState(activeEnabledElement, 'stack');
      if (!stackData || !stackData.data || !stackData.data.length) return;
      scrollToIndex(activeEnabledElement, 0);
    },
    onClickSkipToEnd: function onClickSkipToEnd() {
      var stackData = cornerstoneTools_default.a.getToolState(activeEnabledElement, 'stack');
      if (!stackData || !stackData.data || !stackData.data.length) return;
      var lastIndex = stackData.data[0].imageIds.length - 1;
      scrollToIndex(activeEnabledElement, lastIndex);
    }
  };
};

var ConnectedCineDialog = Object(es["b" /* connect */])(ConnectedCineDialog_mapStateToProps, ConnectedCineDialog_mapDispatchToProps, ConnectedCineDialog_mergeProps)(ui_src["c" /* CineDialog */]);
/* harmony default export */ var connectedComponents_ConnectedCineDialog = (ConnectedCineDialog);
// CONCATENATED MODULE: ./connectedComponents/ConnectedLayoutButton.js



var _OHIF$redux$actions = src["a" /* default */].redux.actions,
    setLayout = _OHIF$redux$actions.setLayout,
    setViewportActive = _OHIF$redux$actions.setViewportActive;

var ConnectedLayoutButton_mapStateToProps = function mapStateToProps(state) {
  return {
    currentLayout: state.viewports.layout,
    activeViewportIndex: state.viewports.activeViewportIndex
  };
};

var ConnectedLayoutButton_mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    // TODO: Change if layout switched becomes more complex
    onChange: function onChange(selectedCell, currentLayout, activeViewportIndex) {
      var viewports = [];
      var numRows = selectedCell.row + 1;
      var numColumns = selectedCell.col + 1;
      var numViewports = numRows * numColumns;

      for (var i = 0; i < numViewports; i++) {
        // Hacky way to allow users to exit MPR "mode"
        var viewport = currentLayout.viewports[i];
        var plugin = viewport && viewport.plugin;

        if (viewport && viewport.vtk) {
          plugin = 'cornerstone';
        }

        viewports.push({
          plugin: plugin
        });
      }

      var layout = {
        numRows: numRows,
        numColumns: numColumns,
        viewports: viewports
      };
      var maxActiveIndex = numViewports - 1;

      if (activeViewportIndex > maxActiveIndex) {
        dispatch(setViewportActive(0));
      }

      dispatch(setLayout(layout));
    }
  };
};

var ConnectedLayoutButton_mergeProps = function mergeProps(propsFromState, propsFromDispatch) {
  var onChangeFromDispatch = propsFromDispatch.onChange;
  var currentLayout = propsFromState.currentLayout,
      activeViewportIndex = propsFromState.activeViewportIndex;
  return {
    onChange: function onChange(selectedCell) {
      return onChangeFromDispatch(selectedCell, currentLayout, activeViewportIndex);
    }
  };
};

var ConnectedLayoutButton = Object(es["b" /* connect */])(ConnectedLayoutButton_mapStateToProps, ConnectedLayoutButton_mapDispatchToProps, ConnectedLayoutButton_mergeProps)(ui_src["l" /* LayoutButton */]);
/* harmony default export */ var connectedComponents_ConnectedLayoutButton = (ConnectedLayoutButton);
// EXTERNAL MODULE: ./context/AppContext.js
var AppContext = __webpack_require__(76);

// CONCATENATED MODULE: ./connectedComponents/ToolbarRow.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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












var ToolbarRow_ToolbarRow =
/*#__PURE__*/
function (_Component) {
  _inherits(ToolbarRow, _Component);

  // TODO: Simplify these? isOpen can be computed if we say "any" value for selected,
  // closed if selected is null/undefined
  function ToolbarRow(props) {
    var _this2;

    _classCallCheck(this, ToolbarRow);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ToolbarRow).call(this, props));

    _defineProperty(_assertThisInitialized(_this2), "closeCineDialogIfNotApplicable", function () {
      var dialog = _this2.props.dialog;
      var _this2$state = _this2.state,
          dialogId = _this2$state.dialogId,
          activeButtons = _this2$state.activeButtons,
          toolbarButtons = _this2$state.toolbarButtons;

      if (dialogId) {
        var cineButtonPresent = toolbarButtons.find(function (button) {
          return button.options && button.options.behavior === 'CINE';
        });

        if (!cineButtonPresent) {
          dialog.dismiss({
            id: dialogId
          });
          activeButtons = activeButtons.filter(function (button) {
            return button.options && button.options.behavior !== 'CINE';
          });

          _this2.setState({
            dialogId: null,
            activeButtons: activeButtons
          });
        }
      }
    });

    var toolbarButtonDefinitions = _getVisibleToolbarButtons.call(_assertThisInitialized(_this2)); // TODO:
    // If it's a tool that can be active... Mark it as active?
    // - Tools that are on/off?
    // - Tools that can be bound to multiple buttons?
    // Normal ToolbarButtons...
    // Just how high do we need to hoist this state?
    // Why ToolbarRow instead of just Toolbar? Do we have any others?


    _this2.state = {
      toolbarButtons: toolbarButtonDefinitions,
      activeButtons: []
    };
    _this2.seriesPerStudyCount = [];
    _this2._handleBuiltIn = _handleBuiltIn.bind(_assertThisInitialized(_this2));

    _this2.updateButtonGroups();

    return _this2;
  }

  _createClass(ToolbarRow, [{
    key: "updateButtonGroups",
    value: function updateButtonGroups() {
      var _this3 = this;

      var panelModules = App["c" /* extensionManager */].modules[MODULE_TYPES["a" /* default */].PANEL];
      this.buttonGroups = {
        left: [],
        right: []
      }; // ~ FIND MENU OPTIONS

      panelModules.forEach(function (panelExtension) {
        var panelModule = panelExtension.module;
        var defaultContexts = Array.from(panelModule.defaultContext);
        panelModule.menuOptions.forEach(function (menuOption) {
          var contexts = Array.from(menuOption.context || defaultContexts);

          var hasActiveContext = _this3.props.activeContexts.some(function (actx) {
            return contexts.includes(actx);
          }); // It's a bit beefy to pass studies; probably only need to be reactive on `studyInstanceUIDs` and activeViewport?
          // Note: This does not cleanly handle `studies` prop updating with panel open


          var isDisabled = typeof menuOption.isDisabled === 'function' && menuOption.isDisabled(_this3.props.studies);

          if (hasActiveContext && !isDisabled) {
            var menuOptionEntry = {
              value: menuOption.target,
              icon: menuOption.icon,
              bottomLabel: menuOption.label
            };
            var from = menuOption.from || 'right';

            _this3.buttonGroups[from].push(menuOptionEntry);
          }
        });
      }); // TODO: This should come from extensions, instead of being baked in

      this.buttonGroups.left.unshift({
        value: 'studies',
        icon: 'th-large',
        bottomLabel: this.props.t('Series')
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var activeContextsChanged = prevProps.activeContexts !== this.props.activeContexts;
      var prevStudies = prevProps.studies;
      var studies = this.props.studies;
      var seriesPerStudyCount = this.seriesPerStudyCount;
      var studiesUpdated = false;

      if (prevStudies.length !== studies.length) {
        studiesUpdated = true;
      } else {
        for (var i = 0; i < studies.length; i++) {
          if (studies[i].series.length !== seriesPerStudyCount[i]) {
            seriesPerStudyCount[i] = studies[i].series.length;
            studiesUpdated = true;
            break;
          }
        }
      }

      if (studiesUpdated) {
        this.updateButtonGroups();
      }

      if (activeContextsChanged) {
        this.setState({
          toolbarButtons: _getVisibleToolbarButtons.call(this)
        }, this.closeCineDialogIfNotApplicable);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var buttonComponents = _getButtonComponents.call(this, this.state.toolbarButtons, this.state.activeButtons);

      var onPress = function onPress(side, value) {
        _this4.props.handleSidePanelChange(side, value);
      };

      var onPressLeft = onPress.bind(this, 'left');
      var onPressRight = onPress.bind(this, 'right');
      return react_default.a.createElement(react_default.a.Fragment, null, react_default.a.createElement("div", {
        className: "ToolbarRow"
      }, react_default.a.createElement("div", {
        className: "pull-left m-t-1 p-y-1",
        style: {
          padding: '10px'
        }
      }, react_default.a.createElement(ui_src["t" /* RoundedButtonGroup */], {
        options: this.buttonGroups.left,
        value: this.props.selectedLeftSidePanel || '',
        onValueChanged: onPressLeft
      })), buttonComponents, react_default.a.createElement(connectedComponents_ConnectedLayoutButton, null), react_default.a.createElement("div", {
        className: "pull-right m-t-1 rm-x-1",
        style: {
          marginLeft: 'auto'
        }
      }, this.buttonGroups.right.length && react_default.a.createElement(ui_src["t" /* RoundedButtonGroup */], {
        options: this.buttonGroups.right,
        value: this.props.selectedRightSidePanel || '',
        onValueChanged: onPressRight
      }))));
    }
  }]);

  return ToolbarRow;
}(react["Component"]);

_defineProperty(ToolbarRow_ToolbarRow, "propTypes", {
  isLeftSidePanelOpen: prop_types_default.a.bool.isRequired,
  isRightSidePanelOpen: prop_types_default.a.bool.isRequired,
  selectedLeftSidePanel: prop_types_default.a.string.isRequired,
  selectedRightSidePanel: prop_types_default.a.string.isRequired,
  handleSidePanelChange: prop_types_default.a.func.isRequired,
  activeContexts: prop_types_default.a.arrayOf(prop_types_default.a.string).isRequired,
  studies: prop_types_default.a.array,
  t: prop_types_default.a.func.isRequired,
  // NOTE: withDialog, withModal HOCs
  dialog: prop_types_default.a.any,
  modal: prop_types_default.a.any
});

_defineProperty(ToolbarRow_ToolbarRow, "defaultProps", {
  studies: []
});

function _getCustomButtonComponent(button, activeButtons) {
  var CustomComponent = button.CustomComponent;
  var isValidComponent = typeof CustomComponent === 'function'; // Check if its a valid customComponent. Later on an CustomToolbarComponent interface could be implemented.

  if (isValidComponent) {
    var parentContext = this;
    var activeButtonsIds = activeButtons.map(function (button) {
      return button.id;
    });
    var isActive = activeButtonsIds.includes(button.id);
    return react_default.a.createElement(CustomComponent, {
      parentContext: parentContext,
      toolbarClickCallback: _handleToolbarButtonClick.bind(this),
      button: button,
      key: button.id,
      activeButtons: activeButtonsIds,
      isActive: isActive
    });
  }
}

function _getExpandableButtonComponent(button, activeButtons) {
  var _this5 = this;

  // Iterate over button definitions and update `onClick` behavior
  var activeCommand;
  var childButtons = button.buttons.map(function (childButton) {
    childButton.onClick = _handleToolbarButtonClick.bind(_this5, childButton);

    if (activeButtons.map(function (button) {
      return button.id;
    }).indexOf(childButton.id) > -1) {
      activeCommand = childButton.id;
    }

    return childButton;
  });
  return react_default.a.createElement(ui_src["h" /* ExpandableToolMenu */], {
    key: button.id,
    label: button.label,
    icon: button.icon,
    buttons: childButtons,
    activeCommand: activeCommand
  });
}

function _getDefaultButtonComponent(button, activeButtons) {
  return react_default.a.createElement(ui_src["H" /* ToolbarButton */], {
    key: button.id,
    label: button.label,
    icon: button.icon,
    onClick: _handleToolbarButtonClick.bind(this, button),
    isActive: activeButtons.map(function (button) {
      return button.id;
    }).includes(button.id)
  });
}
/**
 * Determine which extension buttons should be showing, if they're
 * active, and what their onClick behavior should be.
 */


function _getButtonComponents(toolbarButtons, activeButtons) {
  var _this = this;

  return toolbarButtons.map(function (button) {
    var hasCustomComponent = button.CustomComponent;
    var hasNestedButtonDefinitions = button.buttons && button.buttons.length;

    if (hasCustomComponent) {
      return _getCustomButtonComponent.call(_this, button, activeButtons);
    }

    if (hasNestedButtonDefinitions) {
      return _getExpandableButtonComponent.call(_this, button, activeButtons);
    }

    return _getDefaultButtonComponent.call(_this, button, activeButtons);
  });
}
/**
 * TODO: DEPRECATE
 * This is used exclusively in `extensions/cornerstone/src`
 * We have better ways with new UI Services to trigger "builtin" behaviors
 *
 * A handy way for us to handle different button types. IE. firing commands for
 * buttons, or initiation built in behavior.
 *
 * @param {*} button
 * @param {*} evt
 * @param {*} props
 */


function _handleToolbarButtonClick(button, evt, props) {
  var activeButtons = this.state.activeButtons; // TODO: Use Types ENUM
  // TODO: We can update this to be a `getter` on the extension to query
  //       For the active tools after we apply our updates?

  if (button.type === 'setToolActive') {
    var toggables = activeButtons.filter(function (_ref) {
      var options = _ref.options;
      return options && !options.togglable;
    });
    this.setState({
      activeButtons: [].concat(_toConsumableArray(toggables), [button])
    });
  } else if (button.type === 'builtIn') {
    this._handleBuiltIn(button);
  } else if (button.options && button.options.togglable === true) {
    // Handle togglable buttons that run commands
    // (e.g. turning on/off synchronized scrolling)
    // Find the index of the button in the activeButton array
    var index = activeButtons.findIndex(function (button) {
      return button.id === button.id;
    }); // If it is already present, remove it to toggle it off

    if (index > -1) {
      activeButtons.splice(index, 1);
    } else {
      // Otherwise, add it to toggle it on
      activeButtons.push(button);
    } // Set state with the update button array


    this.setState({
      activeButtons: activeButtons
    });
  }

  if (button.commandName) {
    var options = Object.assign({
      evt: evt
    }, button.commandOptions);
    App["a" /* commandsManager */].runCommand(button.commandName, options);
  }
}
/**
 *
 */


function _getVisibleToolbarButtons() {
  var _this6 = this;

  var toolbarModules = App["c" /* extensionManager */].modules[MODULE_TYPES["a" /* default */].TOOLBAR];
  var toolbarButtonDefinitions = [];
  toolbarModules.forEach(function (extension) {
    var _extension$module = extension.module,
        definitions = _extension$module.definitions,
        defaultContext = _extension$module.defaultContext;
    definitions.forEach(function (definition) {
      var context = definition.context || defaultContext;

      if (_this6.props.activeContexts.includes(context)) {
        toolbarButtonDefinitions.push(definition);
      }
    });
  });
  return toolbarButtonDefinitions;
}

function _handleBuiltIn(button) {
  /* TODO: Keep cine button active until its unselected. */
  var _this$props = this.props,
      dialog = _this$props.dialog,
      t = _this$props.t;
  var dialogId = this.state.dialogId;
  var id = button.id,
      options = button.options;

  if (options.behavior === 'CINE') {
    if (dialogId) {
      dialog.dismiss({
        id: dialogId
      });
      this.setState(function (state) {
        return {
          dialogId: null,
          activeButtons: _toConsumableArray(state.activeButtons.filter(function (button) {
            return button.id !== id;
          }))
        };
      });
    } else {
      var spacing = 20;

      var _document$querySelect = document.querySelector(".ViewerMain").getBoundingClientRect(),
          x = _document$querySelect.x,
          y = _document$querySelect.y;

      var newDialogId = dialog.create({
        content: connectedComponents_ConnectedCineDialog,
        defaultPosition: {
          x: x + spacing || 0,
          y: y + spacing || 0
        }
      });
      this.setState(function (state) {
        return {
          dialogId: newDialogId,
          activeButtons: [].concat(_toConsumableArray(state.activeButtons), [button])
        };
      });
    }
  }

  if (options.behavior === 'DOWNLOAD_SCREEN_SHOT') {
    App["a" /* commandsManager */].runCommand('showDownloadViewportModal', {
      title: t('Download High Quality Image')
    });
  }
}

/* harmony default export */ var connectedComponents_ToolbarRow_0 = (Object(dist_es["d" /* withTranslation */])(['Common', 'ViewportDownloadForm'])(Object(ui_src["P" /* withModal */])(Object(ui_src["O" /* withDialog */])(Object(AppContext["e" /* withAppContext */])(ToolbarRow_ToolbarRow)))));
// CONCATENATED MODULE: ./connectedComponents/findDisplaySetByUID.js
/**
 * Finds displaySet by UID across all displaySets inside studyMetadata
 * @param {Array} studyMetadata
 * @param {string} displaySetInstanceUID
 */
function findDisplaySetByUID(studyMetadata, displaySetInstanceUID) {
  if (!Array.isArray(studyMetadata)) return null;
  var allDisplaySets = studyMetadata.reduce(function (all, current) {
    var currentDisplaySet = [];

    if (current && Array.isArray(current.displaySets)) {
      currentDisplaySet = current.displaySets;
    }

    return all.concat(currentDisplaySet);
  }, []);

  var bySetInstanceUID = function bySetInstanceUID(ds) {
    return ds.displaySetInstanceUID === displaySetInstanceUID;
  };

  var displaySet = allDisplaySets.find(bySetInstanceUID);
  return displaySet || null;
}
// CONCATENATED MODULE: ./connectedComponents/ConnectedStudyBrowser.js





var studyMetadataManager = src["a" /* default */].utils.studyMetadataManager;
var setActiveViewportSpecificData = src["a" /* default */].redux.actions.setActiveViewportSpecificData; // TODO
// - Determine in which display set is active from Redux (activeViewportIndex and layout viewportData)
// - Pass in errors and stack loading progress from Redux

var ConnectedStudyBrowser_mapStateToProps = function mapStateToProps(state, ownProps) {
  // If we know that the stack loading progress details have changed,
  // we can try to update the component state so that the thumbnail
  // progress bar is updated
  var stackLoadingProgressMap = state.loading.progress;
  var studiesWithLoadingData = lodash_clonedeep_default()(ownProps.studies);
  studiesWithLoadingData.forEach(function (study) {
    study.thumbnails.forEach(function (data) {
      var displaySetInstanceUID = data.displaySetInstanceUID;
      var stackId = "StackProgress:".concat(displaySetInstanceUID);
      var stackProgressData = stackLoadingProgressMap[stackId];
      var stackPercentComplete = 0;

      if (stackProgressData) {
        stackPercentComplete = stackProgressData.percentComplete;
      }

      data.stackPercentComplete = stackPercentComplete;
    });
  });
  return {
    studies: studiesWithLoadingData
  };
};

var ConnectedStudyBrowser_mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    onThumbnailClick: function onThumbnailClick(displaySetInstanceUID) {
      var displaySet = findDisplaySetByUID(ownProps.studyMetadata, displaySetInstanceUID);

      if (displaySet.isDerived) {
        var _displaySet = displaySet,
            Modality = _displaySet.Modality;
        displaySet = displaySet.getSourceDisplaySet(ownProps.studyMetadata);

        if (!displaySet) {
          throw new Error("Referenced series for ".concat(Modality, " dataset not present."));
        }

        if (!displaySet) {
          throw new Error('Source data not present');
        }
      }

      dispatch(setActiveViewportSpecificData(displaySet));
    }
  };
};

var ConnectedStudyBrowser = Object(es["b" /* connect */])(ConnectedStudyBrowser_mapStateToProps, ConnectedStudyBrowser_mapDispatchToProps)(ui_src["z" /* StudyBrowser */]);
/* harmony default export */ var connectedComponents_ConnectedStudyBrowser = (ConnectedStudyBrowser);
// EXTERNAL MODULE: ./connectedComponents/ViewerMain.css
var connectedComponents_ViewerMain = __webpack_require__(975);

// EXTERNAL MODULE: ./components/ViewportGrid/ViewportGrid.css
var ViewportGrid_ViewportGrid = __webpack_require__(976);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/utils/index.js + 15 modules
var utils = __webpack_require__(134);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/react-dnd/dist/esm/index.js + 31 modules
var esm = __webpack_require__(193);

// EXTERNAL MODULE: ./components/ViewportGrid/ViewportPane.css
var ViewportGrid_ViewportPane = __webpack_require__(977);

// CONCATENATED MODULE: ./components/ViewportGrid/ViewportPane.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var ViewportPane_ViewportPane = function ViewportPane(props) {
  var children = props.children,
      onDrop = props.onDrop,
      viewportIndex = props.viewportIndex,
      propClassName = props.className;

  var _useDrop = Object(esm["d" /* useDrop */])({
    accept: 'thumbnail',
    drop: function drop(droppedItem, monitor) {
      var canDrop = monitor.canDrop();
      var isOver = monitor.isOver();

      if (canDrop && isOver && onDrop) {
        var StudyInstanceUID = droppedItem.StudyInstanceUID,
            displaySetInstanceUID = droppedItem.displaySetInstanceUID;
        onDrop({
          viewportIndex: viewportIndex,
          StudyInstanceUID: StudyInstanceUID,
          displaySetInstanceUID: displaySetInstanceUID
        });
      }
    },
    // Monitor, and collect props.
    // Returned as values by `useDrop`
    collect: function collect(monitor) {
      return {
        highlighted: monitor.canDrop(),
        hovered: monitor.isOver()
      };
    }
  }),
      _useDrop2 = _slicedToArray(_useDrop, 2),
      _useDrop2$ = _useDrop2[0],
      hovered = _useDrop2$.hovered,
      highlighted = _useDrop2$.highlighted,
      drop = _useDrop2[1];

  return react_default.a.createElement("div", {
    className: classnames_default()('viewport-drop-target', {
      hovered: hovered
    }, {
      highlighted: highlighted
    }, propClassName),
    ref: drop,
    "data-cy": "viewport-container-".concat(viewportIndex)
  }, children);
};

ViewportPane_ViewportPane.propTypes = {
  children: prop_types_default.a.node.isRequired,
  viewportIndex: prop_types_default.a.number.isRequired,
  onDrop: prop_types_default.a.func.isRequired,
  className: prop_types_default.a.string
};
/* harmony default export */ var components_ViewportGrid_ViewportPane = (ViewportPane_ViewportPane);
// CONCATENATED MODULE: ./components/ViewportGrid/DefaultViewport.js
/**
 *
 *
 * @export
 * @param {*} props
 * @returns
 */
function DefaultViewport(props) {
  return React.createElement("div", null, JSON.stringify(props));
}
// EXTERNAL MODULE: ./components/ViewportGrid/EmptyViewport.js
var EmptyViewport = __webpack_require__(978);
var EmptyViewport_default = /*#__PURE__*/__webpack_require__.n(EmptyViewport);

// CONCATENATED MODULE: ./components/ViewportGrid/ViewportGrid.js





 //




var loadAndCacheDerivedDisplaySets = utils["a" /* default */].loadAndCacheDerivedDisplaySets;

var ViewportGrid_ViewportGrid_ViewportGrid = function ViewportGrid(props) {
  var activeViewportIndex = props.activeViewportIndex,
      availablePlugins = props.availablePlugins,
      defaultPluginName = props.defaultPlugin,
      layout = props.layout,
      numRows = props.numRows,
      numColumns = props.numColumns,
      setViewportData = props.setViewportData,
      studies = props.studies,
      viewportData = props.viewportData,
      children = props.children,
      isStudyLoaded = props.isStudyLoaded;
  var rowSize = 100 / numRows;
  var colSize = 100 / numColumns; // http://grid.malven.co/

  if (!viewportData || !viewportData.length) {
    return null;
  }

  var snackbar = Object(ui_src["N" /* useSnackbarContext */])();
  Object(react["useEffect"])(function () {
    if (isStudyLoaded) {
      viewportData.forEach(function (displaySet) {
        var promises = loadAndCacheDerivedDisplaySets(displaySet, studies);
        promises.forEach(function (promise) {
          promise.catch(function (error) {
            snackbar.show({
              title: 'Error loading derived display set:',
              message: error.message,
              type: 'error',
              autoClose: false
            });
          });
        });
      });
    }
  }, [studies, viewportData, isStudyLoaded, snackbar]);

  var getViewportPanes = function getViewportPanes() {
    return layout.viewports.map(function (layout, viewportIndex) {
      var displaySet = viewportData[viewportIndex];

      if (!displaySet) {
        return null;
      }

      var data = {
        displaySet: displaySet,
        studies: studies
      }; // JAMES TODO:
      // Use whichever plugin is currently in use in the panel
      // unless nothing is specified. If nothing is specified
      // and the display set has a plugin specified, use that.
      //
      // TODO: Change this logic to:
      // - Plugins define how capable they are of displaying a SopClass
      // - When updating a panel, ensure that the currently enabled plugin
      // in the viewport is capable of rendering this display set. If not
      // then use the most capable available plugin

      var pluginName = !layout.plugin && displaySet && displaySet.plugin ? displaySet.plugin : layout.plugin;

      var ViewportComponent = _getViewportComponent(data, // Why do we pass this as `ViewportData`, when that's not really what it is?
      viewportIndex, children, availablePlugins, pluginName, defaultPluginName);

      return react_default.a.createElement(components_ViewportGrid_ViewportPane, {
        onDrop: setViewportData,
        viewportIndex: viewportIndex // Needed by `setViewportData`
        ,
        className: classnames_default()('viewport-container', {
          active: activeViewportIndex === viewportIndex
        }),
        key: viewportIndex
      }, ViewportComponent);
    });
  };

  var ViewportPanes = react_default.a.useMemo(getViewportPanes, [layout, viewportData, studies, children, availablePlugins, defaultPluginName, setViewportData, activeViewportIndex]);
  return react_default.a.createElement("div", {
    "data-cy": "viewprt-grid",
    style: {
      display: 'grid',
      gridTemplateRows: "repeat(".concat(numRows, ", ").concat(rowSize, "%)"),
      gridTemplateColumns: "repeat(".concat(numColumns, ", ").concat(colSize, "%)"),
      height: '100%',
      width: '100%'
    }
  }, ViewportPanes);
};

ViewportGrid_ViewportGrid_ViewportGrid.propTypes = {
  viewportData: prop_types_default.a.array.isRequired,
  supportsDrop: prop_types_default.a.bool.isRequired,
  activeViewportIndex: prop_types_default.a.number.isRequired,
  layout: prop_types_default.a.object.isRequired,
  availablePlugins: prop_types_default.a.object.isRequired,
  setViewportData: prop_types_default.a.func.isRequired,
  studies: prop_types_default.a.array,
  children: prop_types_default.a.node,
  defaultPlugin: prop_types_default.a.string,
  numRows: prop_types_default.a.number.isRequired,
  numColumns: prop_types_default.a.number.isRequired
};
ViewportGrid_ViewportGrid_ViewportGrid.defaultProps = {
  viewportData: [],
  numRows: 1,
  numColumns: 1,
  layout: {
    viewports: [{}]
  },
  activeViewportIndex: 0,
  supportsDrop: true,
  availablePlugins: {
    DefaultViewport: DefaultViewport
  },
  defaultPlugin: 'defaultViewportPlugin'
};
/**
 *
 *
 * @param {*} plugin
 * @param {*} viewportData
 * @param {*} viewportIndex
 * @param {*} children
 * @returns
 */

function _getViewportComponent(viewportData, viewportIndex, children, availablePlugins, pluginName, defaultPluginName) {
  if (viewportData.displaySet) {
    pluginName = pluginName || defaultPluginName;
    var ViewportComponent = availablePlugins[pluginName];

    if (!ViewportComponent) {
      throw new Error("No Viewport Component available for name ".concat(pluginName, ".\n         Available plugins: ").concat(JSON.stringify(availablePlugins)));
    }

    return react_default.a.createElement(ViewportComponent, {
      viewportData: viewportData,
      viewportIndex: viewportIndex,
      children: [children]
    });
  }

  return react_default.a.createElement(EmptyViewport_default.a, null);
}

/* harmony default export */ var components_ViewportGrid_ViewportGrid = (ViewportGrid_ViewportGrid_ViewportGrid);
// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/lodash/memoize.js
var memoize = __webpack_require__(587);
var memoize_default = /*#__PURE__*/__webpack_require__.n(memoize);

// CONCATENATED MODULE: ./components/ViewportGrid/ConnectedViewportGrid.js





var getAvailableViewportModules = memoize_default()(function (viewportModules) {
  var availableViewportModules = {};
  viewportModules.forEach(function (moduleDefinition) {
    availableViewportModules[moduleDefinition.extensionId] = moduleDefinition.module;
  });
  return availableViewportModules;
});

var ConnectedViewportGrid_mapStateToProps = function mapStateToProps(state) {
  var viewportModules = App["c" /* extensionManager */].modules[MODULE_TYPES["a" /* default */].VIEWPORT];
  var availableViewportModules = getAvailableViewportModules(viewportModules); // TODO: Use something like state.plugins.defaultPlugin[MODULE_TYPES.VIEWPORT]

  var defaultPlugin;

  if (viewportModules.length) {
    defaultPlugin = viewportModules[0].extensionId;
  }

  var _state$viewports = state.viewports,
      numRows = _state$viewports.numRows,
      numColumns = _state$viewports.numColumns,
      layout = _state$viewports.layout,
      activeViewportIndex = _state$viewports.activeViewportIndex;
  return {
    numRows: numRows,
    numColumns: numColumns,
    layout: layout,
    activeViewportIndex: activeViewportIndex,
    // TODO: rename `availableViewportModules`
    availablePlugins: availableViewportModules,
    // TODO: rename `defaultViewportModule`
    defaultPlugin: defaultPlugin
  };
};

var ConnectedViewportGrid = Object(es["b" /* connect */])(ConnectedViewportGrid_mapStateToProps, null)(components_ViewportGrid_ViewportGrid);
/* harmony default export */ var ViewportGrid_ConnectedViewportGrid = (ConnectedViewportGrid);
// CONCATENATED MODULE: ./components/ViewportGrid/index.js


/* harmony default export */ var components_ViewportGrid = (components_ViewportGrid_ViewportGrid);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/lodash/values.js
var values = __webpack_require__(992);
var values_default = /*#__PURE__*/__webpack_require__.n(values);

// CONCATENATED MODULE: ./connectedComponents/ViewerMain.js
function ViewerMain_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ViewerMain_typeof = function _typeof(obj) { return typeof obj; }; } else { ViewerMain_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ViewerMain_typeof(obj); }

function ViewerMain_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ViewerMain_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ViewerMain_createClass(Constructor, protoProps, staticProps) { if (protoProps) ViewerMain_defineProperties(Constructor.prototype, protoProps); if (staticProps) ViewerMain_defineProperties(Constructor, staticProps); return Constructor; }

function ViewerMain_possibleConstructorReturn(self, call) { if (call && (ViewerMain_typeof(call) === "object" || typeof call === "function")) { return call; } return ViewerMain_assertThisInitialized(self); }

function ViewerMain_getPrototypeOf(o) { ViewerMain_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return ViewerMain_getPrototypeOf(o); }

function ViewerMain_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function ViewerMain_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) ViewerMain_setPrototypeOf(subClass, superClass); }

function ViewerMain_setPrototypeOf(o, p) { ViewerMain_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return ViewerMain_setPrototypeOf(o, p); }

function ViewerMain_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








var ViewerMain_values = memoize_default()(values_default.a);

var ViewerMain_ViewerMain =
/*#__PURE__*/
function (_Component) {
  ViewerMain_inherits(ViewerMain, _Component);

  function ViewerMain(props) {
    var _this;

    ViewerMain_classCallCheck(this, ViewerMain);

    _this = ViewerMain_possibleConstructorReturn(this, ViewerMain_getPrototypeOf(ViewerMain).call(this, props));

    ViewerMain_defineProperty(ViewerMain_assertThisInitialized(_this), "fillEmptyViewportPanes", function () {
      // TODO: Here is the entry point for filling viewports on load.
      var dirtyViewportPanes = [];
      var _this$props = _this.props,
          layout = _this$props.layout,
          viewportSpecificData = _this$props.viewportSpecificData;
      var displaySets = _this.state.displaySets;

      if (!displaySets || !displaySets.length) {
        return;
      }

      for (var i = 0; i < layout.viewports.length; i++) {
        var viewportPane = viewportSpecificData[i];
        var isNonEmptyViewport = viewportPane && viewportPane.StudyInstanceUID && viewportPane.displaySetInstanceUID;

        if (isNonEmptyViewport) {
          dirtyViewportPanes.push({
            StudyInstanceUID: viewportPane.StudyInstanceUID,
            displaySetInstanceUID: viewportPane.displaySetInstanceUID
          });
          continue;
        }

        var foundDisplaySet = displaySets.find(function (ds) {
          return !dirtyViewportPanes.some(function (v) {
            return v.displaySetInstanceUID === ds.displaySetInstanceUID;
          });
        }) || displaySets[displaySets.length - 1];
        dirtyViewportPanes.push(foundDisplaySet);
      }

      dirtyViewportPanes.forEach(function (vp, i) {
        if (vp && vp.StudyInstanceUID) {
          _this.setViewportData({
            viewportIndex: i,
            StudyInstanceUID: vp.StudyInstanceUID,
            displaySetInstanceUID: vp.displaySetInstanceUID
          });
        }
      });
    });

    ViewerMain_defineProperty(ViewerMain_assertThisInitialized(_this), "setViewportData", function (_ref) {
      var viewportIndex = _ref.viewportIndex,
          StudyInstanceUID = _ref.StudyInstanceUID,
          displaySetInstanceUID = _ref.displaySetInstanceUID;

      var displaySet = _this.findDisplaySet(_this.props.studies, StudyInstanceUID, displaySetInstanceUID);

      if (displaySet.isDerived) {
        var _displaySet = displaySet,
            Modality = _displaySet.Modality;
        displaySet = displaySet.getSourceDisplaySet(_this.props.studies);

        if (!displaySet) {
          throw new Error("Referenced series for ".concat(Modality, " dataset not present."));
        }
      }

      _this.props.setViewportSpecificData(viewportIndex, displaySet);
    });

    _this.state = {
      displaySets: []
    };
    return _this;
  }

  ViewerMain_createClass(ViewerMain, [{
    key: "getDisplaySets",
    value: function getDisplaySets(studies) {
      var displaySets = [];
      studies.forEach(function (study) {
        study.displaySets.forEach(function (dSet) {
          if (!dSet.plugin) {
            dSet.plugin = 'cornerstone';
          }

          displaySets.push(dSet);
        });
      });
      return displaySets;
    }
  }, {
    key: "findDisplaySet",
    value: function findDisplaySet(studies, StudyInstanceUID, displaySetInstanceUID) {
      var study = studies.find(function (study) {
        return study.StudyInstanceUID === StudyInstanceUID;
      });

      if (!study) {
        return;
      }

      return study.displaySets.find(function (displaySet) {
        return displaySet.displaySetInstanceUID === displaySetInstanceUID;
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // Add beforeUnload event handler to check for unsaved changes
      //window.addEventListener('beforeunload', unloadHandlers.beforeUnload);
      // Get all the display sets for the viewer studies
      if (this.props.studies) {
        var displaySets = this.getDisplaySets(this.props.studies);
        this.setState({
          displaySets: displaySets
        }, this.fillEmptyViewportPanes);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var prevViewportAmount = prevProps.layout.viewports.length;
      var viewportAmount = this.props.layout.viewports.length;
      var isVtk = this.props.layout.viewports.some(function (vp) {
        return !!vp.vtk;
      });

      if (this.props.studies !== prevProps.studies || viewportAmount !== prevViewportAmount && !isVtk) {
        var displaySets = this.getDisplaySets(this.props.studies);
        this.setState({
          displaySets: displaySets
        }, this.fillEmptyViewportPanes);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var viewportSpecificData = this.props.viewportSpecificData;
      var viewportData = ViewerMain_values(viewportSpecificData);
      return react_default.a.createElement("div", {
        className: "ViewerMain"
      }, this.state.displaySets.length && react_default.a.createElement(ViewportGrid_ConnectedViewportGrid, {
        isStudyLoaded: this.props.isStudyLoaded,
        studies: this.props.studies,
        viewportData: viewportData,
        setViewportData: this.setViewportData
      }));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this2 = this;

      // Clear the entire viewport specific data
      var viewportSpecificData = this.props.viewportSpecificData;
      Object.keys(viewportSpecificData).forEach(function (viewportIndex) {
        _this2.props.clearViewportSpecificData(viewportIndex);
      }); // TODO: These don't have to be viewer specific?
      // Could qualify for other routes?
      // hotkeys.destroy();
      // Remove beforeUnload event handler...
      //window.removeEventListener('beforeunload', unloadHandlers.beforeUnload);
      // Destroy the synchronizer used to update reference lines
      //OHIF.viewer.updateImageSynchronizer.destroy();
      // TODO: Instruct all plugins to clean up themselves
      //
      // Clear references to all stacks in the StackManager
      //StackManager.clearStacks();
      // @TypeSafeStudies
      // Clears OHIF.viewer.Studies collection
      //OHIF.viewer.Studies.removeAll();
      // @TypeSafeStudies
      // Clears OHIF.viewer.StudyMetadataList collection
      //OHIF.viewer.StudyMetadataList.removeAll();
    }
  }]);

  return ViewerMain;
}(react["Component"]);

ViewerMain_defineProperty(ViewerMain_ViewerMain, "propTypes", {
  activeViewportIndex: prop_types_default.a.number.isRequired,
  studies: prop_types_default.a.array,
  viewportSpecificData: prop_types_default.a.object.isRequired,
  layout: prop_types_default.a.object.isRequired,
  setViewportSpecificData: prop_types_default.a.func.isRequired,
  clearViewportSpecificData: prop_types_default.a.func.isRequired
});

/* harmony default export */ var connectedComponents_ViewerMain_0 = (ViewerMain_ViewerMain);
// CONCATENATED MODULE: ./connectedComponents/ConnectedViewerMain.js



var ConnectedViewerMain_OHIF$redux$actions = src["a" /* default */].redux.actions,
    _setViewportSpecificData = ConnectedViewerMain_OHIF$redux$actions.setViewportSpecificData,
    _clearViewportSpecificData = ConnectedViewerMain_OHIF$redux$actions.clearViewportSpecificData;

var ConnectedViewerMain_mapStateToProps = function mapStateToProps(state) {
  var _state$viewports = state.viewports,
      activeViewportIndex = _state$viewports.activeViewportIndex,
      layout = _state$viewports.layout,
      viewportSpecificData = _state$viewports.viewportSpecificData;
  return {
    activeViewportIndex: activeViewportIndex,
    layout: layout,
    viewportSpecificData: viewportSpecificData,
    viewports: state.viewports
  };
};

var ConnectedViewerMain_mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    setViewportSpecificData: function setViewportSpecificData(viewportIndex, data) {
      dispatch(_setViewportSpecificData(viewportIndex, data));
    },
    clearViewportSpecificData: function clearViewportSpecificData() {
      dispatch(_clearViewportSpecificData());
    }
  };
};

var ConnectedViewerMain = Object(es["b" /* connect */])(ConnectedViewerMain_mapStateToProps, ConnectedViewerMain_mapDispatchToProps)(connectedComponents_ViewerMain_0);
/* harmony default export */ var connectedComponents_ConnectedViewerMain = (ConnectedViewerMain);
// EXTERNAL MODULE: ./components/SidePanel.css
var components_SidePanel = __webpack_require__(979);

// CONCATENATED MODULE: ./components/SidePanel.js
function SidePanel_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { SidePanel_typeof = function _typeof(obj) { return typeof obj; }; } else { SidePanel_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return SidePanel_typeof(obj); }

function SidePanel_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function SidePanel_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function SidePanel_createClass(Constructor, protoProps, staticProps) { if (protoProps) SidePanel_defineProperties(Constructor.prototype, protoProps); if (staticProps) SidePanel_defineProperties(Constructor, staticProps); return Constructor; }

function SidePanel_possibleConstructorReturn(self, call) { if (call && (SidePanel_typeof(call) === "object" || typeof call === "function")) { return call; } return SidePanel_assertThisInitialized(self); }

function SidePanel_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function SidePanel_getPrototypeOf(o) { SidePanel_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return SidePanel_getPrototypeOf(o); }

function SidePanel_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) SidePanel_setPrototypeOf(subClass, superClass); }

function SidePanel_setPrototypeOf(o, p) { SidePanel_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return SidePanel_setPrototypeOf(o, p); }

function SidePanel_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var SidePanel_SidePanel =
/*#__PURE__*/
function (_Component) {
  SidePanel_inherits(SidePanel, _Component);

  function SidePanel() {
    SidePanel_classCallCheck(this, SidePanel);

    return SidePanel_possibleConstructorReturn(this, SidePanel_getPrototypeOf(SidePanel).apply(this, arguments));
  }

  SidePanel_createClass(SidePanel, [{
    key: "render",
    value: function render() {
      var fromSideClass = this.props.from === 'right' ? 'from-right' : 'from-left';
      var styles = this.props.width ? {
        maxWidth: this.props.width,
        marginRight: this.props.isOpen ? '0' : Number.parseInt(this.props.width) * -1
      } : {};
      return react_default.a.createElement("section", {
        style: styles,
        className: classnames_default()('sidepanel', fromSideClass, {
          'is-open': this.props.isOpen
        })
      }, this.props.children);
    }
  }]);

  return SidePanel;
}(react["Component"]);

SidePanel_defineProperty(SidePanel_SidePanel, "propTypes", {
  from: prop_types_default.a.string.isRequired,
  isOpen: prop_types_default.a.bool.isRequired,
  children: prop_types_default.a.node,
  width: prop_types_default.a.string
});

/* harmony default export */ var components_SidePanel_0 = (SidePanel_SidePanel);
// EXTERNAL MODULE: ./components/ErrorBoundaryDialog/ErrorBoundaryDialog.css
var ErrorBoundaryDialog_ErrorBoundaryDialog = __webpack_require__(980);

// CONCATENATED MODULE: ./components/ErrorBoundaryDialog/ErrorBoundaryDialog.js
function ErrorBoundaryDialog_slicedToArray(arr, i) { return ErrorBoundaryDialog_arrayWithHoles(arr) || ErrorBoundaryDialog_iterableToArrayLimit(arr, i) || ErrorBoundaryDialog_nonIterableRest(); }

function ErrorBoundaryDialog_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function ErrorBoundaryDialog_iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ErrorBoundaryDialog_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var UIModalService = App["e" /* servicesManager */].services.UIModalService;

var ErrorBoundaryDialog_ErrorBoundaryDialog_ErrorBoundaryDialog = function ErrorBoundaryDialog(_ref) {
  var context = _ref.context,
      children = _ref.children;

  var handleOnError = function handleOnError(error, componentStack) {
    var ErrorDialog = function ErrorDialog() {
      var _useState = Object(react["useState"])(false),
          _useState2 = ErrorBoundaryDialog_slicedToArray(_useState, 2),
          open = _useState2[0],
          setOpen = _useState2[1];

      return react_default.a.createElement("div", {
        className: "ErrorFallback",
        role: "alert"
      }, react_default.a.createElement("div", {
        className: "ErrorBoundaryDialog"
      }, react_default.a.createElement("h3", {
        className: "ErrorBoundaryDialogTitle"
      }, context, ": ", react_default.a.createElement("span", null, error.message))), react_default.a.createElement("button", {
        className: "btn btn-primary btn-sm ErrorBoundaryDialogButton",
        onClick: function onClick() {
          return setOpen(function (s) {
            return !s;
          });
        }
      }, react_default.a.createElement(ui_src["j" /* Icon */], {
        name: "chevron-down",
        className: classnames_default()('ErrorBoundaryDialogIcon', {
          opened: open
        })
      }), "Stack Trace"), open && react_default.a.createElement("pre", null, componentStack));
    };

    UIModalService.show({
      content: ErrorDialog,
      title: "Something went wrong in ".concat(context)
    });
  };

  var fallbackComponent = function fallbackComponent() {
    return react_default.a.createElement("div", {
      className: "ErrorFallback",
      role: "alert"
    }, react_default.a.createElement("p", null, "Error rendering ", context, ". ", react_default.a.createElement("br", null), " Check the browser console for more details."));
  };

  return react_default.a.createElement(ui_src["g" /* ErrorBoundary */], {
    fallbackComponent: fallbackComponent,
    context: context,
    onError: handleOnError
  }, children);
};

ErrorBoundaryDialog_ErrorBoundaryDialog_ErrorBoundaryDialog.propTypes = {
  context: prop_types_default.a.string.isRequired,
  children: prop_types_default.a.node.isRequired
};
/* harmony default export */ var components_ErrorBoundaryDialog_ErrorBoundaryDialog = (ErrorBoundaryDialog_ErrorBoundaryDialog_ErrorBoundaryDialog);
// CONCATENATED MODULE: ./components/ErrorBoundaryDialog/index.js

/* harmony default export */ var components_ErrorBoundaryDialog = (components_ErrorBoundaryDialog_ErrorBoundaryDialog);
// EXTERNAL MODULE: ./context/WhiteLabelingContext.js
var WhiteLabelingContext = __webpack_require__(210);

// EXTERNAL MODULE: ./context/UserManagerContext.js
var UserManagerContext = __webpack_require__(256);

// EXTERNAL MODULE: ./connectedComponents/Viewer.css
var connectedComponents_Viewer = __webpack_require__(981);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/node_modules/stream-browserify/index.js
var stream_browserify = __webpack_require__(993);

// CONCATENATED MODULE: ./connectedComponents/Viewer.js
function Viewer_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { Viewer_typeof = function _typeof(obj) { return typeof obj; }; } else { Viewer_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return Viewer_typeof(obj); }

function Viewer_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Viewer_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Viewer_createClass(Constructor, protoProps, staticProps) { if (protoProps) Viewer_defineProperties(Constructor.prototype, protoProps); if (staticProps) Viewer_defineProperties(Constructor, staticProps); return Constructor; }

function Viewer_possibleConstructorReturn(self, call) { if (call && (Viewer_typeof(call) === "object" || typeof call === "function")) { return call; } return Viewer_assertThisInitialized(self); }

function Viewer_getPrototypeOf(o) { Viewer_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return Viewer_getPrototypeOf(o); }

function Viewer_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function Viewer_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) Viewer_setPrototypeOf(subClass, superClass); }

function Viewer_setPrototypeOf(o, p) { Viewer_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return Viewer_setPrototypeOf(o, p); }

function Viewer_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }













 // Contexts







var Viewer_Viewer =
/*#__PURE__*/
function (_Component) {
  Viewer_inherits(Viewer, _Component);

  function Viewer(props) {
    var _this;

    Viewer_classCallCheck(this, Viewer);

    _this = Viewer_possibleConstructorReturn(this, Viewer_getPrototypeOf(Viewer).call(this, props));

    Viewer_defineProperty(Viewer_assertThisInitialized(_this), "state", {
      isLeftSidePanelOpen: true,
      isRightSidePanelOpen: false,
      selectedRightSidePanel: '',
      selectedLeftSidePanel: 'studies',
      // TODO: Don't hardcode this
      thumbnails: []
    });

    Viewer_defineProperty(Viewer_assertThisInitialized(_this), "retrieveTimepoints", function (filter) {
      src["a" /* default */].log.info('retrieveTimepoints'); // Get the earliest and latest study date

      var earliestDate = new Date().toISOString();
      var latestDate = new Date().toISOString();

      if (_this.props.studies) {
        latestDate = new Date('1000-01-01').toISOString();

        _this.props.studies.forEach(function (study) {
          var StudyDate = moment_default()(study.StudyDate, 'YYYYMMDD').toISOString();

          if (StudyDate < earliestDate) {
            earliestDate = StudyDate;
          }

          if (StudyDate > latestDate) {
            latestDate = StudyDate;
          }
        });
      } // Return a generic timepoint


      return Promise.resolve([{
        timepointType: 'baseline',
        timepointId: 'TimepointId',
        studyInstanceUIDs: _this.props.studyInstanceUIDs,
        PatientID: filter.PatientID,
        earliestDate: earliestDate,
        latestDate: latestDate,
        isLocked: false
      }]);
    });

    Viewer_defineProperty(Viewer_assertThisInitialized(_this), "storeTimepoints", function (timepointData) {
      src["a" /* default */].log.info('storeTimepoints');
      return Promise.resolve();
    });

    Viewer_defineProperty(Viewer_assertThisInitialized(_this), "updateTimepoint", function (timepointData, query) {
      src["a" /* default */].log.info('updateTimepoint');
      return Promise.resolve();
    });

    Viewer_defineProperty(Viewer_assertThisInitialized(_this), "removeTimepoint", function (timepointId) {
      src["a" /* default */].log.info('removeTimepoint');
      return Promise.resolve();
    });

    Viewer_defineProperty(Viewer_assertThisInitialized(_this), "disassociateStudy", function (timepointIds, StudyInstanceUID) {
      src["a" /* default */].log.info('disassociateStudy');
      return Promise.resolve();
    });

    Viewer_defineProperty(Viewer_assertThisInitialized(_this), "onTimepointsUpdated", function (timepoints) {
      if (_this.props.onTimepointsUpdated) {
        _this.props.onTimepointsUpdated(timepoints);
      }
    });

    Viewer_defineProperty(Viewer_assertThisInitialized(_this), "onMeasurementsUpdated", function (measurements) {
      if (_this.props.onMeasurementsUpdated) {
        _this.props.onMeasurementsUpdated(measurements);
      }
    });

    var activeServer = _this.props.activeServer;
    var server = Object.assign({}, activeServer);
    src["a" /* default */].measurements.MeasurementApi.setConfiguration({
      dataExchange: {
        retrieve: DICOMSR["a" /* default */].retrieveMeasurements,
        store: DICOMSR["a" /* default */].storeMeasurements
      },
      server: server
    });
    src["a" /* default */].measurements.TimepointApi.setConfiguration({
      dataExchange: {
        retrieve: _this.retrieveTimepoints,
        store: _this.storeTimepoints,
        remove: _this.removeTimepoint,
        update: _this.updateTimepoint,
        disassociate: _this.disassociateStudy
      }
    });
    return _this;
  }

  Viewer_createClass(Viewer, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.dialog) {
        this.props.dialog.dismissAll();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          studies = _this$props.studies,
          isStudyLoaded = _this$props.isStudyLoaded;
      var _OHIF$measurements = src["a" /* default */].measurements,
          TimepointApi = _OHIF$measurements.TimepointApi,
          MeasurementApi = _OHIF$measurements.MeasurementApi;
      var currentTimepointId = 'TimepointId';
      var timepointApi = new TimepointApi(currentTimepointId, {
        onTimepointsUpdated: this.onTimepointsUpdated
      });
      var measurementApi = new MeasurementApi(timepointApi, {
        onMeasurementsUpdated: this.onMeasurementsUpdated
      });
      this.currentTimepointId = currentTimepointId;
      this.timepointApi = timepointApi;
      this.measurementApi = measurementApi;

      if (studies) {
        var PatientID = studies[0] && studies[0].PatientID;
        timepointApi.retrieveTimepoints({
          PatientID: PatientID
        });

        if (isStudyLoaded) {
          this.measurementApi.retrieveMeasurements(PatientID, [currentTimepointId]);
        }

        this.setState({
          thumbnails: _mapStudiesToThumbnails(studies)
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props2 = this.props,
          studies = _this$props2.studies,
          isStudyLoaded = _this$props2.isStudyLoaded;

      if (studies !== prevProps.studies) {
        this.setState({
          thumbnails: _mapStudiesToThumbnails(studies)
        });
      }

      if (isStudyLoaded && isStudyLoaded !== prevProps.isStudyLoaded) {
        var PatientID = studies[0] && studies[0].PatientID;
        var currentTimepointId = this.currentTimepointId;
        this.timepointApi.retrieveTimepoints({
          PatientID: PatientID
        });
        this.measurementApi.retrieveMeasurements(PatientID, [currentTimepointId]);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var VisiblePanelLeft, VisiblePanelRight;
      var panelExtensions = App["c" /* extensionManager */].modules[MODULE_TYPES["a" /* default */].PANEL];
      panelExtensions.forEach(function (panelExt) {
        panelExt.module.components.forEach(function (comp) {
          if (comp.id === _this2.state.selectedRightSidePanel) {
            VisiblePanelRight = comp.component;
          } else if (comp.id === _this2.state.selectedLeftSidePanel) {
            VisiblePanelLeft = comp.component;
          }
        });
      });
      return react_default.a.createElement(react_default.a.Fragment, null, react_default.a.createElement(WhiteLabelingContext["a" /* default */].Consumer, null, function (whiteLabeling) {
        return react_default.a.createElement(UserManagerContext["a" /* default */].Consumer, null, function (userManager) {
          return react_default.a.createElement(AppContext["c" /* default */].Consumer, null, function (appContext) {
            return react_default.a.createElement(ConnectedHeader["a" /* default */], {
              linkText: appContext.appConfig.showStudyList ? 'Study List' : undefined,
              linkPath: appContext.appConfig.showStudyList ? '/' : undefined,
              userManager: userManager
            }, whiteLabeling && whiteLabeling.createLogoComponentFn && whiteLabeling.createLogoComponentFn(react_default.a));
          });
        });
      }), react_default.a.createElement(components_ErrorBoundaryDialog, {
        context: "ToolbarRow"
      }, react_default.a.createElement(connectedComponents_ToolbarRow_0, {
        isLeftSidePanelOpen: this.state.isLeftSidePanelOpen,
        isRightSidePanelOpen: this.state.isRightSidePanelOpen,
        selectedLeftSidePanel: this.state.isLeftSidePanelOpen ? this.state.selectedLeftSidePanel : '',
        selectedRightSidePanel: this.state.isRightSidePanelOpen ? this.state.selectedRightSidePanel : '',
        handleSidePanelChange: function handleSidePanelChange(side, selectedPanel) {
          var sideClicked = side && side[0].toUpperCase() + side.slice(1);
          var openKey = "is".concat(sideClicked, "SidePanelOpen");
          var selectedKey = "selected".concat(sideClicked, "SidePanel");
          var updatedState = Object.assign({}, _this2.state);
          var isOpen = updatedState[openKey];
          var prevSelectedPanel = updatedState[selectedKey]; // RoundedButtonGroup returns `null` if selected button is clicked

          var isSameSelectedPanel = prevSelectedPanel === selectedPanel || selectedPanel === null;
          updatedState[selectedKey] = selectedPanel || prevSelectedPanel;
          var isClosedOrShouldClose = !isOpen || isSameSelectedPanel;

          if (isClosedOrShouldClose) {
            updatedState[openKey] = !updatedState[openKey];
          }

          _this2.setState(updatedState);
        },
        studies: this.props.studies
      })), react_default.a.createElement("div", {
        className: "FlexboxLayout"
      }, react_default.a.createElement(components_ErrorBoundaryDialog, {
        context: "LeftSidePanel"
      }, react_default.a.createElement(components_SidePanel_0, {
        from: "left",
        isOpen: this.state.isLeftSidePanelOpen
      }, VisiblePanelLeft ? react_default.a.createElement(VisiblePanelLeft, {
        viewports: this.props.viewports,
        studies: this.props.studies,
        activeIndex: this.props.activeViewportIndex
      }) : react_default.a.createElement(connectedComponents_ConnectedStudyBrowser, {
        studies: this.state.thumbnails,
        studyMetadata: this.props.studies
      }))), react_default.a.createElement("div", {
        className: classnames_default()('main-content')
      }, react_default.a.createElement(components_ErrorBoundaryDialog, {
        context: "ViewerMain"
      }, react_default.a.createElement(connectedComponents_ConnectedViewerMain, {
        studies: this.props.studies,
        isStudyLoaded: this.props.isStudyLoaded
      }))), react_default.a.createElement(components_ErrorBoundaryDialog, {
        context: "RightSidePanel"
      }, react_default.a.createElement(components_SidePanel_0, {
        from: "right",
        isOpen: this.state.isRightSidePanelOpen
      }, VisiblePanelRight && react_default.a.createElement(VisiblePanelRight, {
        isOpen: this.state.isRightSidePanelOpen,
        viewports: this.props.viewports,
        studies: this.props.studies,
        activeIndex: this.props.activeViewportIndex
      })))));
    }
  }]);

  return Viewer;
}(react["Component"]);

Viewer_defineProperty(Viewer_Viewer, "propTypes", {
  studies: prop_types_default.a.arrayOf(prop_types_default.a.shape({
    StudyInstanceUID: prop_types_default.a.string.isRequired,
    StudyDate: prop_types_default.a.string,
    PatientID: prop_types_default.a.string,
    displaySets: prop_types_default.a.arrayOf(prop_types_default.a.shape({
      displaySetInstanceUID: prop_types_default.a.string.isRequired,
      SeriesDescription: prop_types_default.a.string,
      SeriesNumber: prop_types_default.a.number,
      InstanceNumber: prop_types_default.a.number,
      numImageFrames: prop_types_default.a.number,
      Modality: prop_types_default.a.string.isRequired,
      images: prop_types_default.a.arrayOf(prop_types_default.a.shape({
        getImageId: prop_types_default.a.func.isRequired
      }))
    }))
  })),
  studyInstanceUIDs: prop_types_default.a.array,
  activeServer: prop_types_default.a.shape({
    type: prop_types_default.a.string,
    wadoRoot: prop_types_default.a.string
  }),
  onTimepointsUpdated: prop_types_default.a.func,
  onMeasurementsUpdated: prop_types_default.a.func,
  // window.store.getState().viewports.viewportSpecificData
  viewports: prop_types_default.a.object.isRequired,
  // window.store.getState().viewports.activeViewportIndex
  activeViewportIndex: prop_types_default.a.number.isRequired,
  isStudyLoaded: prop_types_default.a.bool,
  dialog: prop_types_default.a.object
});

/* harmony default export */ var connectedComponents_Viewer_0 = (Object(ui_src["O" /* withDialog */])(Viewer_Viewer));
/**
 * What types are these? Why do we have "mapping" dropped in here instead of in
 * a mapping layer?
 *
 * TODO[react]:
 * - Add showStackLoadingProgressBar option
 *
 * @param {Study[]} studies
 * @param {DisplaySet[]} studies[].displaySets
 */

var _mapStudiesToThumbnails = function _mapStudiesToThumbnails(studies) {
  return studies.map(function (study) {
    var StudyInstanceUID = study.StudyInstanceUID;
    var thumbnails = study.displaySets.map(function (displaySet) {
      var displaySetInstanceUID = displaySet.displaySetInstanceUID,
          SeriesDescription = displaySet.SeriesDescription,
          InstanceNumber = displaySet.InstanceNumber,
          numImageFrames = displaySet.numImageFrames,
          SeriesNumber = displaySet.SeriesNumber;
      var imageId;
      var altImageText;

      if (displaySet.Modality && displaySet.Modality === 'SEG') {
        // TODO: We want to replace this with a thumbnail showing
        // the segmentation map on the image, but this is easier
        // and better than what we have right now.
        altImageText = 'SEG';
      } else if (displaySet.images && displaySet.images.length) {
        var imageIndex = Math.floor(displaySet.images.length / 2);
        imageId = displaySet.images[imageIndex].getImageId();
      } else {
        altImageText = displaySet.Modality ? displaySet.Modality : 'UN';
      }

      return {
        imageId: imageId,
        altImageText: altImageText,
        displaySetInstanceUID: displaySetInstanceUID,
        SeriesDescription: SeriesDescription,
        InstanceNumber: InstanceNumber,
        numImageFrames: numImageFrames,
        SeriesNumber: SeriesNumber
      };
    });
    return {
      StudyInstanceUID: StudyInstanceUID,
      thumbnails: thumbnails
    };
  });
};
// CONCATENATED MODULE: ./connectedComponents/ConnectedViewer.js



var ConnectedViewer_OHIF$redux$actions = src["a" /* default */].redux.actions,
    setTimepoints = ConnectedViewer_OHIF$redux$actions.setTimepoints,
    setMeasurements = ConnectedViewer_OHIF$redux$actions.setMeasurements;

var getActiveServer = function getActiveServer(servers) {
  var isActive = function isActive(a) {
    return a.active === true;
  };

  return servers.servers.find(isActive);
};

var ConnectedViewer_mapStateToProps = function mapStateToProps(state) {
  var viewports = state.viewports,
      servers = state.servers;
  return {
    viewports: viewports.viewportSpecificData,
    activeViewportIndex: viewports.activeViewportIndex,
    activeServer: getActiveServer(servers)
  };
};

var ConnectedViewer_mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onTimepointsUpdated: function onTimepointsUpdated(timepoints) {
      dispatch(setTimepoints(timepoints));
    },
    onMeasurementsUpdated: function onMeasurementsUpdated(measurements) {
      dispatch(setMeasurements(measurements));
    }
  };
};

var ConnectedViewer = Object(es["b" /* connect */])(ConnectedViewer_mapStateToProps, ConnectedViewer_mapDispatchToProps)(connectedComponents_Viewer_0);
/* harmony default export */ var connectedComponents_ConnectedViewer = __webpack_exports__["a"] = (ConnectedViewer);

/***/ }),

/***/ 974:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 975:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 976:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 977:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 978:
/***/ (function(module, exports) {

/**
 *
 *
 * @returns
 */
function EmptyViewport() {
  return React.createElement("div", {
    className: "empty-viewport"
  }, React.createElement("p", null, "Please drag a stack here to view images."));
}

/***/ }),

/***/ 979:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 980:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 981:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 990:
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
var dcmjs_es = __webpack_require__(28);

// EXTERNAL MODULE: /home/salim/GaelO-Dev/OHIF/Viewers/platform/core/src/index.js + 28 modules
var src = __webpack_require__(16);

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

/***/ 997:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 998:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

}]);