import { step } from 'allure-js-commons';

export default class createRequestWhois {
    constructor(page) {
        this.page = page;

        this.createRequestWhoisTitle = this.page.getByPlaceholder('Create request (WHOIS)');
    }
}
