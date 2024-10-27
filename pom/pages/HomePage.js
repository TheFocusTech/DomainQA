import { step } from 'allure-js-commons';

export default class HomePage {
    constructor(page) {
        this.page = page;

        this.loginButton = this.page.getByRole('link', { name: 'Log in' });
        this.signupButton = this.page.getByRole('link', { name: 'Join now' });
        this.domainSearchInput = this.page.getByPlaceholder('Search domain').first();
        //this.domainSearchInput = this.page.locator("form[class^='search']").first();
        this.searchButton = this.page.getByRole('button', { name: 'Search' }).nth(1);
        //   this.domainTakenText = this.page.locator('.card-domain-purchase_card-domain-purchase__status__Dj7kC .tag_tag__text__l30BB');
    }

    async clickLogin() {
        await step('Click on "Log in" button.', async () => {
            await this.loginButton.click();
        });
    }

    async clickSignup() {
        await step('Click on "Join now" button.', async () => {
            await this.signupButton.click();
        });
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
