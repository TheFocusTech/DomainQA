import { step } from 'allure-js-commons';

export default class DeleteDNSmodal {
    constructor(page) {
        this.page = page;

        this.deleteDNSbutton = page.locator('#root-portal button').filter({ hasText: 'Delete' });
    }

    async clickDeleteDNSbutton() {
        await step('Confirm deletion by clicking “Delete” button', async () => {
            await this.deleteDNSbutton.click();
        });
    }
}
