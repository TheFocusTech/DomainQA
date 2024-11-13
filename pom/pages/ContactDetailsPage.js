import { step } from 'allure-js-commons';
import { CONTACTS } from '../../testData';

export default class ContactDetailsPage {
    constructor(page) {
        this.page = page;

        this.title = this.page.getByRole('heading', { name: 'Contact details' });
        this.predefinedContactHeader = this.page.getByRole('heading', {
            name: 'Use a pre-defined contact (free and recommended option) as the first layer of WHOIS privacy',
        });
        this.content = this.page.locator('div[class*="group-panel__content"]');
        this.groupTitles = this.page.locator('[class*="group-panel__title"]');
        this.card = this.page.locator('[class*="card-domain_card-domain"]');
        this.predefinedContactCard = this.card.filter({
            hasText: CONTACTS.predefined.alias,
        });
        this.backToAccountSettingsButton = this.page.getByRole('link', { name: 'Back to Account settings' });
    }

    async clickBackToAccountSettingsButton() {
        await step('Click on "Back to Account settings" button.', async () => {
            await this.backToAccountSettingsButton.click();
        });
    }
}
