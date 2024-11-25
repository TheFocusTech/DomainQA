import { step } from 'allure-js-commons';

export default class EnableDnssecModal {
    constructor(page) {
        this.page = page;

        this.dialog = this.page.locator('section[role="dialog"]');
        this.title = this.page.locator('[class*="modal__title"]');
        this.descriptionModal = this.page.locator('[class*="modal__description"]');
        this.cancelButton = this.page.locator('#root-portal button').filter({ hasText: 'Cancel' });
        this.enableButton = this.page.locator('#root-portal button').filter({ hasText: 'Enable' });
        this.closeButton = this.page.locator('#root-portal').getByLabel('Button');
    }

    async clickEnableButton() {
        await step('Click on "Enable" button.', async () => {
            await this.enableButton.click();
        });
    }

    async closeModalRandomly() {
        await step('Close modal window randomly.', async () => {
            const randomChoice = Math.floor(Math.random() * 3);

            if (randomChoice === 0) {
                console.log('Closing modal window by clicking "Cancel" button.');
                await this.cancelButton.click();
            } else if (randomChoice === 1) {
                console.log('Closing modal window by clicking "x" icon.');
                await this.closeButton.click();
            } else {
                console.log('Closing modal window by clicking outside.');
                await this.page.locator('body').click({ position: { x: 0, y: 0 } });
            }
        });
    }
}
