import { step } from 'allure-js-commons';

export default class CheckoutStripePage {
    constructor(page) {
        this.page = page;

        this.header = this.page.locator('#root header');
    }

    async clickBackButton() {
        await step('Click "Back" button.', async () => {
            await this.header.hover();
            await this.header.click();
        });
    }
}
