import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';

export default class HelpCenterPage {
    constructor(page) {
        this.page = page;

        this.helpCenterPlaceholder = this.page.getByPlaceholder('Enter the search term');
        this.helpSearchButton = this.page.getByRole('button', { name: 'Search' });
        this.randomString = '';
        this.helpSearchPopup = this.page.locator('div[class*="search-article-result"]');
        this.helpSearchPopupAlert = this.page.locator('h2[class*="alert-base"]');
        this.mainHeading = this.page.locator('main h1');
        this.knowledgeCategoryHeaders = this.page.locator('button[class*="card-folder_card-folder"]');
        this.rescentSearchHeading = this.page.locator('div[class*="search-result"] h3');
        this.clearAllButton = this.helpSearchPopup.getByRole('button', { name: 'Clear all' });
    }

    async fillHelpSearchInput(name) {
        await step('Fill the keyword into the Help Center search input field.', async () => {
            await this.helpCenterPlaceholder.fill(name);
        });
    }

    async waitForPopupToBeVisible() {
        await step('Await search result in popup.', async () => {
            await this.helpSearchPopup.waitFor({ state: 'visible' });
        });
    }

    async clickHelpCenterSearchButton() {
        await step('Click search button.', async () => {
            await this.helpSearchButton.waitFor({ state: 'visible' });
            await this.helpSearchButton.click({ force: true });
        });
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

    async clickKnowledgeHeader(title) {
        await step('Click on Knowledge base category headers', async () => {
            this.knowledgeCategoryHeaders.filter({ hasText: title }).click();
        });
    }

    async clickClearAllButton() {
        await step('Click on "Clear all" button', async () => {
            this.clearAllButton.click();
        });
    }
}
