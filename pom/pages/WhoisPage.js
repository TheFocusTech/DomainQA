import { step } from 'allure-js-commons';

export default class WhoisPage {
    constructor(page) {
        this.page = page;

        this.whoisSearchInput = this.page.getByPlaceholder('Enter a domain to view WHOIS data');
        this.whoisSearchButton = this.page.getByRole('button', { name: 'Search' });
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
}
