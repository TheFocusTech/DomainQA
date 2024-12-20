import { step } from 'allure-js-commons';
import { ERROR_DOMAIN } from '../../testData';

export default class WhoisSearchResultPage {
    constructor(page) {
        this.page = page;

        this.resultTitle = this.page.getByRole('heading', { name: 'WHOIS Search results' });
        this.fullInfoButton = this.page.getByRole('button', { name: 'Get full info' });
        this.noMatchText = this.page.getByText(`No match for "${ERROR_DOMAIN}."`);
        this.resultSearch = this.page.locator('div[class*="card-domain-body"] p:last-child');
    }
    async clickFullInfoButton() {
        await step('Click on "Get full info" button.', async () => {
            await this.fullInfoButton.click();
        });
    }
}
