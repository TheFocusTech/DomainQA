import { step } from 'allure-js-commons';

export default class ForgotPasswordPage {
    constructor(page) {
        this.page = page;

        this.header = page.getByRole('heading', { name: 'Password recovery' });
        this.description = page.locator('main p[class*="description"]');
        this.emailInput = page.getByPlaceholder('example@gmail.com');
        this.sendCodeButton = page.getByRole('button', { name: 'Send code' });
        this.backToLoginButton = page.getByRole('link', { name: 'Back to Log in' });
        this.headerCheckEmail = page.getByRole('heading', { name: 'Check your email' });
        this.descriptionCheckEmail = page.locator('[class*="overlay-description"]');
        this.codeInput = page.getByPlaceholder('Enter the code');
        this.resendCodeButton = page.locator('button').filter({ hasText: 'Resend code' });
        this.continueButton = page.locator('button').filter({ hasText: 'Continue' });
        this.closeButton = page.getByLabel('Button');
        this.backToPasswordRecoveryButton = page.getByRole('button', { name: 'Back to Password recovery' });
        this.headerCreatePassword = page.getByRole('heading', { name: 'Create a new password' });
        this.passwordInput = page.getByPlaceholder('Enter password');
        this.repeatPasswordInput = page.getByPlaceholder('Repeat password');
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

    async fillCodeField(code) {
        await step('Fill in the "Password reset code" input field.', async () => {
            await this.codeInput.fill(code);
        });
    }

    async clickContinue() {
        await step('Click on the "Continue" button.', async () => {
            await this.continueButton.click();
        });
    }

    async clickBackToPasswordRecovery() {
        await step('Click on the "Back to Password recovery" button.', async () => {
            await this.backToPasswordRecoveryButton.click();
        });
    }

    async waitForTimerToComplete() {
        await step('Wait for the timer to complete.', async () => {
            await this.page.getByText('Resend code', { exact: true }).waitFor({ timeout: 65000 });
        });
    }

    async clickResendCode() {
        await step('Click on "Resend code" button.', async () => {
            await this.resendCodeButton.click();
            await new Promise((resolve) => setTimeout(resolve, 5000));
        });
    }

    async fillPasswordInput(password) {
        await step('Fill in "Password" input field.', async () => {
            await this.passwordInput.fill(password);
        });
    }

    async fillRepeatPasswordInput(repeatPassword) {
        await step('Fill in "Repeat password" input field.', async () => {
            await this.repeatPasswordInput.fill(repeatPassword);
        });
    }
}
