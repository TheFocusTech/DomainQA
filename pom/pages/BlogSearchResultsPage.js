import { step } from 'allure-js-commons';

export default class BlogSearchResultsPage {
    constructor(page) {
        this.page = page;

        this.header = this.page.getByRole('heading', { name: 'Search results' });
        this.accordionTrigger = this.page.getByLabel('Accordion slice trigger');
        this.byCategoryTitle = this.page.getByText('By category');
        this.subCategories = this.page.locator('button[class^="button-article_button-article"]');
        this.searchResultHeader = this.page.locator('h2[class^="list_search-result"]');
        this.articleTitle = this.page.locator('a[class^="article-card_blog-article-card__category"]');
        this.categoryCounter = this.page.locator('span[class^="counter-wrapper_counter-wrapper__counter"]');
        this.accordionDropdown = this.page.locator(
            '//div[contains(@class, "accordion-slice_accordion-slice-body__inner")]/parent::div'
        );
        this.categoryButtonList = this.page.locator('div[class^="accordion-segment_accordion-segment"]');
        this.blogBreadcrumbs = this.page.locator('span[class*="breadcrumbs-link__text"]');
    }

    async clickAccordionTrigger() {
        await step('Click on accordion button', async () => {
            await this.accordionTrigger.click();
        });
    }

    async clickBlogBreadcrumbs() {
        await step('Click on "Blog" link in breadcrumbs', async () => {
            await this.blogBreadcrumbs.first().click();
        });
    }
}
