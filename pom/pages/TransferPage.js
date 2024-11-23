import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export default class TransferPage {
    constructor(page) {
        this.page = page;

        this.mainHeading = this.page.locator('main h1');
        this.bulkTransferButton = this.page.getByRole('button', { name: 'Bulk transfer' });
        this.myTransfersButton = this.page.getByRole('link', { name: 'My transfers' });
    }

    async verifyTransferPage(heading, buttons) {
        await step(`Verify that Transfer page has "${heading}" heading.`, async () => {
            await expect(this.mainHeading).toContainText(heading);
        });
        for (const button of buttons) {
            await step(`Verify that Transfer page has "${button}" button.`, async () => {
                const buttonLocator = this.page.getByRole('button', { name: button, exact: true });
                const linkLocator = this.page.getByRole('link', { name: button, exect: true });
                await expect(buttonLocator.or(linkLocator).first()).toBeVisible();
            });
        }
    }

    async clickBulkTransferButton() {
        await step('Click on "Bulk transfer" button.', async () => {
            await this.bulkTransferButton.click();
        });
    }

    async clickMyTransfersButton() {
        await step('Click on "My transfers" button.', async () => {
            await this.myTransfersButton.click();
        });
    }
}
