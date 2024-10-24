import { step } from 'allure-js-commons';
import HeaderComponent from '../components/HeaderComponent';

export default class HomePage {
    constructor(page) {
        this.page = page;
        this.headerComponent = new HeaderComponent(this.page);

        this.loginButton = this.page.getByRole('link', { name: 'Log in' });
        this.signupButton = this.page.getByRole('link', { name: 'Join now' });
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
