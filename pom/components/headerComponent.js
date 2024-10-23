import { step } from 'allure-js-commons';

export default class HeaderComponent {
    constructor(page) {
        this.page = page;

        this.trash = this.page.getByRole('link', { name: 'Trash' });
    }  
}
