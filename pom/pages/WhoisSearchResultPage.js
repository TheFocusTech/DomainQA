import { step } from 'allure-js-commons';
import { ERROR_DOMAIN } from '../../testData';

export default class WhoisSearchResultPage {
    constructor(page) {
        this.page = page;

        this.resultTitle = this.page.getByRole('heading', { name: 'WHOIS Search results' });
        this.fullInfoButton = this.page.getByRole('button', { name: 'Get full info' });
        //    this.resultSearch = this.page.locator('p.who-is-result_who-is-result__text___nqKq');
        this.noMatchText = this.page.getByText(`No match for "${ERROR_DOMAIN}."`);
        //('No match for "FGGFFGDGDFGD.')
    }
    async clickfullInfoButton() {
        await step('Click on "Get full info" button.', async () => {
            await this.fullInfoButton.click();
        });
    }
}
