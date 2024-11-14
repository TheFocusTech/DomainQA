import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import {
    QASE_LINK,
    GOOGLE_DOC_LINK,
    URL_ENDPOINT,
    INPUT_SEARCH_PART,
    BLOG_SEARCH_RESULTS,
    BLOG_SEARCH,
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

        await blogPage.fillBlogSearchInput(BLOG_SEARCH[0]);
        await blogPage.clickSearchBtn();
        await page.goto(`${process.env.URL}/blog/search?search=${BLOG_SEARCH[0]}`);

        await step('Verify title of By category is on the page.', async () => {
            await expect(blogSearchResultsPage.header).toBeVisible();
            await expect(blogSearchResultsPage.byCategoryTitle).toBeVisible();
            await expect(blogSearchResultsPage.byCategoryTitle).toContainText(BLOG_SEARCH_RESULTS.title);
        });

        await step('Verify the drop-down list visible and contains sub-categories.', async () => {
            const byCategoryDropdown = await blogSearchResultsPage.getCategoryList();
            const expectedCategories = BLOG_SEARCH_RESULTS.subcategories;
            for (const category of expectedCategories) {
                expect(byCategoryDropdown).toContain(category);
            }
        });
        await blogSearchResultsPage.accordionTriggerclick();
        await step('Verify the drop-down category list is NOT visible.', async () => {
            await expect(blogSearchResultsPage.accordionDropdown).not.toHaveClass(
                'button.accordion-slice_accordion-slice-header__trigger--active__xgc2K'
            );
        });
        await blogSearchResultsPage.accordionTriggerclick();
        const articleQty = await blogSearchResultsPage.getArticleQuantity();
        await step(
            `Verify ${BLOG_SEARCH_RESULTS.subcategories[0]} has same number of article as search header.`,
            async () => {
                await blogSearchResultsPage.verifyArticleQty(articleQty[0]);
            }
        );

        await blogSearchResultsPage.clickByCategoryDomainNames();
        await step(
            `Verify ${BLOG_SEARCH_RESULTS.subcategories[1]} has same number of article as search header.`,
            async () => {
                await blogSearchResultsPage.verifyArticleQty(articleQty[1]);
            }
        );
        await step(`Verify all displayed articles have title ${BLOG_SEARCH_RESULTS.subcategories[1]}`, async () => {
            await blogSearchResultsPage.verifyArticleTitle(BLOG_SEARCH_RESULTS.subcategories[1]);
        });

        await blogSearchResultsPage.clickByCategoryWebsitesHosting();
        await step(
            `Verify ${BLOG_SEARCH_RESULTS.subcategories[2]} has same number of article as search header.`,
            async () => {
                await blogSearchResultsPage.verifyArticleQty(articleQty[2]);
            }
        );
        await step(`Verify all displayed articles have title ${BLOG_SEARCH_RESULTS.subcategories[2]}.`, async () => {
            await blogSearchResultsPage.verifyArticleTitle(BLOG_SEARCH_RESULTS.subcategories[2]);
        });
        await blogSearchResultsPage.clickByCategoryMarkiting();
        await step(
            `Verify ${BLOG_SEARCH_RESULTS.subcategories[3]} has same number of article as search header.`,
            async () => {
                await blogSearchResultsPage.verifyArticleQty(articleQty[3]);
            }
        );
        await step(`Verify all displayed articles have title ${BLOG_SEARCH_RESULTS.subcategories[3]}.`, async () => {
            await blogSearchResultsPage.verifyArticleTitle(BLOG_SEARCH_RESULTS.subcategories[3]);
        });
    });
});
