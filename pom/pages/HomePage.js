import { step } from 'allure-js-commons';

export default class HomePage {
    constructor(page) {
        this.page = page;

        this.domainSearchInput = this.page.getByPlaceholder('Search domain').first();
        this.searchButton = this.page.getByRole('button', { name: 'Search' }).nth(1);
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
}
