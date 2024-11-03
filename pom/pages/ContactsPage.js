import { step } from 'allure-js-commons';

export default class ContactsPage {
    constructor(page) {
        this.page = page;

        this.searchInput = this.page.getByPlaceholder('Search by name');
        this.addNewContactButton = this.page.getByRole('button', { name: 'Add new contact' });
        this.moreButton = this.page.getByRole('button', { name: 'More' });
        this.predefinedContactHeader = this.page.getByRole('heading', {
            name: 'Use a pre-defined contact (free and recommended option) as the first layer of WHOIS privacy',
        });
        this.viewFullInfoButton = this.page.getByRole('link', { name: 'View full info' });
    }

    async clickMoreButton() {
        await step('Click on "More" button.', async () => {
            await this.moreButton.click();
        });
    }

    async clickViewFullInfoButton() {
        await step('Click on "View full info" button.', async () => {
            await this.viewFullInfoButton.click();
        });
    }
}
