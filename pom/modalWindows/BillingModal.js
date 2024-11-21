import { step } from 'allure-js-commons';

export default class BillingModal {
    constructor(page) {
        this.page = page;

        this.topUpButton = this.page.getByRole('button', { name: 'Top up' });
        this.byBankCardButton = this.page.getByText('By bank card');
        this.topUpByBankCardModalWindowHeader = this.page.getByText('Top up by bank card');
        this.backToTopUpButton = this.page
            .locator('.modal-header_modal-header__slot__1oCdj')
            .filter({ hasText: 'Back to Top up' });
        this.addNewCardButton = this.page.getByRole('button', { name: 'Add new card' });
        this.cancelButton = this.page.locator('[type="button"]').filter({ hasText: 'Cancel' });
        this.noCardsYetMessage = this.page.getByRole('heading', { name: 'No cards yet' });
        this.labelOfCurrencyInputField = this.page.getByLabel('Amount (USD)');
    }

    async clickTopUpButton() {
        await step('Click Top up button.', async () => {
            await this.topUpButton.click();
        });
    }

    async clickByBankCardButton() {
        await step('Click By Bank card button.', async () => {
            await this.byBankCardButton.click();
        });
    }
}
