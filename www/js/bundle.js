/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _transitions = __webpack_require__(1);

	var _transitions2 = _interopRequireDefault(_transitions);

	var _templating = __webpack_require__(2);

	var _templating2 = _interopRequireDefault(_templating);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.transition = transition;
	var viewChain = ['main'];
	// Function que agrega listener a elementos que cambiaran de views
	function addListeners() {
	    $("[link-to-view]").click(function (e) {
	        e.preventDefault();
	        var viewName = $(this).attr('link-to-view');
	        transition(viewName);
	    });
	    document.addEventListener("backbutton", backKeyDown, true);
	}

	//Listener para el boton back del telefono
	function backKeyDown() {
	    viewCount = viewChain.length;
	    viewName = viewChain[viewCount - 2];
	    if (viewCount > 1) {
	        viewChain.pop();
	        transition(viewName, "right", true);
	    } else navigator.app.exitApp();
	}

	/**
	* Funcion que crea la transicion entre views. 
	* Para hacer link a view, agregar el atributo 'link-to-view' con el 
	* nombre del view sin la extension .html
	*
	* @param String con el nombre del view
	* @param String direccion de la animacion ('left', 'right', 'up', 'down') default 'left'
	* @param Boolean esta llendo atras ? default false
	*/
	function transition(viewName, direction, goBack) {
	    direction = direction || "left";
	    goBack = goBack || false;
	    var options = {
	        "href": null,
	        "direction": direction,
	        "duration": 500, // in milliseconds (ms), default 400
	        "iosdelay": -1, // ms to wait for the iOS webview to update before animation kicks in, default 60
	        "androiddelay": -1, // same as above but for Android, default 70
	        "winphonedelay": -1 };
	    // same as above but for Windows Phone, default 200
	    window.plugins.nativepagetransitions.slide(options, function () {
	        var wrapper = $("#index");
	        wrapper.load("views/" + viewName + ".html", function () {
	            setTimeout(function () {
	                window.plugins.nativepagetransitions.executePendingTransition();
	                addListeners();
	                if (viewName !== viewChain[0] && !goBack) viewChain.push(viewName);
	            }, 300);
	        });
	    });
	}

	addListeners();

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	/**
	* Carga el view del cual se hereda (template), y crea
	* una lista con los elementos tipo section que
	* seran inyectados en el template
	*
	* @param DOM Element
	*/
	function template(extending) {
		var extendedView = extending.attr("templating-extends");
		var sections = extending.find("[templating-section]");
		extending.load("views/" + extendedView + ".html", function () {
			handleYields($(this), sections);
		});
	}

	/**
	* Inserta los elementos 'section' del child a los elementos
	* 'yield' del parent (template)
	*
	* @param HTML de view (template)
	* @param DOM elements 'sections'
	*/
	function handleYields(template, sections) {
		var yields = template.find("[templating-yield]");
		yields.each(function (index) {
			var yieldName = this.getAttribute("templating-yield");
			var that = this;
			sections.each(function (index) {
				var sectionName = this.getAttribute("templating-section");
				if (yieldName === sectionName) {
					that.innerHTML = this.innerHTML;
				}
			});
		});
	}

	/**
	* Revisa que el view solo extienda de un parent (template)
	* y devuelve error en caso de ser lo contrario
	* 
	* Esta funcion es la que inicial las funciones de templating
	*/
	function startTemplating() {
		var extending = $("[templating-extends]");
		switch (extending.length) {
			case 1:
				template(extending);
				break;

			case 0:
				break;

			default:
				console.log("Imposible extender de dos views, maximo un extend");
		}
	}
	startTemplating();

/***/ }
/******/ ]);