import { step } from 'allure-js-commons';

export default class GeneralSettingsPage {
    constructor(page) {
        this.page = page;

        this.changeButton = this.page.getByRole('button', { name: 'Change' });
    }

    async clickChangeButton() {
        await step('Click on the "Change" button.', async () => {
            await this.changeButton.click();
        });
    }
}
