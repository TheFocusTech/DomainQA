import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export default class SslCertificatesPage {
    constructor(page) {
        this.page = page;

        this.mainHeading = this.page.locator('main h1');
    }

    async verifySslCertificatesPage(heading, buttons) {
        await step(`Verify that SSL Certificates page has "${heading}" heading.`, async () => {
            await expect(this.mainHeading).toContainText(heading);
        });
        for (const button of buttons) {
            await step(`Verify that SSL Certificates page has "${button}" button.`, async () => {
                const buttonLocator = this.page.getByRole('link', { name: button });
                await expect(buttonLocator).toBeVisible();
            });
        }
    }
}
