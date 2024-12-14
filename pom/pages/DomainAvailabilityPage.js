import { step } from 'allure-js-commons';

export default class DomainAvailabilityPage {
    constructor(page) {
        this.page = page;

        this.whoOwnsButton = this.page.getByRole('button', { name: 'Who owns?' }).first();
        this.titleSearch = this.page.getByRole('heading', { name: 'WHOIS Search results' });
        this.resultSearch = this.page.locator('div[class*="card-domain-purchase"]').nth(0);
        this.domainTakenText = this.page.getByText('This domain is already taken').first();
        this.addToCartButton = this.page.getByRole('button', { name: 'Add to cart' }).first();
        this.costDomain = this.page.locator('text=/\\$\\d+\\.\\d{2}\\/yearRenewal/').first();
        this.fullInfoDomain = this.page.getByText('/^.+.(com|net|org)$d+.d{2}/yearRenewal: $d+.d{2}Buy$/');
        this.resultSearchList = this.page.locator('p[class*="card-domain-purchase"]');
        this.resultsSection = this.page.locator('#results');
    }
    async clickWhoOwnsButton() {
        await step('Click on "Who Owns" button.', async () => {
            await this.whoOwnsButton.click();
        });
    }
    async clickAddToCartButton() {
        await step('Click on "Add to cart" button.', async () => {
            await this.addToCartButton.click();
        });
    }
}
