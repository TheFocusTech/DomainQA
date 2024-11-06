import { step } from 'allure-js-commons';
import { getRandomCharacters } from '../../helpers/utils';
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
    }

    async fillSearchInput() {
        await step('Fill the Help Center input.', async () => {
            this.randomString = await getRandomCharacters(10);
            await this.helpCenterPlaceholder.waitFor({ state: 'visible' });
            await this.helpCenterPlaceholder.fill(this.randomString);
        });
        return this.randomString;
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

    async fillSearchTermPlaceholder(name) {
        await step('Fill in "Enter the search term" input field.', async () => {
            await this.helpCenterPlaceholder.fill(name);
        });
    }
}