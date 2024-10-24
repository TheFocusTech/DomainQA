import { step } from 'allure-js-commons';

export default class DnsRecordModal {
    constructor(page) {
        this.page = page;

        this.name = this.page.getByPlaceholder('Enter name');
        this.comment = this.page.getByPlaceholder('Optional');
        this.cancelButton = this.page.getByText('Cancel');
        this.saveButton = this.page.getByText('Save');
        this.addressIPv4 = this.page.getByPlaceholder('Enter IPv4-address');
        this.addressIPv6 = this.page.getByPlaceholder('Enter IPv6-address');
        this.target = this.page.getByPlaceholder('Enter target');
        this.iconButtonX = this.page.locator('[role="dialog"] button[class*="button-icon-overlay_"]');
    }

    async clickSaveButton() {
        await step('Click save button', async () => {
            await this.saveButton.click();
        });
    }

    async clickCancelButton() {
        await step('Click cancel button', async () => {
            await this.cancelButton.click();
        });
    }

    async clickXButton() {
        await step('Click X button', async () => {
            await this.iconButtonX.click();
        });
    }
}
