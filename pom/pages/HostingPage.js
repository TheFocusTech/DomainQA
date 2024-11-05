import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export default class HostingPage {
    constructor(page) {
        this.page = page;

        this.mainHeading = this.page.locator('main h1');
        this.alertTitle = this.page.locator('main h2');
        this.alertDescription = this.page.locator('main p[class*="description"]');
        this.trancferBtn = this.page.getByRole('button', { name: 'Get new hosting' });
    }

    async verifyHostingPage(heading, title, description, buttons) {
        await step(`Verify that Hosting page has "${heading}" heading.`, async () => {
            await expect(this.mainHeading).toContainText(heading);
        });
        await step(`Verify that Hosting page has "${heading}" text.`, async () => {
            await expect(this.alertTitle).toHaveText(title);
        });
        await step(`Verify that Hosting page has "${heading}" text.`, async () => {
            await expect(this.alertDescription).toHaveText(description);
        });
        for (const button of buttons) {
            await step(`Verify that Hosting page has "${button}" button.`, async () => {
                const buttonLocator = this.page.getByRole('button', { name: button });
                await expect(buttonLocator).toBeVisible();
            });
        }
    }
}
