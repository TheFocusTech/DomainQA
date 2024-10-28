import { step } from 'allure-js-commons';

export default class HeaderComponent {
    constructor(page) {
        this.page = page;

        this.myProfileButton = this.page.getByRole('button', { name: 'My profile' });
        this.accountSettingsLink = this.page.getByRole('link', { name: 'Account settings' });
        this.loginButton = this.page.getByRole('link', { name: 'Log in' });
        this.signupButton = this.page.getByRole('link', { name: 'Join now' });
        this.domainsButton = this.page.getByRole('button', { name: 'Domains' });
        this.productsButton = this.page.getByRole('button', { name: 'Products', exact: true });
        this.helpCenterButton = this.page.getByRole('link', { name: 'Help center' });
        this.blogButton = this.page.getByRole('banner').getByRole('link', { name: 'Blog' });
        this.transferLink = this.page.getByRole('link', { name: 'Transfer', exact: true });
        this.homeButton = this.page.getByRole('banner').getByRole('link', { name: 'Home', exact: true });
        this.whoisLink = this.page.getByRole('link', { name: 'WHOIS', exact: true });
        this.sslSertificateLink = this.page.getByRole('link', { name: 'SSL certificates', exact: true });
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

    async clickTransferLink() {
        await step('Click on "Transfer" link.', async () => {
            await this.domainsButton.click();
            await this.transferLink.click();
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
            await this.whoisLink.click();
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
}
