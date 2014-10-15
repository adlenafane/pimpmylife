'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('infographics').factory('Infographics', ['$resource',
  function($resource) {
    return $resource('/api/infographics/:infographicsId', {
      infographicsId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);