'use strict';

angular.module('infographics').controller('ListController', ['$scope', '$http',
  function($scope, $http) {
    $scope.displayAddForm = false;
    $scope.displayEditForm = false;

    $scope.toggleAddForm = function() {
      $scope.displayAddForm = !$scope.displayAddForm;
    };

    $scope.saveInfographics = function() {
      if ($scope.editIndex) {
        var infographics = JSON.parse($scope.editInfographics);
        $http.put('/api/infographics/' + infographics._id, infographics)
          .success(function() {
            $http.get('/api/infographics')
              .success(function(data) {
                $scope.infographics = data;
                $scope.editInfographics = null;
                $scope.displayEditForm = false;
              });
          });
      }

      else {
        $http.post('/api/infographics', JSON.parse($scope.newInfographics))
          .success(function(data) {
            $scope.infographics.push(data);
            $scope.newInfographics = null;
            $scope.displayAddForm = false;
          });
      }
    };

    $scope.toggleEditForm = function(index) {
      $scope.displayEditForm = !$scope.displayEditForm;
      $scope.editIndex = index;
      $scope.editInfographics = JSON.stringify($scope.infographics[index]);
    };

    $scope.removeInfographics = function(infographics) {
      $http.delete('/api/infographics/' + infographics._id)
        .success(function() {
          $http.get('/api/infographics')
            .success(function(data) {
              $scope.infographics = data;
            });
        });
    };

    $http.get('/api/infographics')
      .success(function(data) {
        $scope.infographics = data;
      });
  }
]);
