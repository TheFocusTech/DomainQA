import { step } from 'allure-js-commons';

export default class ChangePasswordModal {
    constructor(page) {
        this.page = page;

        this.currentPasswordField = this.page.getByLabel('Current password');
        this.newPasswordField = this.page.getByLabel('New password', { exact: true });
        this.repeatNewPassword = this.page.getByLabel('Repeat new password');
        this.closeButton = this.page.getByLabel('Button');
        this.cancelButton = this.page.locator('button').filter({ hasText: 'Cancel' });
        this.changeButton = this.page.locator('#root-portal button').filter({ hasText: 'Change' });
    }

    async fillCurrentPasswordField(password) {
        await step('Fill in the "Current Password" input field.', async () => {
            await this.currentPasswordField.fill(password);
        });
    }

    async fillNewPasswordField(password) {
        await step('Fill in the "New Password" input field.', async () => {
            await this.newPasswordField.fill(password);
        });
    }

    async fillRepeatNewPasswordField(password) {
        await step('Fill in the "Repeat New Password" input field.', async () => {
            await this.repeatNewPassword.fill(password);
        });
    }

    async clickChangeButton() {
        await step('Click on the "Change" button.', async () => {
            await this.changeButton.click();
        });
    }
}
