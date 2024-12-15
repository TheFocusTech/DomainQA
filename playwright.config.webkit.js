// @ts-check
import { defineConfig, devices } from '@playwright/test';
import * as os from 'node:os';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['html'],
        ['line'],
        [
            'allure-playwright',
            {
                detail: false,
                suiteTitle: false,
                categories: [
                    {
                        name: 'Outdated tests',
                        messageRegex: '.*FileNotFound.*',
                    },
                ],
                environmentInfo: {
                    os_platform: os.platform(),
                    os_release: os.release(),
                    os_version: os.version(),
                    node_version: process.version,
                },
            },
        ],
    ],
    timeout: 60000,
    /* Save visual comparisons screnshots*/
    snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.URL,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        expect: {
            toHaveScreenshot: {
                maxDiffPixelRatio: 0.1,
                maskColor: '#FF00FF',
            },
        },
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
