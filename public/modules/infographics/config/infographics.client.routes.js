'use strict';

angular.module('infographics').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
    .state('list', {
			url: '/infographics/list',
			templateUrl: 'modules/infographics/views/list.client.view.html'
		})
	}
]);