import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';

export default class HostedZonesDetailPage {
    constructor(page) {
        this.page = page;

        this.addRecordButton = this.page.getByRole('button', { name: 'Add record' });
        this.hostedZoneModal = this.page.locator('section[role="dialog"]');
    }

    async clickAddRecordButton() {
        await step('Click add record button.', async () => {
            await this.addRecordButton.click();
        });
    }

    async verifyModalDialogIsVisible() {
        await step('Verify the modal dialog is visible', async () => {
            await expect(this.hostedZoneModal).toBeVisible();
        });
    }

    async verifyModalDialogIsNotVisible() {
        await step('Verify the modal dialog is visible', async () => {
            await expect(this.hostedZoneModal).not.toBeVisible();
        });
    }
}
