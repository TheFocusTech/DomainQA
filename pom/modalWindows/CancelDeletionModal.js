import { step } from 'allure-js-commons';

export default class CancelDeletionModal {
    constructor(page) {
        this.page = page;

        this.acceptButton = this.page.locator('button').filter({ hasText: 'Accept' });
        this.cancelDeletionHeading = this.page.locator('#root-portal').getByText('Cancel deletion', { exact: true });
    }

    async clickAcceptButton() {
        await step('Click on the "Accept" button.', async () => {
            await this.acceptButton.click();
        });
    }
}
