var callback;
export default class templating {
	start(_callback){
		callback = _callback;
		startTemplating();
	}
}

/**
* Carga el view del cual se hereda (template), y crea
* una lista con los elementos tipo section que
* seran inyectados en el template
*
* @param DOM Element
*/
function template(extending){
	var extendedView = extending.attr("templating-extends");
	var sections = extending.find("[templating-section]");
	extending.load("views/"+extendedView+".html", function(){
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
function handleYields(template, sections){
	var yields = template.find("[templating-yield]");
	yields.each(function(index){
		var yieldName = this.getAttribute("templating-yield");
		var that = this;
		sections.each(function(index){
			var sectionName = this.getAttribute("templating-section");
			if(yieldName === sectionName){
				that.innerHTML = this.innerHTML;
			}
		});
	});
	
	if(typeof callback !== 'undefined'){
		$("img").load(function(){
			callback();
		});
	}
}

/**
* Revisa que el view solo extienda de un parent (template)
* y devuelve error en caso de ser lo contrario
* 
* Esta funcion es la que inicial las funciones de templating
*/
function startTemplating(){
	var extending = $("[templating-extends]");
	 switch(extending.length){
	 	case 1:
	 		template(extending);
	 		break;

	 	case 0:
	 		break;

	 	default:
	 		console.error("Imposible extender de dos views, maximo un extend");
	 }
}
startTemplating();