// Test file ensure axios instance is configured correctly and has the correct header.

describe('api axios instance', () => {

    test('has the correct base URL from environment variable', () => {
        // ARRANGE — set env var first, then load the module fresh
        process.env.REACT_APP_API_BASE_URL = 'http://localhost:8080';

        jest.isolateModules(() => {
            // ACT — import AFTER env var is set
            const freshApi = require('../../services/api').default;

            // ASSERT
            expect(freshApi.defaults.baseURL).toBe('http://localhost:8080');
        });
    });

    test('has correct default Content-Type header', () => {
        // ACT
        const freshApi = require('../../services/api').default;

        // ASSERT
        expect(freshApi.defaults.headers['Content-Type']).toBe('application/json');
    });

});