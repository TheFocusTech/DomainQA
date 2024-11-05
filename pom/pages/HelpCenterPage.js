import { step } from 'allure-js-commons';
import { getRandomCharacters } from '../../helpers/utils';

export default class HelpCenterPage {
    constructor(page) {
        this.page = page;

        this.helpCenterPlaceholder = this.page.getByPlaceholder('Enter the search term');
        this.helpSearchButton = this.page.getByRole('button', { name: 'Search' });
        this.randomString = '';
        this.helpSearchPopup = this.page.locator('div[class*="search-article-result"]');
        this.helpSearchPopupAlert = this.page.locator('h2[class*="alert-base"]');
    }

    async fillHelpSearchInput(name) {
        await step('Fill the keyword into the Help Center search input field.', async () => {
            await this.helpCenterPlaceholder.fill(name);
        });
    }

    async fillSearchInput() {
        await step('Fill the Help Center input.', async () => {
            this.randomString = await getRandomCharacters(10);
            await this.helpCenterPlaceholder.waitFor({ state: 'visible' });
            await this.helpCenterPlaceholder.fill(this.randomString);
        });
        return this.randomString;
    }

    async waitForPopupToBeVisible() {
        await step('Await search result in popup.', async () => {
            await this.helpSearchPopup.waitFor({ state: 'visible' });
        });
    }

    async clickHelpCenterSearchButton() {
        await step('Click search button.', async () => {
            await this.helpSearchButton.waitFor({ state: 'visible' });
            await this.helpSearchButton.click({ force: true });
        });
    }
}
