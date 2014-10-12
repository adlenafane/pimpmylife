'use strict';

angular.module('infographics').controller('AddictionsController',['$scope',
  function($scope) {
    $scope.$watch('addictionsData', function() {
      if($scope.addictionsData) {
        $scope.d3IsUpdated = true;
        $scope.d3AddictionsData = JSON.parse(JSON.stringify($scope.addictionsData));
      }
    }, true);

    $scope.nodeCount = 0;
    $scope.panelPosition = {};

    $scope.addNode = function(addiction) {
      var node = {
        name: '',
        size: 1,
        nodeId: $scope.nodeCount,
        packageName: addiction.name,
        placeholder: addiction.placeholder,
        className: '',
        top: '50%',
        left: '50%'
      };
      addiction.children.push(node);
      $scope.$broadcast('NODE_CLICKED', node);
      $scope.nodeCount++;
    };

    $scope.editNode = function(d) {
      var top, left;
      $scope.showPanel = true;
      if (d.top) {
        top = d.top;
      } else {
        top = (d.y + 100) + 'px';
      }
      if (d.left) {
        left = d.left;
      } else {
        left = d.x + 'px';
      }

      $scope.panelPosition = {
        'top': top,
        'left': left
      };
      var parentIndex, currentIndex = 0;
      $scope.addictionsData.children.map(function (element, index) {
        if (element.name === d.packageName) {parentIndex = index;}
      });

      $scope.addictionsData.children[parentIndex].children.map(function (element, index) {
        if (element.name === d.className) {currentIndex = index;}
      });

      $scope.currentItem = $scope.addictionsData.children[parentIndex].children[currentIndex];
      $scope.currentItem.addiction = $scope.addictionsData.children[parentIndex].name;

      $scope.deleteCurrentNode = function() {
        $scope.addictionsData.children[parentIndex].children.splice(currentIndex, 1);
        $scope.showPanel = false;
      };

      if(!$scope.$$phase) {
        $scope.$apply();
      }
    };

    $scope.$on('NODE_CLICKED', function (event, d) {
      $scope.editNode(d);
    });

    $scope.$on('APPEND_NODE_TO_PACKAGE', function (event, packageName) {
      var addiction = $scope.addictionsData.children.filter(function (addiction) {
        return addiction.name === packageName;
      })[0];

      if (addiction !== undefined) {
        $scope.addNode(addiction);
      }
    });

    $scope.addictionsData = {
      name: 'Addictions',
      children: [
        {
          name: 'Alimentation',
          placeholder: 'Bonbons',
          children: [
            {name: 'Nutella', size: 10, nodeId: -1},
            {name: 'Granola', size: 15, nodeId: -2},
            {name: 'Oreo', size: 37, nodeId: -3},
            {name: 'Starbucks', size: 77, nodeId: -4}
          ]
        },
        {
          name: 'Alcool',
          placeholder: 'Vodka',
          children: []
        },
        {
          name: 'Sommeil',
          placeholder: 'Siestes',
          children: []
        },
        {
          name: 'Travail',
          placeholder: 'Fignolage',
          children: []
        },
        {
          name: 'Technologie',
          placeholder: 'Facebook',
          children: []
        },
        {
          name: 'Shopping',
          placeholder: 'Zara',
          children: []
        },
        {
          name: 'Culture',
          placeholder: 'Théâtre',
          children: []
        },
        {
          name: 'Sorties',
          placeholder: 'Club',
          children: []
        },
        {
          name: 'Jeux',
          placeholder: 'Poker',
          children: []
        },
        {
          name: 'Sport',
          placeholder: 'Footing',
          children: []
        },
        {
          name: 'Sexe',
          placeholder: 'Au réveil',
          children: []
        },
        {
          name: 'Drogue',
          placeholder: 'Cigarettes',
          children: []
        }
      ]
    };
  }
]);
