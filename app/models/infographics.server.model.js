'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Infographics Schema
 */
var InfographicsSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: ''
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
