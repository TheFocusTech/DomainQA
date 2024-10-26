import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';

export default class HostedZonesDetailPage {
    constructor(page) {
        this.page = page;

        this.addRecordButton = this.page.getByRole('button', { name: 'Add record' });
        this.hostedZoneModal = this.page.locator('section[role="dialog"]');
        this.backToHostedZonesButton = this.page.getByRole('link', { name: 'Back to Hosted zones' });
    }

    async clickBackToHostedZonesButton() {
        await step('Click "Back to Hosted zones" button.', async () => {
            await this.backToHostedZonesButton.click();
        });
    }

    async clickAddRecordButton() {
        await step('Click "Add Record" button.', async () => {
            await this.addRecordButton.click();
        });
    }

    async verifyModalDialogIsVisible() {
        await step('Verify the modal dialog is visible.', async () => {
            await expect(this.hostedZoneModal).toBeVisible();
        });
    }

    async verifyModalDialogIsNotVisible() {
        await step('Verify the modal dialog is not visible.', async () => {
            await expect(this.hostedZoneModal).not.toBeVisible();
        });
    }
}
