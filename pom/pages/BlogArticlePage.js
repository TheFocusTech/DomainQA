export default class BlogArticlePage {
    constructor(page) {
        this.page = page;

        this.buttonsArticleList = this.page.locator('button[class^="button-article"]');
        this.subArticlesList = this.page.locator(
            'div[class^="article_article__body"] div[class^="article-text_article-text"]'
        );
        this.article = this.page.locator('div[class^="article_article__body"]');
    }
}
