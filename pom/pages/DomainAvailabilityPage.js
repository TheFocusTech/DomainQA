import { step } from 'allure-js-commons';

export default class DomainAvailabilityPage {
    constructor(page) {
        this.page = page;

        this.whoOwnsButton = this.page.getByRole('button', { name: 'Who owns?' }).first();
        this.titleSearch = this.page.getByRole('heading', { name: 'WHOIS Search results' });
        this.resultSearch = this.page.locator('div[class*="card-domain-purchase"]').nth(0);
        this.domainTakenText = this.page.getByText('This domain is already taken').first();
        this.buyButton = this.page.locator('div').filter({ hasText: /^Buy$/ }).first();
        this.costDomain = this.page.locator('text=/\\$\\d+\\.\\d{2}\\/yearRenewal/').first();
        this.fullInfoDomain = this.page.getByText('/^.+.(com|net|org)$d+.d{2}/yearRenewal: $d+.d{2}Buy$/');
    }
    async clickWhoOwnsButton() {
        await step('Click on "Who Owns" button.', async () => {
            await this.whoOwnsButton.click();
        });
    }
    async clickBuyButton() {
        await step('Click on "Buy" button.', async () => {
            await this.buyButton.click();
        });
    }
}
