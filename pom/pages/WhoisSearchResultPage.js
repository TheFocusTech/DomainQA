import { step } from 'allure-js-commons';
import { ERROR_DOMAIN } from '../../testData';

export default class WhoisSearchResultPage {
    constructor(page) {
        this.page = page;

        this.resultTitle = this.page.getByRole('heading', { name: 'WHOIS Search results' });
        this.fullInfoButton = this.page.getByRole('button', { name: 'Get full info' });
        this.noMatchText = this.page.getByText(`No match for "${ERROR_DOMAIN}."`);
        //   this.resultSearch = this.page.locator('div').filter({ hasText: /^WHOIS Search results$/ }).locator('div').nth(2);
        //    this.resultSearch = this.page.locator('div').filter({ hasText: 'Get full infoWHOIS Search' }).nth(1);
        //   this.resultSearch = this.page.locator('#results');
        //  this.resultSearch = this.page.locator("[class*='who-is-result_who-is-result']:first-child");
        // this.resultSearch = this.page.locator('div.card-domain_card-domain-body__6ODLv p.who-is-result_who-is-result__text___nqKq');
        this.resultSearch = this.page.locator('#results .card-domain_card-domain__box__p8Zth > p:nth-of-type(1)');

        //this.resultSearch = this.page.locator('div').filter({ hasText: 'Get full infoWHOIS Search' }).nth(1)
        //    this.resultSearch = this.page.locator('p.who-is-result_who-is-result__text___nqKq');

        //('No match for "FGGFFGDGDFGD.')
    }
    async clickfullInfoButton() {
        await step('Click on "Get full info" button.', async () => {
            await this.fullInfoButton.click();
        });
    }
}
