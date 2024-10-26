import { step } from 'allure-js-commons';

export default class DeleteHostedZoneModal {
    constructor(page) {
        this.page = page;

        this.cancelButton = this.page.locator('button[class="button-outline_"]');
        this.deleteButton = this.page.locator('button[class*="button-negative_"]');
    }

    async clickDeleteButton() {
        await step('Click "Delete" button.', async () => {
            await this.deleteButton.click();
        });
    }

    async clickCancelButton() {
        await step('Click "Сancel" button.', async () => {
            await this.cancelButton.click();
        });
    }
}
