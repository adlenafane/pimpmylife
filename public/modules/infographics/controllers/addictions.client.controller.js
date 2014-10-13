'use strict';

angular.module('infographics').controller('AddictionsController', [
  '$scope',
  '$http',
  '$state',
  '$stateParams',
  'Authentication',
  function($scope, $http, $state, $stateParams, Authentication) {
    $scope.authentication = Authentication;
    if (!$scope.authentication.user) $state.go('signin');

    /** Server communication **/
    if ($stateParams.id) {
      $http.get('/api/infographics/' + $stateParams.id)
        .success(function(data) {
          $scope.addictionsData = data;
        });
    } else {
      $scope.addictionsData = {
        name: 'Addictions',
        children: [
          {
            name: 'Alimentation',
            placeholder: 'Ex: Bonbons',
            children: [
              {name: 'Nutella', size: 10, nodeId: -1},
              {name: 'Granola', size: 15, nodeId: -2},
              {name: 'Oreo', size: 37, nodeId: -3},
              {name: 'Starbucks', size: 77, nodeId: -4}
            ]
          },
          {
            name: 'Alcool',
            placeholder: 'Ex: Vodka',
            children: []
          },
          {
            name: 'Sommeil',
            placeholder: 'Ex: Siestes',
            children: []
          },
          {
            name: 'Travail',
            placeholder: 'Ex: Fignolage',
            children: []
          },
          {
            name: 'Technologie',
            placeholder: 'Ex: Facebook',
            children: []
          },
          {
            name: 'Shopping',
            placeholder: 'Ex: Zara',
            children: []
          },
          {
            name: 'Culture',
            placeholder: 'Ex: Théâtre',
            children: []
          },
          {
            name: 'Sorties',
            placeholder: 'Ex: Club',
            children: []
          },
          {
            name: 'Jeux',
            placeholder: 'Ex: Poker',
            children: []
          },
          {
            name: 'Sport',
            placeholder: 'Ex: Footing',
            children: []
          },
          {
            name: 'Sexe',
            placeholder: 'Ex: Au réveil',
            children: []
          },
          {
            name: 'Drogue',
            placeholder: 'Ex: Cigarettes',
            children: []
          }
        ]
      };
    }

    $scope.saveInfographics = function() {
      /** Update existing infographics **/
      if ($scope.addictionsData._id) {
        $http.put('/api/infographics/' + $scope.addictionsData._id, $scope.addictionsData)
          .success(function () {
            $state.go('list');
          })
          .error(function(data) {
            $scope.error = 'Error while saving. ' + data
          });
      } else {
        $http.post('/api/infographics', $scope.addictionsData)
          .success(function(data) {
            $state.go('list');
          })
          .error(function(data) {
            $scope.error = 'Error while saving. ' + data
          });
      }
    };

    /** D3.js Communication **/
    $scope.nodeCount = 0;
    $scope.panelPosition = {};

    $scope.$watch('addictionsData', function() {
      if($scope.addictionsData) {
        $scope.d3IsUpdated = true;
        $scope.d3AddictionsData = JSON.parse(JSON.stringify($scope.addictionsData));
      }
    }, true);

    $scope.addNode = function(addiction) {
      var node = {
        name: '',
        size: 1,
        nodeId: $scope.nodeCount,
        packageName: addiction.name,
        placeholder: addiction.placeholder,
        className: ''
      };
      addiction.children.push(node);
      $scope.$broadcast('NODE_CLICKED', node);
      $scope.nodeCount++;
    };

    $scope.editNode = function(d) {
      var top = '20%',
        left = '50%';
      $scope.showPanel = true;

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
  }
]);
