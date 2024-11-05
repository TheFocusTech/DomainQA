import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';

export default class WhoisPage {
    constructor(page) {
        this.page = page;

        this.whoisSearchInput = this.page.getByPlaceholder('Enter a domain to view WHOIS data');
        this.whoisSearchButton = this.page.getByRole('button', { name: 'Search' });
        this.mainHeading = this.page.locator('main h1');
    }

    async fillWhoisSearchInput(nameDomain) {
        await step('Fill in "domain to view WHOIS data" input field.', async () => {
            await this.whoisSearchInput.fill(nameDomain);
        });
    }

    async clickWhoisSearchButton() {
        await step('Click on "Search" button.', async () => {
            await this.whoisSearchButton.click();
        });
    }

    async verifyWhoisPage(heading, buttons) {
        await step(`Verify that Whois page has "${heading}" heading.`, async () => {
            await expect(this.mainHeading).toContainText(heading);
        });
        for (const button of buttons) {
            await step(`Verify that Whois page has "${button}" button.`, async () => {
                const buttonLocator = this.page.getByRole('button', { name: button });
                await expect(buttonLocator).toBeVisible();
            });
        }
    }
}
