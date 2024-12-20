import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';

export default class HomePage {
    constructor(page) {
        this.page = page;

        this.domainSearchInput = this.page.getByPlaceholder('Search domain').first();
        this.searchButton = this.page.getByRole('button', { name: 'Search' }).nth(1);
        this.filterButton = this.page.getByLabel('Advanced search').first();
        this.mainHeading = this.page.locator('main h1');
        this.filterApplyBadge = this.page.locator('span[class*="badge-indicator__counter"]');
        this.resultsList = this.page.locator('div[class*="domains-list-cards"]');
        this.listCardButtons = this.page.locator(
            '[class*="domains-list_domains-list-cards"] [class*="button-accent_button-accent__text__"]'
        );
    }

    async fillDomainSearchInput(nameDomain) {
        await step('Fill in "Search domain" input field.', async () => {
            await this.domainSearchInput.fill(nameDomain);
        });
    }

    async clickSearchButton() {
        await step('Click on "Search" button.', async () => {
            await this.searchButton.click();
        });
    }

    async verifyHomePage(heading, buttons) {
        await step(`Verify that Home page has "${heading}" heading.`, async () => {
            await expect(this.mainHeading).toHaveText(heading);
        });
        for (const button of buttons) {
            await step(`Verify that Home page has "${button}" button.`, async () => {
                const buttonLocator = this.page.getByRole('button', { name: button }).nth(1);
                await expect(buttonLocator).toBeVisible();
            });
        }
    }

    async clickFilterButton() {
        await step('Click on "Filter" button.', async () => {
            await this.filterButton.click();
        });
    }

    async getListCardButtonsName() {
        let arrButtonNames = [];
        await step('Get buttons name related to card', async () => {
            await this.resultsList.waitFor();
            const allButtons = await this.listCardButtons.all();
            for (const button of allButtons) {
                const name = await button.textContent();
                arrButtonNames.push(name);
            }
        });
        return arrButtonNames;
    }
}
