import { step } from 'allure-js-commons';

export default class HelpCategoryPage {
    constructor(page) {
        this.page = page;

        this.mainHeading = this.page.locator('main h1');
        this.helpCategoryInput = this.page.getByRole('button', { name: 'Enter the search term' });
        this.helpCategoryPlaceholder = this.page.getByPlaceholder('Enter the search term');
        this.helpCategorySearchPopup = this.page.locator('div[class*="search-result"]');
    }

    async clickHelpCategorySearchInput() {
        await step('Click the Help Category search input field.', async () => {
            await this.helpCategoryInput.click();
        });
    }

    async waitForHelpCategorySearchPopup() {
        await step('Wait search result in popup.', async () => {
            await this.helpCategorySearchPopup.waitFor({ state: 'visible' });
        });
    }

    async fillHelpCategorySearchInput(name) {
        await step('Fill the keyword into the Help Category search input field.', async () => {
            await this.helpCategoryPlaceholder.fill(name);
        });
    }

    async closeModalWindow() {
        await step('Closing modal window by clicking outside.', async () => {
            await this.page.locator('body').click({ position: { x: 0, y: 0 } });
        });
    }
}
