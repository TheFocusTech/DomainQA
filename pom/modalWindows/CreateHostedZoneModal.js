import { step } from 'allure-js-commons';

export default class CreateHostedZoneModal {
    constructor(page) {
        this.page = page;

        this.hostedZoneDomainNameInput = this.page.getByPlaceholder('Enter your domain');
        this.createButton = this.page.locator('button').filter({ hasText: /^Create$/ });

        this.cancelButton = this.page.locator('button').filter({ hasText: /^Cancel$/ });
    }

    async fillHostedZoneDomainNameInput(name) {
        await step('Fill in "Domain" input field.', async () => {
            await this.hostedZoneDomainNameInput.fill(name);
        });
    }
    async clickCreateButton() {
        await step('Click on "Create" hosted zone button.', async () => {
            await this.createButton.click();
        });
    }
    async clickCancelButton() {
        await step('Click on "Cancel" button.', async () => {
            await this.cancelButton.click();
        });
    }
}
