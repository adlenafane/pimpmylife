'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('./errors'),
    mongoose = require('mongoose'),
    Infographics = mongoose.model('Infographics');

exports.create = function (req, res, next) {
  // Init Variables
  var infographics = new Infographics(req.body);

  // Add missing user fields
  infographics.lastModification = Date.now();

  // Then save the user
  infographics.save(function(err, infographics) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp(infographics);
  });
};

exports.getList = function (req, res, next) {
  Infographics.find({}, function(err, infographics) {
    if (err) {
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp(infographics);
  });
};

exports.get = function (req, res, next) {
  Infographics.findOne({ _id: req.params.infoid }, function(err, infographics) {
    if (err) {
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp(infographics);
  });
};

exports.update = function (req, res, next) {
  Infographics.findByIdAndUpdate(req.params.infoid, req.body, function (err, infographics) {
      if (err) {
        return res.status(500).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.jsonp(infographics);
    }
  );
};

exports.remove = function (req, res, next) {
  Infographics.findByIdAndRemove(req.params.infoid, function(err) {
    if (err) {
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.status(204).send();
  });
};
