import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export default class BlogPage {
    constructor(page) {
        this.page = page;

        this.mainHeading = this.page.locator('main h1');
        this.blogPlaceholder = this.page.getByPlaceholder('Enter the search term');
        this.blogSearchPopup = this.page.locator('div[class*="search-result"]');
        this.blogSearchPopupList = this.page.locator('li[class*="search-articles-list__item"]');
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

    async fillBlogSearchInput(name) {
        await step('Fill the keyword into the Blog search input field.', async () => {
            await this.blogPlaceholder.fill(name);
        });
    }

    async waitForBlogSearchPopup() {
        await step('Wait search result in popup.', async () => {
            await this.blogSearchPopup.waitFor({ state: 'visible' });
        });
    }
}
