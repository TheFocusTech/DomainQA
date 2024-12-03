import { step } from 'allure-js-commons';

export default class HelpCategoryPage {
    constructor(page) {
        this.page = page;

        this.mainHeading = this.page.locator('main h1');
        this.helpCategoryInput = this.page.getByRole('button', { name: 'Enter the search term' });
        this.helpCategoryPlaceholder = this.page.getByPlaceholder('Enter the search term');
        this.helpCategorySearchPopup = this.page.locator('div[class*="search-result"]');
        this.accordionButton = this.page.locator('[class*="accordion-slice_accordion-slice__"] button');
        this.accordionArticleHeader = this.page.locator('div[class*="accordion-segment_accordion-segment__"] a');
        this.category = page.locator('header div[class^="accordion-slice_accordion-slice-header"]');
        this.noResultsAlert = page.getByRole('heading', { name: 'No results' });
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

    async clickAccordionButton() {
        await step('Click on category button.', async () => {
            await this.accordionButton.first().click({ force: true });
        });
    }

    async clickFirstArticleHeader() {
        await step('Click on the first article header.', async () => {
            await this.accordionArticleHeader.first().click();
        });
    }
}
