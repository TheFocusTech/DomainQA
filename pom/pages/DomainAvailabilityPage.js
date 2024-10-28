import { step } from 'allure-js-commons';

export default class DomainAvailabilityPage {
    constructor(page) {
        this.page = page;

        this.whoOwnsButton = this.page.getByRole('button', { name: 'Who owns?' }).first();
    }
    async clickWhoOwnsButton() {
        await step('Click on "Who Owns" button.', async () => {
            await this.whoOwnsButton.click();
        });
    }
}
