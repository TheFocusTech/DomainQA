import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';

export default class BlogSearchResultsPage {
    constructor(page) {
        this.page = page;

        this.header = page.getByRole('heading', { name: 'Search results' });
        this.accordionTrigger = page.getByLabel('Accordion slice trigger');
        this.byCategoryTitle = page.locator('div.accordion-slice_accordion-slice-header__slot__AlUo4');
        this.subCategories = page.locator('span.button-article_button-article__text__ktdSK');
        this.byCategoryAllCategoryBtn = page.getByRole('button', { name: 'All Categories' });
        this.byCategoryDomainNamesBtn = page.getByRole('button', { name: 'Domain Names' });
        this.byCategoryWebsitesHostingBtn = page.getByRole('button', { name: 'Websites & Hosting' });
        this.byCategoryMarketingBtn = page.getByRole('button', { name: 'Marketing' });
        this.searchResultHeader = page.locator('//*[@id="__next"]/main/section/div/div[2]/div/h2');
        this.articleTitle = page.locator('a.article-card_blog-article-card__category__bVkfB');
        this.articleCounter = page.locator('span.counter-wrapper_counter-wrapper__counter__S15Z5');
        this.accordionDropdown = page.locator('header.accordion-slice_accordion-slice-header__c6ej2');
    }

    async getCategoryList() {
        await this.subCategories.first().waitFor();
        return await this.subCategories.allInnerTexts();
    }

    async getArticleQuantity() {
        await this.articleCounter.first().waitFor();
        return await this.articleCounter.allInnerTexts();
    }

    async accordionTriggerclick() {
        await step('Click on accordion button', async () => {
            await this.accordionTrigger.click();
        });
    }

    async clickByCategoryAllCategory() {
        await step('Click on All Categories under By category', async () => {
            await this.byCategoryAllCategoryBtn.click();
        });
    }

    async clickByCategoryDomainNames() {
        await step('Click on DomainNames under By category', async () => {
            await this.byCategoryDomainNamesBtn.click();
        });
    }

    async clickByCategoryWebsitesHosting() {
        await step('Click on Websites & Hosting under By category', async () => {
            await this.byCategoryWebsitesHostingBtn.click();
        });
    }

    async clickByCategoryMarkiting() {
        await step('Click on Marketing under By category', async () => {
            await this.byCategoryMarketingBtn.click();
        });
    }

    async verifyArticleTitle(expectedTitle) {
        const count = await this.articleTitle.count();
        for (let i = 0; i < count; i++) {
            const titleText = await this.articleTitle.nth(i).textContent();
            expect(titleText?.trim()).toBe(expectedTitle);
        }
    }

    async verifyArticleQty(expectedQty) {
        await this.searchResultHeader.waitFor();
        const searchHeaderText = await this.searchResultHeader.textContent();
        expect(searchHeaderText).toContain(expectedQty.replace(/[()]/g, '').trim());
    }
}
