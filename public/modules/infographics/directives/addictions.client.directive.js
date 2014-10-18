'use strict';

angular.module('infographics').directive('addictions', [
  '$window',
  function($window) {
    return {
      restrict: 'EA',
      scope: {
        isUpdated: '=',
        graphData: '='
      },
      link: function postLink($scope, $element, $attrs) {
        var d3 = $window.d3;
        // Returns a flattened hierarchy containing all leaf nodes under the root.
        function classes(root) {
          var classesArray= [];

          function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classesArray.push({
              packageName: name,
              className: node.name,
              value: node.size,
              placeholder: node.placeholder,
              nodeId: node.nodeId
            });
          }

          recurse(null, root);
          return {children: classesArray};
        }

        var margin = parseInt($attrs.margin) || 0;

        var size = Math.min($element[0].offsetWidth - margin, $window.innerHeight);

        var svg = d3.select($element[0])
          .append('svg')
          .style('width', size)
          .attr('class', 'addictions');

        // Browser onresize event
        $window.onresize = function() {
          $scope.$apply();
        };

        // Watch for resize event
        $scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          $scope.render($scope.graphData);
        });

        $scope.$watch('isUpdated', function(newVals) {
          if (newVals) {
            $scope.isUpdated = false;
            return $scope.render($scope.graphData);
          }
          $scope.isUpdated = false;
        });

        $scope.render = function(data) {
          if(!data) { return; }
          svg.selectAll('*').remove();

          var diameter = size,
            format = d3.format(',d');

          var bubble = d3.layout.pack()
            .sort(null)
            .size([diameter, diameter])
            .padding(1.5);

          var node = svg.selectAll('.node')
            .data(bubble.nodes(classes($scope.graphData))
            .filter(function(d) { return !d.children; }))
          .enter().append('g')
            .attr('class', 'node')
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

          node.append('title')
            .text(function(d) { return d.className + ': ' + format(d.value); });

          node.append('circle')
            .attr('r', function(d) { return d.r; })
            .attr('class', function(d) { return d.packageName.toLowerCase(); });

          node.append('text')
            .attr('dy', '.3em')
            .style('font-size', '1.3em')
            .style('fill', 'white')
            .style('text-anchor', 'middle')
            .text(function(d) { return d.className.substring(0, d.r / 3); });

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
              return Math.sqrt(Math.pow(d.x - coords[0] ,2) + Math.pow(d.y - coords[1] ,2)) - d.r;
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
      }
    };
  }
]);
