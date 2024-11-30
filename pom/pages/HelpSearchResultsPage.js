import { step } from 'allure-js-commons';

export default class HelpSearchResultsPage {
    constructor(page) {
        this.page = page;

        this.allCategoriesButton = this.page.getByRole('button', { name: 'All Categories' });
        this.categoriesButtons = this.page.locator('[class*= "accordion-segment_accordion-segment"]');
        this.accordionByCategoryLabel = this.page.getByLabel('Accordion slice trigger');
        this.accordionByCategoryButton = this.page.locator(
            '[class*="accordion-slice_accordion-slice-header"] > button'
        );
        this.headerTextVisible = this.page.locator('div[class*="search-results_search-results__content"]');
        this.headerText = this.page.locator('h2[class*="search-results_search-results__title"]');
        this.articlesList = this.page.locator('.article-snippet__title > a');
        this.accordionButton = this.page.locator('[class*="accordion-slice_accordion-slice__"] button');
        this.accordionArticleHeader = this.page.locator('div[class*="accordion-segment_accordion-segment__"] a');
    }

    async allInnerTextsCategoriesButtons() {
        return await this.categoriesButtons.allInnerTexts();
    }

    async clickAccordionByCategoryLabel() {
        await step('Click on "By category" accordion.', async () => {
            await this.accordionByCategoryLabel.click();
        });
    }

    async innerTextsHeaderText() {
        await this.headerTextVisible.waitFor({ state: 'visible' });
        return await this.headerText.allInnerTexts();
    }

    async clickRandomArticle() {
        await this.articlesList.first().waitFor({ state: 'visible' });
        const articleCount = await this.articlesList.count();
        const randomIndex = Math.floor(Math.random() * articleCount);
        const nameArticle = await this.articlesList.nth(randomIndex).innerText();
        await step('Open a random article:', async () => {
            await this.articlesList.nth(randomIndex).click();
        });
        return nameArticle;
    }
    async clickAccordionButton() {
        await step('Click on category button.', async () => {
            await this.accordionButton.first().click({ force: true });
        });
    }

    async clickAccordionArticleHeader() {
        await step('Click on article header.', async () => {
            const text = await this.accordionArticleHeader.innerText();
            console.log(text);
            await this.accordionArticleHeader.click();
        });
    }
}
