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
        $scope.editInfographics = JSON.parse($scope.editInfographics);
        $scope.infographics[$scope.editIndex] = $scope.editInfographics;

        $scope.displayEditForm = !$scope.displayEditForm;
        $scope.editInfographics = null;
        $scope.editIndex = null;
        $scope.displayEditForm = false;
      }

      else {
        $scope.newInfographics = JSON.parse($scope.newInfographics);
        $scope.infographics.push($scope.newInfographics);
        $scope.newInfographics = null;
        $scope.displayAddForm = false;
      }
    };

    $scope.toggleEditForm = function(index) {
      $scope.displayEditForm = !$scope.displayEditForm;
      $scope.editIndex = index;
      $scope.editInfographics = JSON.stringify($scope.infographics[index]);
    };

    $scope.removeInfographics = function(index) {
      $scope.infographics.splice(index, 1);
    };

    $scope.infographics = [
      {
        name: "Info 1",
        details: "complex details"
      },
      {
        name: "Info 2",
        details: "complex details"
      },
      {
        name: "Info 3",
        details: "complex details"
      }
    ];
  }
]);
