import { step } from 'allure-js-commons';

export default class HeaderComponent {
    constructor(page) {
        this.page = page;

        this.myProfileButton = this.page.getByRole('button', { name: 'My profile' });
        this.accountSettingsLink = this.page.getByRole('link', { name: 'Account settings' });
        this.loginButton = this.page.getByRole('link', { name: 'Log in' });
        this.signupButton = this.page.getByRole('link', { name: 'Join now' });
        this.domainsButton = this.page.getByRole('button', { name: 'Domains' });
        this.whoisButton = this.page.getByRole('link', { name: 'WHOIS', exact: true });
        this.transferButton = this.page.getByRole('link', { name: 'Transfer', exact: true });
        this.hostedZonesButton = this.page.getByRole('link', { name: 'Hosted zones' });
        this.registeredDomainsButton = this.page.getByRole('link', { name: 'Registered domains' });
        this.productsButton = this.page.getByRole('button', { name: 'Products', exact: true });
        this.helpCenterButton = this.page.getByRole('link', { name: 'Help center' });
        this.blogButton = this.page.getByRole('banner').getByRole('link', { name: 'Blog' });
        this.homeButton = this.page.getByRole('banner').getByRole('link', { name: 'Home', exact: true });
        this.sslSertificateLink = this.page.getByRole('link', { name: 'SSL certificates', exact: true });
        this.currencyUSDButton = this.page.getByRole('button', { name: 'Currency USD ($)' });
        this.currencyEURButton = this.page.getByRole('button', { name: 'Currency EUR (€)' });
        this.usdButton = this.page.getByRole('button', { name: 'USD ($)', exact: true });
        this.eurButton = this.page.getByRole('button', { name: 'EUR (€)' });
        this.checkmarkUSDButton = this.usdButton.locator('path[d="m5 13 4 4L19 7"]');
        this.checkmarkEURButton = this.eurButton.locator('path[d="m5 13 4 4L19 7"]');
    }

    async clickMyProfileButton() {
        await step('Click on the "My Profile" button.', async () => {
            await this.myProfileButton.click();
        });
    }

    async clickAccountSettingsLink() {
        await step('Click on the "Account Settings" link.', async () => {
            await this.accountSettingsLink.click();
        });
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

    async clickDomainsButton() {
        await step('Click on the "Domains" button.', async () => {
            await this.domainsButton.click();
        });
    }

    async clickWhoisButton() {
        await step('Click on the "Domains" button.', async () => {
            await this.whoisButton.click();
        });
    }

    async clickTransferLink() {
        await step('Click on "Transfer" link.', async () => {
            await this.domainsButton.click();
            await this.transferButton.click();
        });
    }

    async clickHomeButton() {
        await step('Click on "Home" button.', async () => {
            await this.homeButton.click();
        });
    }

    async clickWhoisLink() {
        await step('Click on "WHOIS" link.', async () => {
            await this.domainsButton.click();
            await this.whoisButton.click();
        });
    }

    async clickSslSertificateLink() {
        await step('Click on "SSL certificates" link.', async () => {
            await this.productsButton.click();
            await this.sslSertificateLink.click();
        });
    }

    async clickBlogButton() {
        await step('Click on "Blog" button.', async () => {
            await this.blogButton.click();
        });
    }

    async clickHelpCenterButton() {
        await step('Click on "Help center" button.', async () => {
            await this.helpCenterButton.click();
        });
    }

    async clickCurrencyUSDButton() {
        await step('Click on the "Currency USD ($)" button.', async () => {
            await this.currencyUSDButton.click();
        });
    }

    async clickEurButton() {
        await step('Click on the "EUR (€)" button.', async () => {
            await this.eurButton.click();
        });
    }

    async clickUsdButton() {
        await step('Click on the "USD ($)" button.', async () => {
            await this.usdButton.click();
        });
    }
}
