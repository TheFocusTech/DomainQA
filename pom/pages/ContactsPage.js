import { step } from 'allure-js-commons';

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
    }

    async clickMoreButtonByContact(contact) {
        await step('Click on "More" button.', async () => {
            const moreButton = this.card.filter({ hasText: contact }).getByRole('button', { name: 'More' });
            await moreButton.click();
        });
    }

    async clickViewFullInfoButton() {
        await step('Click on "View full info" button.', async () => {
            await this.viewFullInfoButton.click();
        });
    }

    async getCardByName(header, expectedValues) {
        const card = this.card.filter({ hasText: header });

        // Extract and verify each field in the card content based on expected values
        for (const [key, value] of Object.entries(expectedValues)) {
            if (value) {
                // Only check if value is not empty
                const fieldLocator = card.locator(`text=${value}`);
                const fieldExists = await fieldLocator.isVisible();
                if (!fieldExists) {
                    throw new Error(`Field with value "${value}" for key "${key}" not found in the card.`);
                }
            }
        }
        console.log('All fields match the expected values.');
    }
}
