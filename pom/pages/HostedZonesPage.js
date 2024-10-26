import { step } from 'allure-js-commons';

export default class HostedZonesPage {
    constructor(page) {
        this.page = page;

        this.searchInput = this.page.getByPlaceholder('Search by name');
    }

    async waitForHostedZoneIsVisible(name) {
        await step(`Validate that hosted zone '${name}' is visible.`, async () => {
            await this.page.waitForSelector(`table a:has-text("${name}")`, { state: 'visible' });
        });
    }
}
