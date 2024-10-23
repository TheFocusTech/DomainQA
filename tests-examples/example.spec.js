// @ts-check
import { test, expect } from '@playwright/test';
import { tags, epic, feature, severity, description, step, tms, issue } from 'allure-js-commons';

test('TC_00_01_Has title', async ({ page }) => {
    await tags('Title (keywords)');
    await severity('critical');
    await description('Test description');
    await issue('/link1', 'Name QASE link ');
    await tms('/link2', 'Name ATC link');
    await epic('Name epic1 (section)');
    await feature('Name feature1');

    await step('Go to "https://playwright.dev/".', async () => {
        await page.goto('https://playwright.dev/');
    });

    // Expect a title "to contain" a substring.
    await step('Verify the title contains a substring "Playwright".', async () => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

test('TC_00_02_Get started link', async ({ page }) => {
    await tags('Link', 'Keywords');
    await severity('minor');
    await description('Test description');
    await issue('/link1', 'Name QASE link ');
    await tms('/link2', 'Name ATC link');
    await epic('Name epic1 (section)');
    await feature('Name feature2');

    await step('Go to "https://playwright.dev/".', async () => {
        await page.goto('https://playwright.dev/');
    });

    // Click the get started link.
    await step('Click the get started link', async () => {
        await page.getByRole('link', { name: 'Get started' }).click();
    });

    // Expects page to have a heading with the name of Installation.
    await step('Verify the page has a heading with the name of Installation.', async () => {
        await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    });
});
