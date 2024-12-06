import { step } from 'allure-js-commons';

export default class BlogArticlePage {
    constructor(page) {
        this.page = page;

        this.buttonsArticleList = this.page.locator('button[class^="button-article"]');
        this.subArticlesList = this.page.locator(
            'div[class^="article_article__body"] div[class^="article-text_article-text"]'
        );
        this.article = this.page.locator('div[class^="article_article__body"]');
    }

    async clickButtonsArticleList(index) {
        await step('Click on article button in sidebar menu', async () => {
            await this.buttonsArticleList.nth(index).click();
        });
    }
}
