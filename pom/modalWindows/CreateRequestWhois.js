export default class createRequestWhois {
    constructor(page) {
        this.page = page;

        this.createRequestWhoisTitle = this.page.getByPlaceholder('Create request (WHOIS)');
    }
}
