import { step } from 'allure-js-commons';

export default class ConfirmEmailPage {
    constructor(page) {
        this.page = page;

        this.verificationCodeInput = this.page.locator('input[name="code"]');
        this.resendCodeButton = this.page.getByRole('button', { name: 'Resend code' });
        this.continueButton = this.page.locator('[type="submit"]');
        this.backToSignUpButton = this.page.getByRole('button', { name: 'Back to Sign up' });
    }

    async clickContinueButton() {
        await step('Click on "Continue" button.', async () => {
            await this.continueButton.click();
        });
    }

    async waitForTimerToComplete() {
        await step('Wait for the timer to complete.', async () => {
            await this.page.getByText('Resend code', { exact: true }).waitFor({ timeout: 65000 });
        });
    }

    async clickResendCodeButton() {
        await step('Click on "Resend code" button.', async () => {
            await this.resendCodeButton.click();
            await new Promise((resolve) => setTimeout(resolve, 5000));
        });
    }

    async fillVerificationCodeInput(verificationCode) {
        await step('Fill in "Verification code" input field.', async () => {
            await this.verificationCodeInput.fill(verificationCode);
        });
    }
}
