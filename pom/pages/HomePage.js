import { step } from 'allure-js-commons';

export default class HomePage {
    constructor(page) {
        this.page = page;

        this.loginButton = this.page.getByRole('link', { name: 'Log in' });
        this.myProfileButton = this.page.getByRole('button', { name: 'My profile' });
    }

    async clickLogin() {
        await step('Click on "Log in" button.', async () => {
            await this.loginButton.click();
        });
    }
}
