'use strict';

angular.module('infographics').controller('AddictionsController',['$scope', '$window',
  function($scope, $window) {
    $scope.$watch('addictionsData', function() {
      if($scope.addictionsData) {
        $scope.d3IsUpdated = true;
        $scope.d3AddictionsData = JSON.parse(JSON.stringify($scope.addictionsData));
      }
    }, true);

    $scope.nodeCount = 0;
    $scope.panelPosition = {};

    $scope.addNode = function(addiction) {
      addiction.children.push({name: '', size: 0, nodeId: $scope.nodeCount});
      $scope.nodeCount++;
    };

    $scope.editNode = function(d) {
      $scope.showPanel = true;
      $scope.panelPosition = {
        'top': d.y + 'px',
        'left': d.x + 'px'
      };
      var parentIndex, currentIndex = 0;
      $scope.addictionsData.children.map(function (element, index) {
        if (element.name === d.packageName) {parentIndex = index;}
      });

      $scope.addictionsData.children[parentIndex].children.map(function (element, index) {
        if (element.name === d.className) {currentIndex = index;}
      });

      $scope.currentItem = $scope.addictionsData.children[parentIndex].children[currentIndex];

      $scope.deleteCurrentNode = function() {
        $scope.addictionsData.children[parentIndex].children.splice(currentIndex, 1);
        $scope.showPanel = false;
      };

      $scope.$apply();
    };

    $scope.$on('NODE_CLICKED', function (event, d) {
      $scope.editNode(d);
    });

    $scope.addictionsData = {
      name: 'Addictions',
      children: [
        {
          name: 'Alimentation',
          children: [
            {name: 'Nutella', size: 10, nodeId: -1},
            {name: 'Granola', size: 15, nodeId: -2},
            {name: 'Oreo', size: 37, nodeId: -3},
            {name: 'Starbucks', size: 77, nodeId: -4}
          ]
        },
        {
          name: 'Alcool',
          children: []
        },
        {
          name: 'Sommeil',
          children: []
        },
        {
          name: 'Travail',
          children: []
        },
        {
          name: 'Technologie',
          children: []
        },
        {
          name: 'Shopping',
          children: []
        },
        {
          name: 'Culture',
          children: []
        },
        {
          name: 'Sorties',
          children: []
        },
        {
          name: 'Jeux',
          children: []
        },
        {
          name: 'Sport',
          children: []
        },
        {
          name: 'Sexe',
          children: []
        },
        {
          name: 'Drogue',
          children: []
        }
      ]
    };
  }
]);
