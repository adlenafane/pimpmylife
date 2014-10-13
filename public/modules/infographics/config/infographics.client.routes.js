'use strict';

angular.module('infographics').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
    .state('list', {
			url: '/infographics',
			templateUrl: 'modules/infographics/views/list.client.view.html'
		})
    .state('addictions', {
			url: '/infographics/addictions/:id',
			templateUrl: 'modules/infographics/views/addictions.client.view.html'
		})
    .state('addictionsNew', {
			url: '/infographics/addictions',
			templateUrl: 'modules/infographics/views/addictions.client.view.html'
		})
    .state('get', {
			url: '/infographics/:id',
			templateUrl: 'modules/infographics/views/infographics.client.view.html'
		});
	}
]);