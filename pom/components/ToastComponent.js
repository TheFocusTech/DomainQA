export default class ToastComponent {
    constructor(page) {
        this.page = page;

        this.toastBody = this.page.locator('.Toastify__toast-body');
        this.promptHZCreated = this.page.getByText('Hosted zone created');
    }
}
