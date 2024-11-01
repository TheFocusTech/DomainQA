import { step } from 'allure-js-commons';

export default class BlogPage {
    constructor(page) {
        this.page = page;

        this.blogSearchInput = this.page.getByPlaceholder('Enter the search term');
        this.searchButton = this.page.getByRole('button', { name: 'Search' }).first();
        this.searchResultMessage = this.page.locator('h2:has-text("results for")');
    }

    async fillBlogSearchInput(blogSearchItem) {
        await step('Fill in Search input field with random string.', async () => {
            await this.blogSearchInput.fill(blogSearchItem);
        });
    }

    async clickSearchButton() {
        await step('Click on Search button.', async () => {
            await this.searchButton.click();
        });
    }
}
