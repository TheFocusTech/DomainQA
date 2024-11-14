import { step } from 'allure-js-commons';

export default class CheckEmailModal {
    constructor(page) {
        this.page = page;

        this.dialog = page.locator('section[role="dialog"]');
        this.title = page.getByRole('heading', { name: 'Check your email' });
        this.description = page.locator('[class*="overlay-description"]');
        this.codeInput = page.getByPlaceholder('Enter the code');
        this.resendCodeButton = page.locator('button').filter({ hasText: 'Resend code' });
        this.continueButton = page.locator('button').filter({ hasText: 'Continue' });
        this.closeButton = page.locator('#root-portal').getByLabel('Button');
        this.backToPasswordRecoveryButton = page.getByRole('link', { name: 'Back to Password recovery' });
    }

    async fillCodeField(code) {
        await step('Fill in the "Password reset code" input field.', async () => {
            await this.currentPasswordField.fill(code);
        });
    }

    async clickContinue() {
        await step('Click on the "Continue" button.', async () => {
            await this.continueButton.click();
        });
    }
}
