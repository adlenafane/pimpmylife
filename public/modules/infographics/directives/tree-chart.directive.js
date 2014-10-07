'use strict';

angular.module('infographics')

.directive('treeChart', [
  'd3Service',
  '$window',
  function(d3Service, $window) {
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        dataUpdated: '='
      },
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var margin = parseInt(attrs.margin) || 200;

          function elbow(d, i) {
            return 'M' + d.source.y + ',' + d.source.x + 'H' + d.target.y + 'V' + d.target.x + (d.target.children ? '' : 'h' + margin);
          }

          var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%');

          // Browser onresize event
          $window.onresize = function() {
            scope.$apply();
          };

          // Watch for resize event
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });

          scope.$watch('dataUpdated', function(newVals) {
            if (newVals) {
              scope.dataUpdated = false;
              return scope.render(scope.data);
            }
            scope.dataUpdated = false;
          });

          scope.render = function(data) {
            svg.selectAll('*').remove();

            var width = d3.select(element[0]).node().offsetWidth - margin,
              height = 1000;

            svg.attr('height', height);

            var tree = d3.layout.tree()
              .separation(function(a, b) { return a.parent === b.parent ? 1 : 0.5; })
              .children(function(d) { return d.parents; })
              .size([height/2, width]);

            var nodes = tree.nodes(data);

            var link = svg.selectAll('.link')
              .data(tree.links(nodes))
              .enter().append('path')
              .attr('class', 'link')
              .attr('d', elbow);

            var node = svg.selectAll('.node')
              .data(nodes)
              .enter().append('g')
              .attr('class', 'node')
              .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

            node.append('text')
              .attr('class', 'name')
              .attr('x', 8)
              .attr('y', -6)
              .text(function(d) { return d.name; });
          };
        });
      }
    };
  }
]);