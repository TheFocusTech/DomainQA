import { step } from 'allure-js-commons';

export default class HeaderComponent {
    constructor(page) {
        this.page = page;

        this.myProfileButton = this.page.getByRole('button', { name: 'My profile' });
        this.accountSettingsLink = this.page.getByRole('link', { name: 'Account settings' });
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
}
