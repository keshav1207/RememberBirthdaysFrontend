// Runs automatically before every test file.
// Imports jest-dom which adds extra DOM matchers to Jest
// e.g. toBeInTheDocument(), toHaveValue(), toBeDisabled()
// This means these matchers are available in all test files without needing to import them individually.
import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder — not included in Jest's jsdom environment by default
// Required by react-router-dom v7
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;