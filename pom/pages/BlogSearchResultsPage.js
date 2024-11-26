import { step } from 'allure-js-commons';

export default class BlogSearchResultsPage {
    constructor(page) {
        this.page = page;

        this.header = page.getByRole('heading', { name: 'Search results' });
        this.accordionTrigger = page.getByLabel('Accordion slice trigger');
        this.byCategoryTitle = page.getByText('By category');
        this.subCategories = page.locator('button[class^="button-article_button-article"]');
        this.searchResultHeader = page.locator('h2[class^="list_search-result"]');
        this.articleTitle = page.locator('a[class^="article-card_blog-article-card__category"]');
        this.categoryCounter = page.locator('span[class^="counter-wrapper_counter-wrapper__counter"]');
        this.accordionDropdown = page.locator(
            '//div[contains(@class, "accordion-slice_accordion-slice-body__inner")]/parent::div'
        );
        this.categoryButtonList = page.locator('div[class^="accordion-segment_accordion-segment"]');
    }

    async accordionTriggerclick() {
        await step('Click on accordion button', async () => {
            await this.accordionTrigger.click();
        });
    }
}
