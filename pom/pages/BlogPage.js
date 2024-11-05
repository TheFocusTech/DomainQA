import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export default class BlogPage {
    constructor(page) {
        this.page = page;

        this.mainHeading = this.page.locator('main h1');
        this.searchButton = this.page.getByRole('button', { name: 'Search' }).first();
    }

    async verifyBlogPage(heading, buttons) {
        await step(`Verify that Blog page has "${heading}" heading.`, async () => {
            await expect(this.mainHeading).toContainText(heading);
        });
        for (const button of buttons) {
            await step(`Verify that Blog page has "${button}" button.`, async () => {
                const buttonLocator = this.page.getByRole('button', { name: button });
                await expect(buttonLocator).toBeVisible();
            });
        }
    }
}
