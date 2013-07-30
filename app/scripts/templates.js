/****************************************/
/**         TEMPLATES MODULE           **/
/****************************************/

var templatesMod = angular.module('TemplatesMod', []);

templatesMod.factory('TemplateFact', function () {
	/*
	 *
	 *  FORMAT: { name, path, templateUrl }
	 *	Can look up by path (useful for route based templating, similar to ui-router's ui-view)
	 *	or by name (if you are changing templates within a given template and not changing the route)
	 *
	 */

	/** You must add templates to the array for this to work, asshole **/
	var templates = [

	];


	/* Public Functions
	*********************/
	var getByName = function (name) {
		var template = templates.filter(function(template) {
			return template.name === name;
		});
		if(template) return template.url;
		return '';
	};

	var getByPath = function (path) {
		var template = templates.filter(function (template) {
			return template.path === name;
		});
		if(template) return template.url;
		return '';
	};

	return {
		getByName: getByName,
		getByPath: getByPath
	}

});