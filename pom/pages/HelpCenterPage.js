import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export default class HelpCenterPage {
    constructor(page) {
        this.page = page;

        this.mainHeading = this.page.locator('main h1');
    }

    async verifyHelpCenterPage(heading, buttons) {
        await step(`Verify that Help Center page has "${heading}" heading.`, async () => {
            await expect(this.mainHeading).toHaveText(heading);
        });
        for (const button of buttons) {
            await step(`Verify that Help Center page has "${button}" button.`, async () => {
                const buttonLocator = this.page.getByRole('button', { name: button, exact: true });
                const linkLocator = this.page.getByRole('link', { name: button, exect: true });
                await expect(buttonLocator.or(linkLocator).first()).toBeVisible();
            });
        }
    }
}
