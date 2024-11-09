import { step } from 'allure-js-commons';

export default class HomePage {
    constructor(page) {
        this.page = page;

        this.domainSearchInput = this.page.getByPlaceholder('Search domain').first();
        this.searchButton = this.page.getByRole('button', { name: 'Search' }).nth(1);
        this.filterButton = this.page.getByLabel('Advanced search').first();
        this.filterApplyBadge = this.page.locator('span[class*="badge-indicator__counter"]');
        this.resultsList = this.page.locator('div[class*="domains-list-cards"]');
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

    async clickFilterButton() {
        await step('Click on "Filter" button.', async () => {
            await this.filterButton.click();
        });
    }
}
