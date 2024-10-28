import { step } from 'allure-js-commons';

export default class AccountDeletionModal {
    constructor(page) {
        this.page = page;

        this.checkbox = this.page.locator('label').filter({ hasText: 'Yes, I consent to delete my' }).locator('div');
        this.cancelButton = this.page.locator('button:has-text("Cancel")');
        this.continueButton = this.page.locator('button').filter({ hasText: 'Continue' });
        this.closeButton = this.page.getByLabel('Button');
        this.accountDeletionModalContainer = this.page.locator('#root-portal');
    }

    async clickCloseButton() {
        await step('Click on the "CloseButton" button.', async () => {
            await this.closeButton.click();
        });
    }

    async markCheckbox() {
        await step('Mark the "Checkbox".', async () => {
            await this.checkbox.check();
        });
    }
    async clickContinueButton() {
        await step('Click on the "ContinueButton" button.', async () => {
            await this.continueButton.click();
        });
    }
}
