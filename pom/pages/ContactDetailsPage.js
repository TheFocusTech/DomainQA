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
        this.userInfoData = this.page.locator('div.group-panel__content>div');
    }

    async clickBackToAccountSettingsButton() {
        await step('Click on "Back to Account settings" button.', async () => {
            await this.backToAccountSettingsButton.click();
        });
    }

    async getUserInformation() {
        const actualData = {};
        await step('Retrieve user information from the "Account settings" page', async () => {
            for (const data of await this.userInfoData.all()) {
                const key = await data.locator('>p').textContent();
                const value = await data.locator('div > p').textContent();
                actualData[key.toLowerCase()] = value;
            }
            const countryCode = actualData.country;
            if (countryCode) {
                const countryCodeMap = {
                    FR: 'France',
                    US: 'United States',
                    DE: 'Germany',
                    CA: 'Canada',
                    KN: 'St. Kitts and Nevis',
                    // You can add other countries and their codes as needed.
                };
                actualData.country = countryCodeMap[countryCode] || 'UNKNOWN';
            } else {
                console.warn('"Country" is missing in User General Info');
            }
        });
        return actualData;
    }
}
