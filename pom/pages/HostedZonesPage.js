import { step } from 'allure-js-commons';

export default class HostedZonesPage {
    constructor(page) {
        this.page = page;

        this.searchInput = this.page.getByPlaceholder('Search by name');
        this.createHostedZoneButton = this.page.getByRole('button', { name: 'Create hosted zone' });
        this.hostedZonesHeader = this.page.getByRole('heading', { name: 'Hosted Zones' });
        this.breadcrumbMenuHostedZone = this.page.locator('button[class*="button-icon-overlay"]');
        this.deleteHostedZoneModal = this.page.locator('section[role="dialog"]');
        this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
    }

    async waitForHostedZoneIsVisible(name) {
        await step(`Validate that hosted zone '${name}' is visible.`, async () => {
            await this.page.waitForSelector(`table a:has-text("${name}")`, { state: 'visible' });
        });
    }

    async clickOnHostedZoneName(name) {
        await step('Click on hosted zone name.', async () => {
            await this.page.getByTitle(name).click();
        });
    }

    async clickCreateHostedZoneButton() {
        await step('Click on "Create hosted zone" button.', async () => {
            await this.createHostedZoneButton.click();
        });
    }

    async clickBreadcrumbMenuHostedZone() {
        await step('Click on breadcrumb menu near hosted zone.', async () => {
            await this.breadcrumbMenuHostedZone.click();
        });
    }

    async clickDeleteButton() {
        await step('Click on "Create hosted zone" button.', async () => {
            await this.deleteButton.click();
        });
    }
}
