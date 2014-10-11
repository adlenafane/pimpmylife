'use strict';

angular.module('infographics').controller('AddictionsController',['$scope',
  function($scope) {
    $scope.$watch('addictionsData', function() {
      if($scope.addictionsData) {
        $scope.d3IsUpdated = true;
        $scope.d3AddictionsData = JSON.parse(JSON.stringify($scope.addictionsData));
      }
    }, true);

    $scope.addictionsData = {
      'name': 'Addictions',
      'children': [
        {
          'name': 'Alimentation',
          'children': [
            {'name': 'Nutella', 'size': 10},
            {'name': 'Granola', 'size': 15},
            {'name': 'Oreo', 'size': 37},
            {'name': 'Starbucks', 'size': 77}
          ]
        },
        {
          'name': 'Alcool',
          'children': []
        },
        {
          'name': 'Sommeil',
          'children': []
        },
        {
          'name': 'Travail',
          'children': []
        },
        {
          'name': 'Technologie',
          'children': []
        },
        {
          'name': 'Shopping',
          'children': []
        },
        {
          'name': 'Culture',
          'children': []
        },
        {
          'name': 'Sorties',
          'children': []
        },
        {
          'name': 'Jeux',
          'children': []
        },
        {
          'name': 'Sport',
          'children': []
        },
        {
          'name': 'Sexe',
          'children': []
        },
        {
          'name': 'Drogue',
          'children': []
        }
      ]
    };
  }
]);
