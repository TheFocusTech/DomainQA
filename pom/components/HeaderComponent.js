import { step } from 'allure-js-commons';

export default class HeaderComponent {
    constructor(page) {
        this.page = page;
        this.myProfileButton = this.page.getByRole('button', { name: 'My profile' });
        this.myProfileDropdownMenu = this.page.locator('ul.menu-list_menu-list-items__gM9KR');
        this.myProfileDropdownMenuItems = this.page.locator('li.menu-item_menu-item__sy6_P');
        this.myProfileDropdownMenuAccountSettings = this.page.getByRole('button', { name: 'Account settings' });
        this.myProfileDropdownMenuBillling = this.page.getByRole('button', { name: 'Billing' });
        this.myProfileDropdownMenuCurrency = this.page.getByRole('button', { name: 'BCurrency USD ($)' });
        this.myProfileDropdownMenuLogout = this.page.getByRole('button', { name: 'Log out' });
        this.logoButton = this.page.getByRole('banner').getByRole('link').first();
        this.accountSettingsLink = this.page.getByRole('link', { name: 'Account settings' });
        this.loginButton = this.page.getByRole('link', { name: 'Log in' });
        this.signupButton = this.page.getByRole('link', { name: 'Join now' });
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

    async clickSignup() {
        await step('Click on "Join now" button.', async () => {
            await this.signupButton.click();
        });
    }
}
