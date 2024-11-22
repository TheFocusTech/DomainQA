import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';
import { getRandomArray } from '../../helpers/utils';

export default class AdvancedSearchModal {
    constructor(page) {
        this.page = page;

        this.categoryTLD = (category) => this.page.locator(`//button[span[text()="${category}"]]`);
        this.firstTLD = this.page.locator(
            'section[class*="tld-category-list"]>div:first-child span[class*="choicebox__text"]'
        );
        this.TLDsList = this.page.locator('section[class*="tld-category-list"] span[class*="choicebox__text"]');
        this.randomTLD = (index) =>
            this.page.locator(
                `section[class*="tld-category-list"]>div:nth-child(${index + 1}) span[class*="choicebox__text"]`
            );
        this.applyButton = this.page.locator('button').filter({ hasText: 'Apply' });
        this.advancedSearchHeader = this.page.locator('section[class*="modal-root"] h2');
        this.filterHeader = this.page.locator('span[class*="tld-header_filter-header"]:last-child');
        this.tldSwiperItems = this.page.locator('[class*="tld-swiper_swiper-slide__item"] button');
    }

    async selectCategory(category) {
        await step(`Select Category ${category}`, async () => {
            await this.categoryTLD(category).click({ forse: true });
            await this.firstTLD.waitFor('visible');
        });
    }

    async selectTLDs(category, numberOfTLDs) {
        const listOfTLD = [];
        await step(`Select in ${category} category ${numberOfTLDs} TLDs`, async () => {
            const count = await this.TLDsList.count();
            let listOfTLDIndex = getRandomArray(count, numberOfTLDs);
            for (const index of listOfTLDIndex) {
                const randomTLD = await this.randomTLD(index);
                await randomTLD.click();
                listOfTLD.push(await randomTLD.textContent());
            }
        });
        return listOfTLD;
    }

    async selectSeveralCategoriesAndTLDs(numbersOfCategories, numberOfTLDs) {
        let listOfTLDs = [];
        await step(`Select in ${numbersOfCategories} categories ${numberOfTLDs} TLDs`, async () => {
            const categories = 'abcdefghijklmnopqrstuvwxyz';
            const categoriesIndexArr = getRandomArray(categories.length, numbersOfCategories);

            const categoriesArr = [];
            for (const categoryIndex of categoriesIndexArr) {
                categoriesArr.push(categories[categoryIndex]);
            }

            for (const category of categoriesArr) {
                await this.selectCategory(category);
                await expect(this.firstTLD).toContainText(`.${category}`);
                let listOfTLDOneCategory = await this.selectTLDs(category, numberOfTLDs);
                await expect(this.categoryTLD(category)).toHaveClass(/tld-item_tld-item--selected/);
                listOfTLDs.push(...listOfTLDOneCategory);
            }
        });
        return listOfTLDs;
    }

    async clickApplyButton() {
        await step('Click on "Apply" button.', async () => {
            await this.applyButton.click();
        });
    }

    async getQuantitySelectedTLDs() {
        let headerText = await this.filterHeader.innerText();
        return headerText;
    }

    async getStyleSelectedTLDItem(tldLetter) {
        const tldSwiperItems = await this.tldSwiperItems.all();
        for (const item of tldSwiperItems) {
            const itemName = await item.textContent();
            if (itemName === tldLetter) {
                return item.evaluate((el) => {
                    if (el.className.includes('tld-item--selected')) {
                        const computedStyle = getComputedStyle(el, '::after');
                        return {
                            borderColor: computedStyle.borderColor,
                            backgroundColor: computedStyle.backgroundColor,
                        };
                    }
                });
            }
        }
    }
}
