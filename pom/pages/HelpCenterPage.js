import { step } from 'allure-js-commons';

export default class HelpCenterPage {
    constructor(page) {
        this.page = page;

        this.helpSearchInput = this.page.getByPlaceholder('Enter the search term');
        this.helpSearchPopup = this.page.locator('div[class*="search-article-result"]');
    }

    async fillHelpSearchInput(name) {
        await step('Fill the keyword into the Help Center search input field.', async () => {
            await this.helpSearchInput.fill(name);
        });
    }

    async waitForHelpSearchPopup() {
        await step('Waiting for the popup to display. ', async () => {
            await this.helpSearchPopup.waitFor({ state: 'visible' });
        });
    }
}
