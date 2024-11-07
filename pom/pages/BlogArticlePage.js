import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export default class BlogArticlePage {
    constructor(page) {
        this.page = page;

        this.buttonsArticleList= this.page.locator('button[class^="button-article"]');
    }

}
