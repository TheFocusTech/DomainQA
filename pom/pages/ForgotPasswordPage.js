import { step } from 'allure-js-commons';

export default class ForgotPasswordPage {
    constructor(page) {
        this.page = page;

        this.header = page.getByRole('heading', { name: 'Password recovery' });
        this.description = page.locator('main p[class*="description"]');
        this.emailInput = page.getByPlaceholder('example@gmail.com');
        this.sendCodeButton = page.getByRole('button', { name: 'Send code' });
        this.backToLoginButton = page.getByRole('link', { name: 'Back to Log in' });
    }

    async fillEmailInput(email) {
        await step('Fill in "Email" input field.', async () => {
            await this.emailInput.fill(email);
        });
    }

    async clickSendCode() {
        await step('Click on "Send code" button.', async () => {
            await this.sendCodeButton.click();
        });
    }

    async clickBackToLogin() {
        await step('Click on "Back to Log in" button.', async () => {
            await this.backToLoginButton.click();
        });
    }
}
