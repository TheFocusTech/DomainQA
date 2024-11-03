export default class TwoFactorAuthModal {
    constructor(page) {
        this.page = page;

        this.secretKey = this.page.locator('[class*="otp-form_code-key__text__"]');
        this.verificationCode = this.page.getByPlaceholder('Enter verification code');
        this.copyButton = this.page.locator('[class*="code-key__copy"]');
        this.enableButton = this.page.getByText('Enable');
        this.dialog = this.page.locator('section[role="dialog"]');
    }

    async clickCheckbox() {
        await this.checkbox.click();
    }

    async clickCopySecretCode() {
        await this.copyButton.click();
    }

    async getSecretKey() {
        return await this.secretKey.textContent();
    }

    async enterVerificationCode(code) {
        await this.verificationCode.scrollIntoViewIfNeeded();
        await this.verificationCode.fill(code);
    }
}
