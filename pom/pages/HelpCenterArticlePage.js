import { step } from 'allure-js-commons';

export default class HelpCenterArticlePage {
    constructor(page) {
        this.page = page;

        this.breadcrumbs = this.page.locator('a span[class*="breadcrumbs-link_breadcrumbs-link__text"]').nth(2);
        this.hiddenHeader = this.page.locator(
            'div[class*="accordion-slice_accordion-slice__"] div[class="accordion-slice_accordion-slice-body__a8TY_"]'
        );
        this.hiddenHeaderButton = this.page
            .locator(
                'xpath=//div[contains(@class, "accordion-slice_accordion-slice__")]/div[@class="accordion-slice_accordion-slice-body__a8TY_"]/../header/button'
            )
            .nth(0);
        this.headerArticles = this.page.locator(
            'div[class*="accordion-slice_accordion-slice-body__inner__"] div[class*="accordion-slice_accordion-slice__"]>header[class*="accordion-slice_accordion-slice-header__"]'
        );
        this.subheadings = this.page.locator(
            'div[class*="accordion-slice_accordion-slice__"] div[class*="accordion-slice_accordion-slice-body__a8TY_ accordion-slice_accordion-slice-body--active__"] a'
        );
        this.headerH1 = this.page.locator('article[class*="article_article__"] h1');
        this.activeArticleHeader = page.locator('[class*="button-article--m button-article_button-article--active"]');
    }

    async clickHiddenHeaderButton() {
        await this.hiddenHeaderButton.click();
    }
    async allInnerTextsHeaderArticles() {
        await step('Expand the subheadings and find their titles.', async () => {
            await this.headerArticles.first().waitFor({ state: 'visible' });
        });
        return await this.headerArticles.allInnerTexts();
    }
    async allInnerTextsSubheadings() {
        return await this.subheadings.allInnerTexts();
    }
    async countSubheadings() {
        return await this.subheadings.count();
    }
    async innerTextHeaderH1() {
        await this.headerH1.waitFor({ state: 'visible' });
        return await this.headerH1.innerText();
    }
}
