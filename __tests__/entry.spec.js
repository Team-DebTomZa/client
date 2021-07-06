// const entry = require('../entry');

const { beforeEach } = require('@jest/globals');

global.fetch = require('jest-fetch-mock');

beforeEach(() => { fetch.resetMocks() })