'use strict';

angular.module('infographics').controller('InfographicsController', ['$scope', '$http', '$stateParams',
  function($scope, $http, $stateParams) {
    $http.get('/api/infographics/' + $stateParams.id)
      .success(function(data) {
        $scope.infographics = data;
      });
  }
]);
