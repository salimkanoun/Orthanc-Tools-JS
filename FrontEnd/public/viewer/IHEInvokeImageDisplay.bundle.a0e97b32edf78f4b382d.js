(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ 945:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(75);
/* harmony import */ var _connectedComponents_ConnectedViewerRetrieveStudyData_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(991);
/* harmony import */ var _ohif_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(16);





var UrlUtil = _ohif_core__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"].utils.urlUtil;

function IHEInvokeImageDisplay(_ref) {
  var location = _ref.location;

  var _UrlUtil$parse = UrlUtil.parse(location.search),
      requestType = _UrlUtil$parse.requestType,
      studyUID = _UrlUtil$parse.studyUID;

  switch (requestType) {
    case 'STUDY':
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_connectedComponents_ConnectedViewerRetrieveStudyData_js__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"], {
        studyInstanceUIDs: studyUID.split(';')
      });

    case 'STUDYBASE64':
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_connectedComponents_ConnectedViewerRetrieveStudyData_js__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"], {
        studyInstanceUIDs: UrlUtil.paramString.parseParam(studyUID)
      });

    case 'PATIENT':
      // TODO: connect this to the StudyList when we have the filter parameters set up
      // return <StudyList patientUIDs={patientID.split(';')} />;
      return '';

    default:
      // TODO: Figure out what to do here, this won't work because StudyList expects studies
      // return <StudyList />;
      return '';
  }
}

IHEInvokeImageDisplay.propTypes = {
  location: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
    search: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
  }).isRequired
};
/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[/* withRouter */ "g"])(IHEInvokeImageDisplay));

/***/ })

}]);