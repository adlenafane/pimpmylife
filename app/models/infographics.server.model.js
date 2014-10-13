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
  displayName: {
    type: String,
    trim: true,
    default: 'Name not defined'
  },
  lastModification: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String
  },
  children: {
    type: Array,
    default: []
  }
});

mongoose.model('Infographics', InfographicsSchema);
