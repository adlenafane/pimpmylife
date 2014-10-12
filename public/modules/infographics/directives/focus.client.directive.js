'use strict';

angular.module('infographics').directive('focus', [
  '$timeout',
  function focus($timeout) {
    return {
      link: function($scope, $element) {
        $timeout(function() {
          $element[0].focus();
        }, 50);
      }
    };
  }
]);