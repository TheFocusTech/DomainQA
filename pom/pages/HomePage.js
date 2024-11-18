import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';

export default class HomePage {
    constructor(page) {
        this.page = page;

        this.domainSearchInput = this.page.getByPlaceholder('Search domain').first();
        this.searchButton = this.page.getByRole('button', { name: 'Search' }).nth(1);
        this.filterButton = this.page.getByLabel('Advanced search').first();
        this.advancedSearchHeading = this.page.getByText('Advanced search');
        this.hideRegisteredTogle = this.page.getByText('Hide registered');
        this.filterByTLDField = this.page.getByText('Filter by TLD');

        this.numberOfSelectedTLDs = this.page.getByText('Selected (0) TLDs');
        this.clearAllButton = this.page.locator('button').filter({ hasText: 'Clear all' });
        this.allSwipper = this.page.locator('button').filter({ hasText: /^All$/ });
        this.absSwipperButton = this.page.locator('.tld-item_tld-item__lztWX');
        this.defaultCategory = this.page.getByText('All TLDs');
        this.abcSwiper = this.page.getByText('Allabcdefghijklmnopqrstuvwxyz');
        this.nextArrow = this.page.locator('path[d="m9 6 6 6-6 6"]');
        this.categoryList = this.page.locator('section.tld-category-list_tld-category-list__item-wrapper__lzJ5f');
        this.resetButton = this.page.locator('button').filter({ hasText: 'Reset' });
        this.applyButton = this.page.locator('button').filter({ hasText: 'Apply' });
        this.closeButton = this.page.getByLabel('Button');

        this.mainHeading = this.page.locator('main h1');
        this.filterApplyBadge = this.page.locator('span[class*="badge-indicator__counter"]');
        this.resultsList = this.page.locator('div[class*="domains-list-cards"]');
    }

    async fillDomainSearchInput(nameDomain) {
        await step('Fill in "Search domain" input field.', async () => {
            await this.domainSearchInput.fill(nameDomain);
        });
    }

    async clickSearchButton() {
        await step('Click on "Search" button.', async () => {
            await this.searchButton.click();
        });
    }

    async clickFilterButton() {
        await step('Click on "Filter" button.', async () => {
            await this.filterButton.click();
        });
    }

    async verifyHomePage(heading, buttons) {
        await step(`Verify that Home page has "${heading}" heading.`, async () => {
            await expect(this.mainHeading).toHaveText(heading);
        });
        for (const button of buttons) {
            await step(`Verify that Home page has "${button}" button.`, async () => {
                const buttonLocator = this.page.getByRole('button', { name: button }).nth(1);
                await expect(buttonLocator).toBeVisible();
            });
        }
    }

    async clickFilterButton() {
        await step('Click on "Filter" button.', async () => {
            await this.filterButton.click();
        });
    }
}
