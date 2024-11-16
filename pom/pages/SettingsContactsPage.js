import { step } from 'allure-js-commons';
import { delay } from '../../helpers/utils';

export default class SettingsContactsPage {
    constructor(page) {
        this.page = page;

        this.moreButton = this.page.getByRole('button', { name: 'More', exact: true });
        this.moreDropdownMenu = this.page.locator('ul.menu-list_menu-list-items__gM9KR');
        this.viewFullInfoOption = this.moreDropdownMenu.locator('li').filter({ hasText: 'View full info' });
        this.userInfoData = this.page.locator('div.group-panel__content>div');
    }

    async clickMoreButton() {
        await step('Click on the "More" button.', async () => {
            await this.moreButton.first().click();
        });
    }

    async selectViewFullInfo() {
        await step('Click the "View full info" from dropdown menu', async () => {
            this.viewFullInfoOption.click();
            await delay(1000);
        });
    }

    async getUserInformationMap() {
        const nameValueMap = new Map();
        await step('Retrieve user information from the "Account settings" page', async () => {
            for (const data of await this.userInfoData.all()) {
                const name = await data.locator('>p').textContent();
                const value = await data.locator('div > p').textContent();
                nameValueMap.set(name, value);
            }
            const countryCode = nameValueMap.get('Country');
            if (countryCode) {
                const countryCodeMap = {
                    FR: 'France',
                    US: 'United States',
                    DE: 'Germany',
                    CA: 'Canada',
                    // Можно добавить остальные страны и их коды по необходимости
                };

                const countryName = countryCodeMap[countryCode] || 'UNKNOWN';
                nameValueMap.set('Country', countryName);
            } else {
                console.warn('"Country" is missing in User General Info');
            }
        });
        return nameValueMap;
    }
}
