// @ts-check
import { test, expect } from '@playwright/test';
import { tag, severity, description, link, step, tms, issue } from 'allure-js-commons';

test('has title', async ({ page }) => {
    await tag('Title');
    await severity('critical');
    await description('First test');
    await link('/link1');
    await link('/link2');

    await step('Go to "https://playwright.dev/".', async () => {
        await page.goto('https://playwright.dev/');
    });

    // Expect a title "to contain" a substring.
    await step('Verify the title contains a substring "Playwright".', async () => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

test('get started link', async ({ page }) => {
    await tag('Installation');
    await severity('minor');
    await description('Second test');
    await link('link1');
    await issue('link2');
    await tms('link3');

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
