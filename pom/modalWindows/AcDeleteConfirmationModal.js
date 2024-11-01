import { step } from 'allure-js-commons';

export default class AcDeleteConfirmationModal {
    constructor(page) {
        this.page = page;

        this.deleteInput = this.page.getByPlaceholder('Delete');
        this.cancelButton = this.page.locator('button').filter({ hasText: 'Cancel' });
        this.deleteButton = this.page.locator('#root-portal button').filter({ hasText: 'Delete account' });
        this.closeButton = this.page.getByLabel('Button');
        this.modalDescription = this.page.getByText(
            'This action will delete all your data. Please type "Delete" below to confirm'
        );
    }

    async enterDeleteText() {
        await step('Enter "Delete" in the text field.', async () => {
            await this.deleteInput.fill('Delete');
        });
    }
    async clickDeleteAccountButton() {
        await step('Click on the "Delete account" button.', async () => {
            await this.deleteButton.click();
        });
    }
}
