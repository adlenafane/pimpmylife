'use strict';

/**
 * Module dependencies.
 */

module.exports = function(app) {
	// Infographics Routes
	var infographics = require('../../app/controllers/infographics');

	// Create
  app.route('/api/infographics').post(infographics.create);

  // Read
  app.route('/api/infographics').get(infographics.getList);
	app.route('/api/infographics/:infoid').get(infographics.get);

  // Update
	app.route('/api/infographics/:infoid').put(infographics.update);

  // Delete
	app.route('/api/infographics/:infoid').delete(infographics.remove);
};
