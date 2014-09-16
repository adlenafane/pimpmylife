'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Infographics Schema
 */
var InfographicsSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in a name']
	},
  lastModification: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String
  }
});

mongoose.model('Infographics', InfographicsSchema);
