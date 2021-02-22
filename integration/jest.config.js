module.exports = {
    preset: 'jest-puppeteer',
    testRegex: './*\\.test\\.js$',
    testTimeout: 90000,
    setupFilesAfterEnv: ['./setupTests.js']
};
