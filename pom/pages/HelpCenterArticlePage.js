import { step } from 'allure-js-commons';

export default class HelpCenterArticlePage {
    constructor(page) {
        this.page = page;

        this.breadcrumbs = this.page.locator('a .breadcrumbs-link_breadcrumbs-link__text__y9WPv').nth(2);
        this.hiddenHeader = this.page.locator('div[class="accordion-slice_accordion-slice__C6mue"] div[class="accordion-slice_accordion-slice-body__a8TY_"]');
        this.hiddenHeaderButton = this.page.locator('xpath=//div[@class="accordion-slice_accordion-slice__C6mue"]/div[@class="accordion-slice_accordion-slice-body__a8TY_"]/../header/button').nth(0);
        this.headerArticles = this.page.locator('.accordion-slice_accordion-slice-body__inner__LliMT .accordion-slice_accordion-slice__C6mue>header[class="accordion-slice_accordion-slice-header__c6ej2"]');
        this.subheadings = this.page.locator('div[class="accordion-slice_accordion-slice__C6mue"] div[class="accordion-slice_accordion-slice-body__a8TY_ accordion-slice_accordion-slice-body--active__EfJPE"] a');
        this.headerH1 = this.page.locator('.article_article__g4Mvt h1');        
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