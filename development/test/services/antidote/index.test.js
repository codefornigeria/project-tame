'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('antidote service', function() {
  it('registered the antidotes service', () => {
    assert.ok(app.service('antidotes'));
  });
});
