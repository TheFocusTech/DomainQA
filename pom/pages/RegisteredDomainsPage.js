import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export default class RegisteredDomainsPage {
    constructor(page) {
        this.page = page;

        this.mainHeading = this.page.locator('main h1');
        this.alertTitle = this.page.locator('main h2');
        this.alertDescription = this.page.locator('main p[class*="description"]');
        this.getNewDomainButton = this.page.getByRole('button', { name: 'Get New Domain' });
    }

    async verifyRegisteredDomainsPage(heading, title, description, buttons) {
        await step(`Verify that Registered Domains page has "${heading}" heading.`, async () => {
            await expect(this.mainHeading).toContainText(heading);
        });
        await step(`Verify that Registered Domains page has "${title}" text.`, async () => {
            await expect(this.alertTitle).toHaveText(title);
        });
        await step(`Verify that Registered Domains page has "${description}" text.`, async () => {
            await expect(this.alertDescription).toHaveText(description);
        });
        for (const button of buttons) {
            await step(`Verify that Registered Domains page has "${button}" button.`, async () => {
                const buttonLocator = this.page.getByRole('button', { name: button, exact: true });
                const linkLocator = this.page.getByRole('link', { name: button, exect: true });
                await expect(buttonLocator.or(linkLocator).first()).toBeVisible();
            });
        }
    }

    async clickGetNewDomainButton() {
        await step('Click on "Get new domain" button.', async () => {
            await this.getNewDomainButton.click();
        });
    }
}
