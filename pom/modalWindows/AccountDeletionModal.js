import { step } from 'allure-js-commons';

export default class AccountDeletionModal {
    constructor(page) {
        this.page = page;

        this.consentCheckbox = this.page.locator('label').filter({ hasText: 'Yes, I consent to delete my' }).locator('div');
        this.cancelButton = this.page.locator('button:has-text("Cancel")');
        this.continueButton = this.page.locator('button').filter({ hasText: 'Continue' });
        this.closeButton = this.page.getByLabel('Button');
        this.accountDeletionModalContainer = this.page.locator('#root-portal');
        this.deleteAccountHeading = this.page.getByRole('heading', {name: 'Delete account'});
        this.deleteField = this.page.getByPlaceholder('Delete');
        this.deleteAccountButton = this.page.locator('#root-portal button').filter({ hasText: 'Delete account' });
    }

    async clickCloseButton() {
        await step('Click on the "Close" button.', async () => {
            await this.closeButton.click();
        });
    }

    async checkConsentCheckbox() {
        await step('Check the "Yes, I consent to delete my" checkbox.', async () => {
            await this.consentCheckbox.check();
        });
    }

    async clickContinueButton() {
        await step('Click on the "Continue" button.', async () => {
            await this.continueButton.click();
        });
    }

    async fillDeleteField(confirmation) {
        await step('Fill in the "Delete" confirm input field.', async () => {
            await this.deleteField.fill(confirmation);
        });
    }

    async clickDeleteAccountButton() {
        await step('Click on the "Delete account" button.', async () => {
            await this.deleteAccountButton.click();
        });
    }
}
