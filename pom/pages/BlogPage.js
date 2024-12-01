import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export default class BlogPage {
    constructor(page) {
        this.page = page;

        this.mainHeading = this.page.locator('main h1');
        this.blogSearchInput = this.page.getByPlaceholder('Enter the search term');
        this.blogSearchPopup = this.page.locator('div[class*="search-result"]');
        this.blogSearchPopupList = this.page.locator('li[class*="search-articles-list__item"]');
        this.articlesList = this.page.locator('article h3');
        this.blogSearchButton = this.page.getByRole('button', { name: 'Search' });
        this.rescentSearchHeading = this.page.locator('div[class*="search-result"] h3');
        this.searchResultMessage = this.page.locator('h2:has-text("results for")');
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
        await step('Fill in the Blog search input field.', async () => {
            await this.blogSearchInput.fill(name);
        });
    }

    async waitForBlogSearchPopup() {
        await step('Wait for the search result in the popup.', async () => {
            await this.blogSearchPopup.waitFor({ state: 'visible' });
        });
    }

    async clickRandomArticle() {
        const articles = await this.articlesList.all();
        const randomArticle = articles[Math.floor(Math.random() * articles.length)];
        randomArticle.click();
    }

    async clickSearchButton() {
        await step('Click on Search button', async () => {
            await this.blogSearchButton.first().click({ force: true });
        });
    }
}
