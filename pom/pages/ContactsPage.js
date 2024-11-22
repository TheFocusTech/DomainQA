import { step } from 'allure-js-commons';
import { CONTACTS } from '../../testData';
import { delay } from '../../helpers/utils';

export default class ContactsPage {
    constructor(page) {
        this.page = page;

        this.searchInput = this.page.getByPlaceholder('Search by name');
        this.addNewContactButton = this.page.getByRole('button', { name: 'Add new contact' });
        this.predefContactHeader = this.page.getByRole('heading', {
            name: 'Use a pre-defined contact (free and recommended option) as the first layer of WHOIS privacy',
        });
        this.viewFullInfoButton = this.page.getByRole('link', { name: 'View full info' });
        this.card = this.page.locator('[class*="card-domain_card-domain"]');
        this.predefinedContactCard = this.card.filter({
            hasText: CONTACTS.predefined.alias,
        });
        this.moreButton = this.page.getByRole('button', { name: 'More', exact: true });
        this.moreDropdownMenu = this.page.locator('ul[class^="menu-list_menu-list-items"]');
    }

    async clickMoreButtonByContact(contact) {
        await step('Click on "More" button.', async () => {
            const moreButton = this.card.filter({ hasText: contact }).getByRole('button', { name: 'More' });
            await moreButton.click();
        });
    }

    async clickMoreButton() {
        await step('Click on the "More" button.', async () => {
            await this.moreButton.first().click();
        });
    }

    async clickViewFullInfoButton() {
        await step('Click on "View full info" button.', async () => {
            await this.viewFullInfoButton.click();
            await delay(1000);
        });
    }
}
