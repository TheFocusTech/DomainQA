import { step } from 'allure-js-commons';

export default class SettingsGeneralPage {
    constructor(page) {
        this.page = page;

        this.changeButton = this.page.getByRole('button', { name: 'Change' });
        this.deleteAccountButton = this.page.locator('button:has-text("Delete account")');
        this.generalInfoButton = this.page.locator('button:has-text("General info")');
        this.messageAboutDeletion = this.page.locator('p:has-text("This account will be deleted in 30 days")');
        this.dateOfDeletion = this.page.locator('p:has-text("Date of deletion:")');
        this.cancelDeletionButton = this.page.locator('button:has-text("Cancel deletion")');
        this.twoFAToggle = this.page.locator('[class*="switch-2fa_switch-2fa__"]');
        this.checkbox = this.page.locator('[type="checkbox"]');
        this.disableTooltip = this.page.getByText('Two-factor authentication disabled');
        this.enableTooltip = this.page.getByText('Two-factor authentication enable');
        this.notificationSettingsButton = this.page.getByRole('button', { name: 'Notification settings' });
    }

    async clickTwoFAToggle() {
        await this.twoFAToggle.click();
    }

    async clickChangeButton() {
        await step('Click on the "Change" button.', async () => {
            await this.changeButton.click();
        });
    }

    async clickDeleteAccountButton() {
        await step('Click on the "Delete account" button.', async () => {
            await this.deleteAccountButton.click();
        });
    }

    async clickCancelDeletionButton() {
        await step('Click on the "Cancel Deletion" button.', async () => {
            await this.cancelDeletionButton.click();
        });
    }

    async clickNotificationSettingsButton() {
        await step('Click on the "Notification settings" button.', async () => {
            await this.notificationSettingsButton.click();
        });
    }
}
