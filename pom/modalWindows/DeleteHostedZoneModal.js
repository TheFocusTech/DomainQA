import { step } from 'allure-js-commons';

export default class DeleteHostedZoneModal {
    constructor(page) {
        this.page = page;

        this.cancelButton = this.page.locator('button').filter({ hasText: 'Cancel' });
        this.deleteButton = this.page.locator('#root-portal button').filter({ hasText: 'Delete' });
   this.xCloseButton = this.page.locator('#root-portal').getByLabel('Button');
        this.formModalWindow = this.page.getByText('Delete hosted zoneAre you');
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

    async clickxCloseButton() {
        await step('Click "X" button.', async () => {
            await this.xCloseButton.click();
        });
    }
}
