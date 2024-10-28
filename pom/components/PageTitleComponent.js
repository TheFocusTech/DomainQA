export default class PageTitleComponent {
    constructor(page) {
        this.page = page;

        this.pageTitle = this.page.locator('h1');
    }
}
