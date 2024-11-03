import { step } from 'allure-js-commons';

export default class ContactDetailsPage {
    constructor(page) {
        this.page = page;

        this.title = this.page.getByRole('heading', { name: 'Contact details' });
        this.predefinedContactHeader = this.page.getByRole('heading', {
            name: 'Use a pre-defined contact (free and recommended option) as the first layer of WHOIS privacy',
        });
        this.predefinedContactContent = this.page.locator('div[class*="group-panel__content"]');
        this.groupTitles = this.page.locator('[class*="group-panel__title"]');
    }
}
