import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import {
    QASE_LINK,
    GOOGLE_DOC_LINK,
    URL_ENDPOINT,
    INPUT_SEARCH_PART,
    INPUT_SEARCH_RELEVANT_NAME,
    BLOG_BY_CATEGORY,
    INPUT_SEARCH,
} from '../testData';
import { loginUser } from '../helpers/preconditions';

test.describe('Blog', () => {
    test('TC_06_08 | Verify Autocomplete Suggestions Displayed for Partial Search Input', async ({
        page,
        headerComponent,
        loginPage,
        blogPage,
    }) => {
        await tags('Blog', 'Positive');
        await severity('normal');
        await description(
            'Verify that user can see autocomplete suggestions correspond to the entered letters in Blog'
        );
        await issue(`${QASE_LINK}/01-29`, 'Blog');
        await tms(`${GOOGLE_DOC_LINK}wu2onbnm0a9o`, 'ATC_06_08');
        await epic('Blog');

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await headerComponent.clickBlogButton();
        await page.waitForURL(URL_ENDPOINT.blogPage);

        await step(
            'Verify that autocomplete suggestions that match the input are displayed in popup search window',
            async () => {
                await blogPage.fillBlogSearchInput(INPUT_SEARCH_PART);
                await blogPage.waitForBlogSearchPopup();
                await expect(blogPage.blogSearchPopup).toContainText(new RegExp(INPUT_SEARCH_PART, 'i'));
            }
        );
    });

    test('TC_06_02 | Verify Search Results and Search Field Behaviors', async ({
        page,
        headerComponent,
        loginPage,
        blogPage,
    }) => {
        await tags('Blog', 'Positive');
        await severity('normal');
        await description('Verify Search Results and Search Field Behaviors with relevant request');
        await issue(`${QASE_LINK}/01-29`, 'Blog');
        await tms(`${GOOGLE_DOC_LINK}hgj95glsg8jt`, 'ATC_06_02');
        await epic('Blog');

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await headerComponent.clickBlogButton();
        await page.waitForURL(URL_ENDPOINT.blogPage);

        await blogPage.fillBlogSearchInput(INPUT_SEARCH_RELEVANT_NAME);
        await blogPage.waitForBlogSearchPopup();

        await step('Verify Search Results and Search Field Behaviors with relevant request', async () => {
            const results = blogPage.blogSearchPopupList;
            await results.first().waitFor({ state: 'visible', timeout: 5000 });

            const count = await results.count();
            expect(count).toBeGreaterThan(0);

            for (let i = 0; i < count; i++) {
                const text = await results.nth(i).textContent();

                const containsSearchTerm = new RegExp(INPUT_SEARCH_RELEVANT_NAME, 'i').test(text);
                expect(containsSearchTerm).toBe(true);
            }
        });
    });

    test('TC_06_04 | Verify switching between Blog articles By category', async ({
        page,
        headerComponent,
        loginPage,
        blogPage,
        blogSearchResultsPage,
    }) => {
        await tags('Blog', 'Positive');
        await severity('normal');
        await description('Verify switching between Blog articles By category');
        await issue(`${QASE_LINK}/01-29`, 'Blog');
        await tms(`${GOOGLE_DOC_LINK}olsm3r5thbf5`, 'ATC_06_04');
        await epic('Blog');

        test.slow();
        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await headerComponent.clickBlogButton();
        await page.waitForURL(URL_ENDPOINT.blogPage);
        await blogPage.fillBlogSearchInput(INPUT_SEARCH.a);
        await blogPage.clickSearchBtn();
        await page.goto(`${process.env.URL}/blog/search?search=${INPUT_SEARCH.a}`);

        await step('Verify title of By category is on the page.', async () => {
            await expect(blogSearchResultsPage.header).toBeVisible();
            await expect(blogSearchResultsPage.byCategoryTitle).toBeVisible();
            await expect(blogSearchResultsPage.byCategoryTitle).toContainText(BLOG_BY_CATEGORY.title);
        });
        await step('Verify the drop-down list visible and contains sub-categories.', async () => {
            for (const key in BLOG_BY_CATEGORY) {
                const expectedCategories = BLOG_BY_CATEGORY[key];
                if (key == 'title') continue;
                const isCategoryVisible = await blogSearchResultsPage.subCategories
                    .locator(`text=${expectedCategories}`)
                    .isVisible();

                expect(isCategoryVisible).toBe(true);
            }
        });
        await step('Verify the drop-down category list is NOT visible.', async () => {
            await blogSearchResultsPage.accordionTriggerclick();

            await expect(blogSearchResultsPage.accordionDropdown).not.toHaveClass(
                'accordion-slice_accordion-slice-body--active__EfJPE'
            );
        });
        await step('Verify the quantity and title of selected category.', async () => {
            await blogSearchResultsPage.accordionTriggerclick();

            await step('Verify the category q-ty equal header q-ty.', async () => {
                const count = await blogSearchResultsPage.categoryBtnList.count();
                for (let i = 0; i < count; i++) {
                    const innerText = await blogSearchResultsPage.categoryBtnList.nth(i).allTextContents();
                    let [category, count] = innerText[0].split('(');
                    let categoryCount = count.replace(')', '');
                    await blogSearchResultsPage.subCategories.nth(i).click();
                    await blogSearchResultsPage.searchResultHeader.waitFor({ state: 'visible' });
                    const searchResultHeaderText = await blogSearchResultsPage.searchResultHeader.allTextContents();
                    let headerCount = searchResultHeaderText[0].match(/\d+/)[0];
                    console.log(headerCount);

                    await expect(categoryCount).toEqual(headerCount);

                    await step(
                        `Verify the title of selected articles are correct for category:${category}.`,
                        async () => {
                            await blogSearchResultsPage.articleTitle.first().waitFor({ state: 'visible' });
                            const articles = await blogSearchResultsPage.articleTitle.allTextContents();
                            for (const article of articles) {
                                if (category == 'All Categories') continue;
                                await expect(article).toEqual(category);
                            }
                        }
                    );
                }
            });
        });
    });
});
