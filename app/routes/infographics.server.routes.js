'use strict';

/**
 * Module dependencies.
 */

module.exports = function(app) {
  var users = require('../../app/controllers/users');

	// Infographics Routes
	var infographics = require('../../app/controllers/infographics');

	// Create
  app.route('/api/infographics').post(users.requiresLogin, infographics.create);

  // Read
  app.route('/api/infographics').get(users.requiresLogin, infographics.getList);
	app.route('/api/infographics/:infoId').get(users.requiresLogin, infographics.assertIsMine, infographics.get);

  // Update
	app.route('/api/infographics/:infoId').put(users.requiresLogin, infographics.assertIsMine, infographics.update);

  // Delete
	app.route('/api/infographics/:infoId').delete(users.requiresLogin, infographics.assertIsMine, infographics.remove);
};
