'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'perso-viz';
    var applicationModuleVendorDependencies = [
        'd3',
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('d3');'use strict';
ApplicationConfiguration.registerModule('infographics');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
angular.module('d3', []).factory('d3Service', [
  '$document',
  '$q',
  '$rootScope',
  '$window',
  function ($document, $q, $rootScope, $window) {
    var d = $q.defer();
    function onScriptLoad() {
      // Load client in the browser
      $rootScope.$apply(function () {
        d.resolve($window.d3);
      });
    }
    // Create a script tag with d3 as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'http://d3js.org/d3.v3.min.js';
    scriptTag.onreadystatechange = function () {
      if (this.readyState === 'complete')
        onScriptLoad();
    };
    scriptTag.onload = onScriptLoad;
    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);
    return {
      d3: function () {
        return d.promise;
      }
    };
  }
]);'use strict';
angular.module('infographics').config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('list', {
      url: '/infographics',
      templateUrl: 'modules/infographics/views/list.client.view.html'
    }).state('addictions', {
      url: '/infographics/addictions',
      templateUrl: 'modules/infographics/views/addictions.client.view.html'
    }).state('get', {
      url: '/infographics/:id',
      templateUrl: 'modules/infographics/views/infographics.client.view.html'
    });
  }
]);'use strict';
angular.module('infographics').controller('AddictionsController', [
  '$scope',
  function ($scope) {
    $scope.$watch('addictionsData', function () {
      if ($scope.addictionsData) {
        $scope.d3IsUpdated = true;
        $scope.d3AddictionsData = JSON.parse(JSON.stringify($scope.addictionsData));
      }
    }, true);
    $scope.nodeCount = 0;
    $scope.panelPosition = {};
    $scope.addNode = function (addiction) {
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
    $scope.editNode = function (d) {
      var top, left;
      $scope.showPanel = true;
      if (d.top) {
        top = d.top;
      } else {
        top = d.y + 100 + 'px';
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
        if (element.name === d.packageName) {
          parentIndex = index;
        }
      });
      $scope.addictionsData.children[parentIndex].children.map(function (element, index) {
        if (element.name === d.className) {
          currentIndex = index;
        }
      });
      $scope.currentItem = $scope.addictionsData.children[parentIndex].children[currentIndex];
      $scope.currentItem.addiction = $scope.addictionsData.children[parentIndex].name;
      $scope.deleteCurrentNode = function () {
        $scope.addictionsData.children[parentIndex].children.splice(currentIndex, 1);
        $scope.showPanel = false;
      };
      if (!$scope.$$phase) {
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
          placeholder: 'Ex: Bonbons',
          children: [
            {
              name: 'Nutella',
              size: 10,
              nodeId: -1
            },
            {
              name: 'Granola',
              size: 15,
              nodeId: -2
            },
            {
              name: 'Oreo',
              size: 37,
              nodeId: -3
            },
            {
              name: 'Starbucks',
              size: 77,
              nodeId: -4
            }
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
          placeholder: 'Ex: Th\xe9\xe2tre',
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
          placeholder: 'Ex: Au r\xe9veil',
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
]);'use strict';
angular.module('infographics').controller('InfographicsController', [
  '$scope',
  '$http',
  '$stateParams',
  function ($scope, $http, $stateParams) {
    $http.get('/api/infographics/' + $stateParams.id).success(function (data) {
      $scope.infographics = data;
    });
    $scope.d3Data = [
      {
        name: 'Greg',
        score: 98
      },
      {
        name: 'Ari',
        score: 96
      },
      {
        name: 'Q',
        score: 75
      },
      {
        name: 'Loser',
        score: 48
      }
    ];
    $scope.dataUpdated = true;
    $scope.treeData = {
      name: 'Clifford Shanks',
      parents: [
        {
          name: 'James Shanks',
          parents: [
            { name: 'Robert Shanks' },
            { name: 'Elizabeth Shanks' }
          ]
        },
        {
          name: 'Ann Emily Brown',
          parents: [
            { name: 'Henry Brown' },
            { name: 'Sarah Houchins' }
          ]
        }
      ]
    };
    $scope.d3TreeData = JSON.parse(JSON.stringify($scope.treeData));
    $scope.$watch('treeData', function () {
      $scope.dataUpdated = true;
      $scope.d3TreeData = JSON.parse(JSON.stringify($scope.treeData));
    }, true);
    $scope.deleteNode = function (path, position) {
      function index(obj, i) {
        return obj[i];
      }
      path.split('.').reduce(index, $scope.treeData).splice(position, 1);
    };
  }
]);'use strict';
angular.module('infographics').controller('ListController', [
  '$scope',
  '$http',
  function ($scope, $http) {
    $scope.displayAddForm = false;
    $scope.displayEditForm = false;
    $scope.toggleAddForm = function () {
      $scope.displayAddForm = !$scope.displayAddForm;
    };
    $scope.saveInfographics = function () {
      if ($scope.editIndex) {
        var infographics = JSON.parse($scope.editInfographics);
        $http.put('/api/infographics/' + infographics._id, infographics).success(function () {
          $http.get('/api/infographics').success(function (data) {
            $scope.infographics = data;
            $scope.editInfographics = null;
            $scope.displayEditForm = false;
          });
        });
      } else {
        $http.post('/api/infographics', JSON.parse($scope.newInfographics)).success(function (data) {
          $scope.infographics.push(data);
          $scope.newInfographics = null;
          $scope.displayAddForm = false;
        });
      }
    };
    $scope.toggleEditForm = function (index) {
      $scope.displayEditForm = !$scope.displayEditForm;
      $scope.editIndex = index;
      $scope.editInfographics = JSON.stringify($scope.infographics[index]);
    };
    $scope.removeInfographics = function (infographics) {
      $http.delete('/api/infographics/' + infographics._id).success(function () {
        $http.get('/api/infographics').success(function (data) {
          $scope.infographics = data;
        });
      });
    };
    $http.get('/api/infographics').success(function (data) {
      $scope.infographics = data;
    });
  }
]);'use strict';
angular.module('infographics').directive('addictions', [
  '$window',
  'd3Service',
  function ($window, d3Service) {
    return {
      restrict: 'EA',
      scope: {
        isUpdated: '=',
        graphData: '='
      },
      link: function postLink($scope, $element, $attrs) {
        d3Service.d3().then(function (d3) {
          // Returns a flattened hierarchy containing all leaf nodes under the root.
          function classes(root) {
            var classesArray = [];
            function recurse(name, node) {
              if (node.children)
                node.children.forEach(function (child) {
                  recurse(node.name, child);
                });
              else
                classesArray.push({
                  packageName: name,
                  className: node.name,
                  value: node.size,
                  placeholder: node.placeholder,
                  nodeId: node.nodeId
                });
            }
            recurse(null, root);
            return { children: classesArray };
          }
          var margin = parseInt($attrs.margin) || 0;
          var size = Math.min($element[0].offsetWidth - margin, $window.innerHeight);
          var svg = d3.select($element[0]).append('svg').style('width', size).attr('class', 'addictions');
          // Browser onresize event
          $window.onresize = function () {
            $scope.$apply();
          };
          // Watch for resize event
          $scope.$watch(function () {
            return angular.element($window)[0].innerWidth;
          }, function () {
            $scope.render($scope.data);
          });
          $scope.$watch('isUpdated', function (newVals) {
            if (newVals) {
              $scope.isUpdated = false;
              return $scope.render($scope.data);
            }
            $scope.isUpdated = false;
          });
          $scope.render = function (data) {
            svg.selectAll('*').remove();
            var diameter = size, format = d3.format(',d'), color;
            color = function (addiction) {
              var colors = {
                  Alimentation: '#EF4836',
                  Alcool: '#663399',
                  Sommeil: '#913D88',
                  Travail: '#4183D7',
                  Technologie: '#336E7B',
                  Shopping: '#4ECDC4',
                  Culture: '#87D37C',
                  Sorties: '#26A65B',
                  Jeux: '#F89406',
                  Sport: '#F5AB35',
                  Sexe: '#6C7A89',
                  Drogue: '#95A5A6'
                };
              return colors[addiction];
            };
            var bubble = d3.layout.pack().sort(null).size([
                diameter,
                diameter
              ]).padding(1.5);
            var node = svg.selectAll('.node').data(bubble.nodes(classes($scope.graphData)).filter(function (d) {
                return !d.children;
              })).enter().append('g').attr('class', 'node').attr('transform', function (d) {
                return 'translate(' + d.x + ',' + d.y + ')';
              });
            node.append('title').text(function (d) {
              return d.className + ': ' + format(d.value);
            });
            node.append('circle').attr('r', function (d) {
              return d.r;
            }).style('fill', function (d) {
              return color(d.packageName);
            });
            node.append('text').attr('dy', '.3em').style('font-size', '1.3em').style('fill', 'white').style('text-anchor', 'middle').text(function (d) {
              return d.className.substring(0, d.r / 3);
            });
            node.on('click', function (d) {
              d3.event.stopPropagation();
              $scope.$emit('NODE_CLICKED', d);
            });
            svg.on('click', function () {
              var coords = d3.mouse(this);
              var minDistance = Infinity;
              var closestNeighbour = null;
              // Compute distance from clicked point to perimeter of given circle (d)
              var getDistance = function (d) {
                return Math.sqrt(Math.pow(d.x - coords[0], 2) + Math.pow(d.y - coords[1], 2)) - d.r;
              };
              svg.selectAll('circle').each(function (d, i) {
                var curDistance = getDistance(d);
                if (curDistance < minDistance) {
                  minDistance = curDistance;
                  closestNeighbour = d;
                }
              });
              // Append a new node to the package of the closest circle
              $scope.$emit('APPEND_NODE_TO_PACKAGE', closestNeighbour.packageName);
            });
            svg.attr('height', diameter + 'px');
          };
        });
      }
    };
  }
]);'use strict';
angular.module('infographics').directive('barChart', [
  'd3Service',
  '$window',
  function (d3Service, $window) {
    return {
      restrict: 'EA',
      scope: { data: '=' },
      link: function (scope, element, attrs) {
        d3Service.d3().then(function (d3) {
          var margin = parseInt(attrs.margin) || 20, barHeight = parseInt(attrs.barHeight) || 20, barPadding = parseInt(attrs.barPadding) || 5;
          var svg = d3.select(element[0]).append('svg').style('width', '100%');
          // Browser onresize event
          $window.onresize = function () {
            scope.$apply();
          };
          // Watch for resize event
          scope.$watch(function () {
            return angular.element($window)[0].innerWidth;
          }, function () {
            scope.render(scope.data);
          });
          scope.$watch('data', function (newVals) {
            return scope.render(newVals);
          }, true);
          scope.render = function (data) {
            svg.selectAll('*').remove();
            var width = d3.select(element[0]).node().offsetWidth - margin, height = data.length * (barHeight + barPadding), color = d3.scale.category20(), xScale = d3.scale.linear().domain([
                0,
                d3.max(data, function (d) {
                  return d.score;
                })
              ]).range([
                0,
                width
              ]);
            svg.attr('height', height);
            svg.selectAll('rect').data(data).enter().append('rect').attr('height', barHeight).attr('width', 140).attr('x', Math.round(margin / 2)).attr('y', function (d, i) {
              return i * (barHeight + barPadding);
            }).attr('fill', function (d) {
              return color(d.score);
            }).transition().duration(1000).attr('width', function (d) {
              return xScale(d.score);
            });
          };
        });
      }
    };
  }
]);'use strict';
angular.module('infographics').directive('focus', [
  '$timeout',
  function focus($timeout) {
    return {
      link: function ($scope, $element) {
        $timeout(function () {
          $element[0].focus();
        }, 50);
      }
    };
  }
]);'use strict';
angular.module('infographics').directive('treeChart', [
  'd3Service',
  '$window',
  function (d3Service, $window) {
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        dataUpdated: '='
      },
      link: function (scope, element, attrs) {
        d3Service.d3().then(function (d3) {
          var margin = parseInt(attrs.margin) || 200;
          function elbow(d, i) {
            return 'M' + d.source.y + ',' + d.source.x + 'H' + d.target.y + 'V' + d.target.x + (d.target.children ? '' : 'h' + margin);
          }
          var svg = d3.select(element[0]).append('svg').style('width', '100%');
          // Browser onresize event
          $window.onresize = function () {
            scope.$apply();
          };
          // Watch for resize event
          scope.$watch(function () {
            return angular.element($window)[0].innerWidth;
          }, function () {
            scope.render(scope.data);
          });
          scope.$watch('dataUpdated', function (newVals) {
            if (newVals) {
              scope.dataUpdated = false;
              return scope.render(scope.data);
            }
            scope.dataUpdated = false;
          });
          scope.render = function (data) {
            svg.selectAll('*').remove();
            var width = d3.select(element[0]).node().offsetWidth - margin, height = 1000;
            svg.attr('height', height);
            var tree = d3.layout.tree().separation(function (a, b) {
                return a.parent === b.parent ? 1 : 0.5;
              }).children(function (d) {
                return d.parents;
              }).size([
                height / 2,
                width
              ]);
            var nodes = tree.nodes(data);
            var link = svg.selectAll('.link').data(tree.links(nodes)).enter().append('path').attr('class', 'link').attr('d', elbow);
            var node = svg.selectAll('.node').data(nodes).enter().append('g').attr('class', 'node').attr('transform', function (d) {
                return 'translate(' + d.y + ',' + d.x + ')';
              });
            node.append('text').attr('class', 'name').attr('x', 8).attr('y', -6).text(function (d) {
              return d.name;
            });
          };
        });
      }
    };
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);