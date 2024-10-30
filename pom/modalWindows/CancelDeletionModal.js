import { step } from 'allure-js-commons';

export default class CancelDeletionModal {
    constructor(page) {
        this.page = page;

        this.acceptButton = this.page.locator('button:has-text("Accept")');
    }

    async clickAcceptDeletionButton() {
        await step('Click on the "Accept" button.', async () => {
            await this.acceptButton.click();
        });
    }
}
