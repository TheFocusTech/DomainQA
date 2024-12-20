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
        this.modalWindow = this.page.locator('section[class*="modal-root"]');
        this.advancedSearchHeading = this.page.getByText('Advanced search');
        this.hideRegisteredTogle = this.page.getByText('Hide registered');
        this.filterByTLDField = this.page.getByText('Filter by TLD');
        this.clearAllButton = this.page.locator('button').filter({ hasText: 'Clear all' });
        this.allSwipper = this.page.locator('button').filter({ hasText: /^All$/ });
        this.abcSwipperButton = this.page.locator('.swiper-wrapper button[type="button"]');
        this.defaultCategory = this.page.getByText('All TLDs');
        this.nextArrow = this.page.locator('button:has(path[d="m9 6 6 6-6 6"])');
        this.categoryList = this.page.locator('section[class*="tld-category-list_tld-category-list__item-wrapper"]');
        this.resetButton = this.page.locator('button').filter({ hasText: 'Reset' });
        this.closeButton = this.page.getByLabel('Button');
        this.toggleInput = this.page.locator('input[name="hideRegistered"]');
        this.toggleControl = this.page.locator('label div');
        this.letterButton = (letter) => this.page.locator(`button:has(span:text-is("${letter}"))`);
        this.category = this.page.locator('input[name="tld"]+label');
        this.categoryArea = this.page.locator('input[name="tld"]');
        this.selectAllCategoryButton = this.page.locator('button').filter({ hasText: 'Select all Category' });
    }

    async selectCategory(category) {
        await step(`Select Category ${category}`, async () => {
            await this.categoryTLD(category).click({ forse: true });
            await this.firstTLD.waitFor('visible');
        });
    }

    async selectTLDs(category, numberOfTLDs) {
        const listOfTLD = [];
        await step(`In ${category} category select ${numberOfTLDs} TLDs`, async () => {
            await this.TLDsList.last().waitFor({ state: 'visible' });
            const count = await this.TLDsList.count();
            let listOfTLDIndex = getRandomArray(count, numberOfTLDs);
            for (const index of listOfTLDIndex) {
                const randomTLD = await this.randomTLD(index);
                await this.randomTLD(index).waitFor({ state: 'visible' });
                await randomTLD.click();
                listOfTLD.push(await randomTLD.textContent());
            }
        });
        return listOfTLD;
    }

    async selectSeveralCategoriesAndTLDs(numbersOfCategories, numberOfTLDs) {
        let listOfTLDs = [];
        await step(`In ${numbersOfCategories} categories select ${numberOfTLDs} TLDs`, async () => {
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

    async getAbcSwipperButtonTexts() {
        let buttonTexts = await this.abcSwipperButton.allTextContents();
        return buttonTexts;
    }

    async clickToggleHideRegistered() {
        await step('Activate the toggle "Hide registered"', async () => {
            const value = await this.toggleInput.evaluate((el) => {
                return el.value;
            });
            if (value === 'false') {
                await this.toggleControl.click();
            }
        });
    }

    async clickLetterButton(letter) {
        if (letter === 'z') {
            await step(`Go to the end of ABC`, async () => {
                for (let j = 0; j < 9; j++) {
                    await this.nextArrow.click();
                }
            });
        }
        await step(`Click on "${letter.toUpperCase()}" button.`, async () => {
            await this.letterButton(letter).click();
        });
    }

    async getCategorysList() {
        const categorys = await this.category.allTextContents();
        return categorys;
    }

    async clickSelectAllCategoryButton() {
        await step('Click on "Select All Category" button.', async () => {
            await this.selectAllCategoryButton.click();
        });
    }

    async clickСlearAllButton() {
        await step('Click on "Select All Category" button.', async () => {
            await this.clearAllButton.click();
        });
    }
}
