import { step } from 'allure-js-commons';

export default class HeaderComponent {
    constructor(page) {
        this.page = page;

        this.myProfileButton = this.page.getByRole('button', { name: 'My profile' });
        this.accountSettingsLink = this.page.getByRole('link', { name: 'Account settings' });
        this.loginButton = this.page.getByRole('link', { name: 'Log in' });
        this.signupButton = this.page.getByRole('link', { name: 'Join now' });
        this.helpCenterButton = this.page.getByRole('link', { name: 'Help center' });
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

    async clickHelpCenter() {
        await step('Click on "Help center" button.', async () => {
            await this.helpCenterButton.click();
        });
    }
}
