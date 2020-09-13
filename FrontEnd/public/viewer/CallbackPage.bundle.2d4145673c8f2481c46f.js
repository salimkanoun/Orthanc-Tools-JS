(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ 1006:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(75);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var redux_oidc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(82);
/* harmony import */ var redux_oidc__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(redux_oidc__WEBPACK_IMPORTED_MODULE_3__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var CallbackPage =
/*#__PURE__*/
function (_Component) {
  _inherits(CallbackPage, _Component);

  function CallbackPage() {
    _classCallCheck(this, CallbackPage);

    return _possibleConstructorReturn(this, _getPrototypeOf(CallbackPage).apply(this, arguments));
  }

  _createClass(CallbackPage, [{
    key: "render",
    value: function render() {
      var _this = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(redux_oidc__WEBPACK_IMPORTED_MODULE_3__["CallbackComponent"], {
        userManager: this.props.userManager,
        successCallback: function successCallback() {
          var _JSON$parse = JSON.parse(sessionStorage.getItem('ohif-redirect-to')),
              pathname = _JSON$parse.pathname,
              _JSON$parse$search = _JSON$parse.search,
              search = _JSON$parse$search === void 0 ? '' : _JSON$parse$search;

          _this.props.history.push({
            pathname: pathname,
            search: search
          });
        },
        errorCallback: function errorCallback(error) {
          //this.props.history.push("/");
          throw new Error(error);
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Redirecting..."));
    }
  }]);

  return CallbackPage;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

_defineProperty(CallbackPage, "propTypes", {
  userManager: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.object.isRequired,
  history: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.object.isRequired
});

/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__[/* withRouter */ "g"])(CallbackPage));

/***/ })

}]);