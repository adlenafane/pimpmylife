'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    users = require('./users'),
    errorHandler = require('./errors'),
    mongoose = require('mongoose'),
    Infographics = mongoose.model('Infographics');

exports.create = function (req, res, next) {
  // Init Variables
  var infographics = new Infographics(req.body);

  // Add missing user fields
  infographics.lastModification = Date.now();
  infographics.userId = req.user._id;

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
  Infographics.find({ userId: req.user._id }, function(err, infographics) {
    if (err) {
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp(infographics);
  });
};

exports.get = function (req, res, next) {
  Infographics.findOne({ _id: req.params.infoId }, function(err, infographics) {
    if (err) {
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.jsonp(infographics);
  });
};

exports.update = function (req, res, next) {
  var infographics = new Infographics(req.body);
  // Add missing user fields
  infographics.lastModification = Date.now();
  infographics.userId = req.user._id;
  delete infographics._id;

  Infographics.findByIdAndUpdate(req.params.infoId, infographics.toObject(), function (err, infographics) {
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
  Infographics.findByIdAndRemove(req.params.infoId, function(err) {
    if (err) {
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.status(204).send();
  });
};

exports.assertIsMine = function (req, res, next) {
  Infographics.findOne({ _id: req.params.infoId}, function (err, infographics) {
    if (err) {
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    // Added +'' to ensure string comparison
    if (infographics.userId !== req.user._id+'') {
      return res.status(403).send({
        message: 'User is not authorized'
      });
    }
    next();
  });
};
