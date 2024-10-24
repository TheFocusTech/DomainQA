import { step } from 'allure-js-commons';

export default class HostedZonePage {
    constructor(page) {
        this.page = page;
    }

    async clickOnHostedZoneName(name) {
        await step('Click on hosted zone name.', async () => {
            await this.page.getByTitle(name).click();
        });
    }
}
