import { step } from 'allure-js-commons';

export default class DeleteHostedZoneModal {
    constructor(page) {
        this.page = page;

        this.cancelButton = this.page.locator('#root-portal button').filter({ hasText: 'Cancel' });
        this.deleteButton = this.page.locator('#root-portal button').filter({ hasText: 'Delete' });
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
