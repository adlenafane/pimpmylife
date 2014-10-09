'use strict';

angular.module('infographics').directive('addictions', [
	'$window',
	'd3Service',
	function($window, d3Service) {
		return {
			restrict: 'EA',
			link: function postLink(scope, element, attrs) {
				d3Service.d3().then(function(d3) {
					console.log('d3', d3);
				});
			}
		};
	}
]);