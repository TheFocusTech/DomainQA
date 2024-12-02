import { step } from 'allure-js-commons';

export default class BillingPage {
    constructor(page) {
        this.page = page;

        this.topUpButton = this.page.getByRole('button', { name: 'Top up' });
        this.addNewCardButton = this.page.getByRole('button', { name: 'Add new card' });
        this.noCardsYetMessage = this.page.getByRole('heading', { name: 'No cards yet' });
        this.walletBalance = this.page.locator('p[class*="wallet__amount"]');
    }

    async clickTopUpButton() {
        await step('Click Top up button.', async () => {
            await this.topUpButton.click();
        });
    }
}
