/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/viewer/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// https://developers.google.com/web/tools/workbox/guides/troubleshoot-and-debug
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0-beta.1/workbox-sw.js'); // Install newest
// https://developers.google.com/web/tools/workbox/modules/workbox-core

workbox.core.skipWaiting();
workbox.core.clientsClaim(); // Cache static assets that aren't precached

workbox.routing.registerRoute(/\.(?:js|css)$/, new workbox.strategies.StaleWhileRevalidate({
  cacheName: 'static-resources'
})); // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.

workbox.routing.registerRoute(/^https:\/\/fonts\.googleapis\.com/, new workbox.strategies.StaleWhileRevalidate({
  cacheName: 'google-fonts-stylesheets'
})); // Cache the underlying font files with a cache-first strategy for 1 year.

workbox.routing.registerRoute(/^https:\/\/fonts\.gstatic\.com/, new workbox.strategies.CacheFirst({
  cacheName: 'google-fonts-webfonts',
  plugins: [new workbox.cacheableResponse.CacheableResponsePlugin({
    statuses: [0, 200]
  }), new workbox.expiration.ExpirationPlugin({
    maxAgeSeconds: 60 * 60 * 24 * 365,
    // 1 Year
    maxEntries: 30
  })]
})); // MESSAGE HANDLER

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        // TODO: We'll eventually want this to be user prompted
        // workbox.core.skipWaiting();
        // workbox.core.clientsClaim();
        // TODO: Global notification to indicate incoming reload
        break;

      default:
        console.warn("SW: Invalid message type: ".concat(event.data.type));
    }
  }
});
workbox.precaching.precacheAndRoute([{"revision":"e3ca557deaf9ccfbfb57985b4e447e42","url":"/viewer/0.b64f33800260de29b193.css"},{"revision":"5bd474e145fe51c28b1f2044ce71653b","url":"/viewer/1.b64f33800260de29b193.css"},{"revision":"37c6b1e97da96446a8c1dfb903184661","url":"/viewer/12.b64f33800260de29b193.css"},{"revision":"437cae12248a9ef26456e49b54408929","url":"/viewer/12.bundle.2984165d3050cb4e5079.js"},{"revision":"58e3e76c9b4dbe2ab76a019fb829a1ae","url":"/viewer/13.bundle.3e5e2f4ae66c93deb75a.js"},{"revision":"2625d1e558407a60e7b9a096615ba423","url":"/viewer/14.b64f33800260de29b193.css"},{"revision":"6cc7547e7d6be61df177125cea054286","url":"/viewer/14.bundle.1cf6125c06ea4f1118bb.js"},{"revision":"5b07d34255730b989d166a07021d26f3","url":"/viewer/15.bundle.a6b6b23fccdae51992c5.js"},{"revision":"79c8feb506e92e3cd33a829720e91d2b","url":"/viewer/16.bundle.1535733bbe154b9801db.js"},{"revision":"d91ab7a7cfa7be5e06e572844808c11b","url":"/viewer/17.bundle.bc95065f8ba2bf43a86c.js"},{"revision":"0731d3258f53b657979535b290f4c7a3","url":"/viewer/5.b64f33800260de29b193.css"},{"revision":"260f7b0ecd47a2d3473d498bf9653b59","url":"/viewer/6.b64f33800260de29b193.css"},{"revision":"b2c630a06bf0c045a2c751d4b4cde3fa","url":"/viewer/CallbackPage.bundle.2d4145673c8f2481c46f.js"},{"revision":"6953b35e820145639802b376d48336bc","url":"/viewer/ConnectedStandaloneRouting.bundle.f002d62c6eabfcd8ae69.js"},{"revision":"2f5071227af77d3084727332cba75719","url":"/viewer/ConnectedStandaloneRouting~IHEInvokeImageDisplay~StudyListRouting~ViewerLocalFileData~ViewerRouting.bundle.172f0276ace89850e428.js"},{"revision":"867ec2c4a2d951d4ad4027e0f9f2177b","url":"/viewer/ConnectedStandaloneRouting~IHEInvokeImageDisplay~ViewerLocalFileData~ViewerRouting.bundle.20390ac5d6aa23f33d41.js"},{"revision":"6588ab12bcc028abd9a394481b7e9e50","url":"/viewer/IHEInvokeImageDisplay.bundle.86fc842c87fc3cbe3e8a.js"},{"revision":"a47ea92e1fd326637dcc1b9441564d8e","url":"/viewer/StudyListRouting.bundle.941dbaffb0e233e4c58b.js"},{"revision":"027e43e95134bb3145d41057e02669a7","url":"/viewer/ViewerLocalFileData.bundle.2ffc61b02a58172b9d2a.js"},{"revision":"8dc1b4763c9f92c4d06c9dad15958d02","url":"/viewer/ViewerRouting.bundle.2c20e154c0b3cc130847.js"},{"revision":"ad4a38db8e5ec877a676b33fe3c16b17","url":"/viewer/app-config.js"},{"revision":"cf18697b1e32256a27f97c2db6d2b425","url":"/viewer/app.b64f33800260de29b193.css"},{"revision":"473e74a795f5a95dcfba304960bbcdf8","url":"/viewer/assets/Button_File.svg"},{"revision":"271da60b435c1445580caab72e656818","url":"/viewer/assets/Button_Folder.svg"},{"revision":"cb4f64534cdf8dd88f1d7219d44490db","url":"/viewer/assets/android-chrome-144x144.png"},{"revision":"5cde390de8a619ebe55a669d2ac3effd","url":"/viewer/assets/android-chrome-192x192.png"},{"revision":"e7466a67e90471de05401e53b8fe20be","url":"/viewer/assets/android-chrome-256x256.png"},{"revision":"9bbe9b80156e930d19a4e1725aa9ddae","url":"/viewer/assets/android-chrome-36x36.png"},{"revision":"5698b2ac0c82fe06d84521fc5482df04","url":"/viewer/assets/android-chrome-384x384.png"},{"revision":"56bef3fceec344d9747f8abe9c0bba27","url":"/viewer/assets/android-chrome-48x48.png"},{"revision":"3e8b8a01290992e82c242557417b0596","url":"/viewer/assets/android-chrome-512x512.png"},{"revision":"517925e91e2ce724432d296b687d25e2","url":"/viewer/assets/android-chrome-72x72.png"},{"revision":"4c3289bc690f8519012686888e08da71","url":"/viewer/assets/android-chrome-96x96.png"},{"revision":"cf464289183184df09292f581df0fb4f","url":"/viewer/assets/apple-touch-icon-1024x1024.png"},{"revision":"0857c5282c594e4900e8b31e3bade912","url":"/viewer/assets/apple-touch-icon-114x114.png"},{"revision":"4208f41a28130a67e9392a9dfcee6011","url":"/viewer/assets/apple-touch-icon-120x120.png"},{"revision":"cb4f64534cdf8dd88f1d7219d44490db","url":"/viewer/assets/apple-touch-icon-144x144.png"},{"revision":"977d293982af7e9064ba20806b45cf35","url":"/viewer/assets/apple-touch-icon-152x152.png"},{"revision":"6de91b4d2a30600b410758405cb567b4","url":"/viewer/assets/apple-touch-icon-167x167.png"},{"revision":"87bff140e3773bd7479a620501c4aa5c","url":"/viewer/assets/apple-touch-icon-180x180.png"},{"revision":"647386c34e75f1213830ea9a38913525","url":"/viewer/assets/apple-touch-icon-57x57.png"},{"revision":"0c200fe83953738b330ea431083e7a86","url":"/viewer/assets/apple-touch-icon-60x60.png"},{"revision":"517925e91e2ce724432d296b687d25e2","url":"/viewer/assets/apple-touch-icon-72x72.png"},{"revision":"c9989a807bb18633f6dcf254b5b56124","url":"/viewer/assets/apple-touch-icon-76x76.png"},{"revision":"87bff140e3773bd7479a620501c4aa5c","url":"/viewer/assets/apple-touch-icon-precomposed.png"},{"revision":"87bff140e3773bd7479a620501c4aa5c","url":"/viewer/assets/apple-touch-icon.png"},{"revision":"05fa74ea9c1c0c3931ba96467999081d","url":"/viewer/assets/apple-touch-startup-image-1182x2208.png"},{"revision":"9e2cd03e1e6fd0520eea6846f4278018","url":"/viewer/assets/apple-touch-startup-image-1242x2148.png"},{"revision":"5591e3a1822cbc8439b99c1a40d53425","url":"/viewer/assets/apple-touch-startup-image-1496x2048.png"},{"revision":"337de578c5ca04bd7d2be19d24d83821","url":"/viewer/assets/apple-touch-startup-image-1536x2008.png"},{"revision":"cafb4ab4eafe6ef946bd229a1d88e7de","url":"/viewer/assets/apple-touch-startup-image-320x460.png"},{"revision":"d9bb9e558d729eeac5efb8be8d6111cc","url":"/viewer/assets/apple-touch-startup-image-640x1096.png"},{"revision":"038b5b02bac8b82444bf9a87602ac216","url":"/viewer/assets/apple-touch-startup-image-640x920.png"},{"revision":"2177076eb07b1d64d663d7c03268be00","url":"/viewer/assets/apple-touch-startup-image-748x1024.png"},{"revision":"4fc097443815fe92503584c4bd73c630","url":"/viewer/assets/apple-touch-startup-image-750x1294.png"},{"revision":"2e29914062dce5c5141ab47eea2fc5d9","url":"/viewer/assets/apple-touch-startup-image-768x1004.png"},{"revision":"f692ec286b3a332c17985f4ed38b1076","url":"/viewer/assets/browserconfig.xml"},{"revision":"f3d9a3b647853c45b0e132e4acd0cc4a","url":"/viewer/assets/coast-228x228.png"},{"revision":"533ba1dcac7b716dec835a2fae902860","url":"/viewer/assets/favicon-16x16.png"},{"revision":"783e9edbcc23b8d626357ca7101161e0","url":"/viewer/assets/favicon-32x32.png"},{"revision":"0711f8e60267a1dfc3aaf1e3818e7185","url":"/viewer/assets/favicon.ico"},{"revision":"5df2a5b0cee399ac0bc40af74ba3c2cb","url":"/viewer/assets/firefox_app_128x128.png"},{"revision":"11fd9098c4b07c8a07e1d2a1e309e046","url":"/viewer/assets/firefox_app_512x512.png"},{"revision":"27cddfc922dca3bfa27b4a00fc2f5e36","url":"/viewer/assets/firefox_app_60x60.png"},{"revision":"2017d95fae79dcf34b5a5b52586d4763","url":"/viewer/assets/manifest.webapp"},{"revision":"cb4f64534cdf8dd88f1d7219d44490db","url":"/viewer/assets/mstile-144x144.png"},{"revision":"334895225e16a7777e45d81964725a97","url":"/viewer/assets/mstile-150x150.png"},{"revision":"e295cca4af6ed0365cf7b014d91b0e9d","url":"/viewer/assets/mstile-310x150.png"},{"revision":"cbefa8c42250e5f2443819fe2c69d91e","url":"/viewer/assets/mstile-310x310.png"},{"revision":"aa411a69df2b33a1362fa38d1257fa9d","url":"/viewer/assets/mstile-70x70.png"},{"revision":"5609af4f69e40e33471aee770ea1d802","url":"/viewer/assets/yandex-browser-50x50.png"},{"revision":"cfea70d7ddc8f06f276ea0c85c4b2adf","url":"/viewer/assets/yandex-browser-manifest.json"},{"revision":"0ca44a1b8719e835645ffa804a9d1395","url":"/viewer/es6-shim.min.js"},{"revision":"fc5ca61e7823972f5c8fd43675770bc8","url":"/viewer/google.js"},{"revision":"a180bfbbbf86e330cc0579f568699e7b","url":"/viewer/index.html"},{"revision":"4e41fd55c08031edf19119a1df1a0538","url":"/viewer/init-service-worker.js"},{"revision":"74fc9658b62903be2048c1f82a22b4d4","url":"/viewer/manifest.json"},{"revision":"754d698a7b334af57c00f29723fd9751","url":"/viewer/oidc-client.min.js"},{"revision":"d05a380d50b74e629738ae6f62fb7e78","url":"/viewer/polyfill.min.js"},{"revision":"f528b6861c82ee4415fce0821fd695c1","url":"/viewer/silent-refresh.html"},{"revision":"909161641aeb7de5df0f6a74d0d06b87","url":"/viewer/vendors~ViewerLocalFileData.bundle.ed3790549719d83b5aef.js"},{"revision":"361ab08d090941c8fda475381e5a9974","url":"/viewer/vendors~dicom-microscopy-viewer.bundle.6325bfb48e0959261062.js"}]); // TODO: Cache API
// https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/cache-api
// Store DICOMs?
// Clear Service Worker cache?
// navigator.storage.estimate().then(est => console.log(est)); (2GB?)

/***/ })
/******/ ]);