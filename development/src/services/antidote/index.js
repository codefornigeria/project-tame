'use strict';

const service = require('feathers-mongoose');
const antidote = require('./antidote-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: antidote,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/antidotes', service(options));

  // Get our initialize service to that we can bind hooks
  const antidoteService = app.service('/antidotes');

  // Set up our before hooks
  antidoteService.before(hooks.before);

  // Set up our after hooks
  antidoteService.after(hooks.after);
};
