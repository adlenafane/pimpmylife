'use strict';

angular.module('infographics').controller('InfographicsController', ['$scope', '$http', '$stateParams',
  function($scope, $http, $stateParams) {
    $http.get('/api/infographics/' + $stateParams.id)
      .success(function(data) {
        $scope.infographics = data;
      });

    $scope.d3Data = [
      {name: 'Greg', score: 98},
      {name: 'Ari', score: 96},
      {name: 'Q', score: 75},
      {name: 'Loser', score: 48}
    ];

    $scope.dataUpdated = true;

    $scope.treeData = {
      name: 'Clifford Shanks',
      parents: [
        {
          name: 'James Shanks',
          parents: [
            {
              name: 'Robert Shanks'
            },
            {
              name: 'Elizabeth Shanks'
            }
          ]
        },
        {
          name: 'Ann Emily Brown',
          parents: [
            {
              name: 'Henry Brown'
            },
            {
              name: 'Sarah Houchins'
            }
          ]
        }
      ]
    };

    $scope.d3TreeData = JSON.parse(JSON.stringify($scope.treeData));

    $scope.$watch('treeData', function() {
      $scope.dataUpdated = true;
      $scope.d3TreeData = JSON.parse(JSON.stringify($scope.treeData));
    }, true);

    $scope.deleteNode = function(path, position) {
      function index(obj,i) {return obj[i];}
      path.split('.').reduce(index, $scope.treeData).splice(position, 1);
    };
  }
]);
