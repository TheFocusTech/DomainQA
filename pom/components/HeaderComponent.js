import { step } from 'allure-js-commons';

export default class HeaderComponent {
    constructor(page) {
        this.page = page;
        this.myProfileButton = this.page.getByRole('button', { name: 'My profile' });
        this.myProfileDropdownMenu = this.page.locator('ul[class*="menu-list"]');
        this.myProfileDropdownMenuItems = this.page.locator('ul[class*="menu-list"]').locator('li[class*="menu-item"]');
        this.logoButton = this.page.getByRole('banner').getByRole('link').first();
        this.accountSettingsLink = this.page.getByRole('link', { name: 'Account settings' });
        this.loginButton = this.page.getByRole('link', { name: 'Log in' });
        this.logOutButton = this.page.getByRole('button', { name: 'Log out' });
        this.signupButton = this.page.getByRole('link', { name: 'Join now' });
        this.helpCenterButton = this.page.getByRole('link', { name: 'Help center' });
        this.domainsButton = this.page.getByRole('button', { name: 'Domains' });
        this.whoisButton = this.page.getByRole('link', { name: 'WHOIS', exact: true });
        this.transferButton = this.page.getByRole('link', { name: 'Transfer', exact: true });
        this.hostedZonesButton = this.page.getByRole('link', { name: 'Hosted zones' });
        this.registeredDomainsButton = this.page.getByRole('link', { name: 'Registered domains', exect: true });
        this.productsButton = this.page.getByRole('button', { name: 'Products', exact: true });
        this.blogButton = this.page.getByRole('banner').getByRole('link', { name: 'Blog' });
        this.homeButton = this.page.getByRole('banner').getByRole('link', { name: 'Home', exact: true });
        this.sslSertificateLink = this.page.getByRole('link', { name: 'SSL certificates', exact: true });
        this.logo = this.page.locator('header a[class^="logo"]');
        this.currencyButton = this.page.getByRole('button', { name: 'Currency ' });
        this.billingLink = this.page.getByRole('link', { name: 'Billing' });
        this.notificationsIndicator = this.page.locator('.badge-indicator_badge-indicator__counter__LipkI');
        this.notificationsIconButton = this.page.getByLabel('Notifications');
        this.notificationDropdownHeader = this.page.getByText('Notifications', { exact: true });
        this.newNotificationContent = this.page.locator('div[class^="list_item__"]');
        this.newNotificationIndicator = this.newNotificationContent.locator('circle');
        this.hostingButton = this.page.getByRole('link', { name: 'Hosting', exact: true });
    }

    async clickMyProfileButton() {
        await step('Click on the "My Profile" button.', async () => {
            await this.myProfileButton.click();
        });
    }

    async clickLogoButton() {
        await step('Click on the "My Profile" button', async () => {
            await this.logoButton.click();
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

    async clickLogOutButton() {
        await step('Click on "Log out" button.', async () => {
            await this.logOutButton.click();
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
        await step('Click on the "Whois" button.', async () => {
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

    async clickHostedZonesLink() {
        await step('Click on "Hosted Zones" link.', async () => {
            await this.domainsButton.click();
            await this.hostedZonesButton.click();
        });
    }

    async clickButton(name) {
        await step(`Click on the ${name} button in Hearder.`, async () => {
            await this.page.getByRole('button', { name: name, exact: true }).click();
        });
    }

    async clickLink(name) {
        await step(`Click on the ${name} link in Hearder.`, async () => {
            await this.page.getByRole('link', { name: name, exact: true }).click();
        });
    }

    async clickLogo() {
        await step('Click on the Logo in Hearder.', async () => {
            await this.logo.click();
        });
    }

    async clickRegisteredDomainsButton() {
        await step('Click on the "Registered Domains" button in Hearder.', async () => {
            await this.domainsButton.click();
            await this.registeredDomainsButton.click();
        });
    }

    async clickCurrencyButton() {
        await step('Click on the currency button.', async () => {
            await this.currencyButton.click();
        });
    }

    async clickCurrencyTypeDropdown(type) {
        return await step(`Click ${type} type currency dropdown.`, async () => {
            await this.page.getByRole('button', { name: `${type}` }).click();
        });
    }

    async isCurrencyTypeSet(type) {
        return await step('Get currency type value.', async () => {
            return (await this.currencyButton.innerText()) === `Currency ${type}`;
        });
    }

    async changeCurrencyType(type) {
        return await step(`Change currency to the ${type}.`, async () => {
            await this.clickCurrencyButton();
            await this.clickCurrencyTypeDropdown(type);
            await this.clickCurrencyButton();
        });
    }

    async getCurrencyTypeSelected(type) {
        return await step('Get currency selected type.', async () => {
            return this.page.locator(`button[class*="menu-button"] span:has-text("${type}") + span`);
        });
    }

    async clickBillingLink() {
        await step('Click on billing link.', async () => {
            await this.billingLink.click();
        });
    }

    async clickNotificationsIconButton() {
        await step('Click on the notification icon button.', async () => {
            await this.notificationsIconButton.click();
        });
    }

    async clickHostingButton() {
        await step('Click on the "Hosting" button in Hearder.', async () => {
            await this.productsButton.click();
            await this.hostingButton.click();
        });
    }
}
