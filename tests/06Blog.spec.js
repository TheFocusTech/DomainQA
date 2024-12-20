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
    BLOG_SEARCH_RESULT_MESSAGE,
} from '../testData';
import { loginUser } from '../helpers/preconditions';
import { getRandomCharacters } from '../helpers/utils';

test.describe('Blog', () => {
    test('TC_06_06 |Verify Autocomplete Suggestions Displayed for Partial and Empty Search Input', async ({
        page,
        headerComponent,
        loginPage,
        blogPage,
        blogSearchResultsPage,
    }) => {
        await tags('Blog', 'Positive');
        await severity('normal');
        await description(
            'Verify that user can see autocomplete suggestions that correspond to the entered letters in the Blog search, as well as previous search history when the search field is empty.'
        );
        await issue(`${QASE_LINK}/01-29`, 'Blog');
        await tms(`${GOOGLE_DOC_LINK}wu2onbnm0a9o`, 'ATC_06_06');
        await epic('Blog');
        test.slow();

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await headerComponent.clickBlogButton();
        await page.waitForURL(URL_ENDPOINT.blogPage);
        await blogPage.fillBlogSearchInput(INPUT_SEARCH_PART);
        await blogPage.waitForBlogSearchPopup();

        await step(
            'Verify that autocomplete suggestions that match the input are displayed in popup search window',
            async () => {
                await expect(blogPage.blogSearchPopup).toContainText(new RegExp(INPUT_SEARCH_PART, 'i'));
            }
        );

        await blogPage.clickSearchButton();
        await page.waitForURL(`${process.env.URL}/blog/search?search=${INPUT_SEARCH_PART}`);
        await blogSearchResultsPage.clickBlogBreadcrumbs();
        await page.waitForURL(`${process.env.URL}/blog`);
        await blogPage.fillBlogSearchInput('');
        await blogPage.waitForBlogSearchPopup();

        await step('Verify that "Recent Searches" are displayed in popup search window', async () => {
            await expect(blogPage.rescentSearchHeading.first()).toHaveText('Recent Searches');
        });
    });

    test('TC_06_02 | Verify Search Results and Search Field Behaviors', async ({
        page,
        headerComponent,
        loginPage,
        blogPage,
        blogSearchResultsPage,
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
        await blogPage.clickSearchButton();
        await page.waitForURL(`${process.env.URL}/blog/search?search=${INPUT_SEARCH_RELEVANT_NAME}`);
        await blogSearchResultsPage.clickBlogBreadcrumbs();
        await page.waitForURL(`${process.env.URL}/blog`);
        await blogPage.fillBlogSearchInput('');
        await blogPage.waitForBlogSearchPopup();

        await step('Verify that "Recent Searches" are displayed in popup search window', async () => {
            await expect(blogPage.rescentSearchHeading.first()).toHaveText('Recent Searches');
        });
        await blogPage.clickClearAllButton();
        await step('Verify that "Recent Searches" are not displayed in popup search window', async () => {
            await expect(blogPage.rescentSearchHeading.filter({ hasText: 'Recent Searches' })).not.toBeVisible();
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
        await blogPage.clickSearchButton();
        await page.waitForURL(`${process.env.URL}/blog/search?search=${INPUT_SEARCH.a}`);

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
            await blogSearchResultsPage.clickAccordionTrigger();

            await expect(blogSearchResultsPage.accordionDropdown).not.toHaveClass(
                /accordion-slice_accordion-slice-body--active/
            );
        });
        await step('Verify the quantity and title of selected category.', async () => {
            await blogSearchResultsPage.clickAccordionTrigger();

            await step('Verify the category q-ty equal header q-ty.', async () => {
                await page.waitForTimeout(5000);
                const count = await blogSearchResultsPage.categoryButtonList.count();
                for (let i = 0; i < count; i++) {
                    const innerText = await blogSearchResultsPage.categoryButtonList.nth(i).allTextContents();
                    let [category, count] = innerText[0].split('(');
                    let categoryCount = count.replace(')', '');
                    await blogSearchResultsPage.subCategories.nth(i).click();
                    await blogSearchResultsPage.searchResultHeader.waitFor({ state: 'visible' });
                    await page.waitForLoadState('networkidle');
                    const searchResultHeaderText = await blogSearchResultsPage.searchResultHeader.allTextContents();
                    let headerCount = searchResultHeaderText[0].match(/\d+/)[0];

                    expect(categoryCount).toEqual(headerCount);

                    await step(
                        `Verify the title of selected articles are correct for category:${category}.`,
                        async () => {
                            await blogSearchResultsPage.articleTitle.first().waitFor({ state: 'visible' });
                            const articles = await blogSearchResultsPage.articleTitle.allTextContents();
                            for (const article of articles) {
                                if (category == 'All Categories') continue;
                                expect(article).toEqual(category);
                            }
                        }
                    );
                }
            });
        });
    });

    test('TC_06_05 | Verify sidebar presence and header position on the blog page when switching between headings in the selected article', async ({
        page,
        headerComponent,
        loginPage,
        blogPage,
        blogArticlePage,
    }) => {
        await tags('Blog', 'Positive');
        await severity('normal');
        await description(
            'Verify that user can see autocomplete suggestions correspond to the entered letters in Blog'
        );
        await issue(`${QASE_LINK}/01-29`, 'Blog');
        await tms(`${GOOGLE_DOC_LINK}p1toz82dzosx`, 'ATC_06_05');
        await epic('Blog');
        test.slow();

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await headerComponent.clickBlogButton();
        await page.waitForURL(URL_ENDPOINT.blogPage);

        await step('Click on the random article from the list of articles', async () => {
            await blogPage.articlesList.first().waitFor({ state: 'visible' });
            const articleCount = await blogPage.articlesList.count();
            const randomIndex = Math.floor(Math.random() * articleCount);
            await blogPage.articlesList.nth(randomIndex).click();
        });

        await blogArticlePage.article.waitFor({ state: 'visible' });
        const buttonCount = await blogArticlePage.buttonsArticleList.count();

        for (let i = 0; i < buttonCount; i++) {
            const expectedText = await blogArticlePage.buttonsArticleList.nth(i).textContent();
            await step(
                `Click on "${expectedText}" button in sidebar menu and verify the corresponding header position`,
                async () => {
                    await blogArticlePage.clickButtonsArticleList(i);

                    const actualHeading = await blogArticlePage.subArticlesList.nth(i).getByRole('heading');
                    let headingPosition;
                    await step(
                        `Verify that the "${expectedText}" with the corresponding header on the page`,
                        async () => {
                            expect(actualHeading).toContainText(expectedText);
                        }
                    );

                    await actualHeading.waitFor({ state: 'visible' });
                    await page.waitForTimeout(1000);

                    await step('Get header position', async () => {
                        headingPosition = await page.evaluate(
                            (element) => {
                                const rect = element.getBoundingClientRect();
                                return { top: rect.top, bottom: rect.bottom };
                            },
                            await actualHeading.elementHandle()
                        );
                    });

                    await step(
                        'Verify that the corresponding header is positioned near the top of the screen',
                        async () => {
                            const fixedHeaderHeight = 58;
                            expect(headingPosition.top).toBeGreaterThanOrEqual(fixedHeaderHeight);
                            expect(headingPosition.top).toBeLessThanOrEqual(fixedHeaderHeight + 30);

                            const isOverlapping = await page.evaluate(
                                ({ element, headerHeight }) => {
                                    const rect = element.getBoundingClientRect();
                                    return rect.top < headerHeight;
                                },
                                { element: await actualHeading.elementHandle(), headerHeight: fixedHeaderHeight }
                            );

                            expect(isOverlapping).toBe(false);
                        }
                    );
                }
            );
        }
    });

    test('TC_06_01 | Verify Blog search functionality with random characters', async ({
        blogPage,
        page,
        headerComponent,
        loginPage,
    }) => {
        await tags('Blog', 'Negative');
        await severity('normal');
        await description('To verify that "No results for... " message appears after search with random characters.');
        await issue(`${QASE_LINK}/01-29`, 'Blog');
        await tms(`${GOOGLE_DOC_LINK}ior9d5z2nkji`, 'ATC_06_01');
        await epic('Blog');

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await headerComponent.clickBlogButton();
        await page.waitForURL(URL_ENDPOINT.blogPage);

        const randomString = await getRandomCharacters(10);

        await blogPage.fillBlogSearchInput(randomString);
        await blogPage.clickSearchButton();

        await step('Wait for load page with search results', async () => {
            await page.waitForURL(`${process.env.URL}/blog/search?search=${randomString}`);
            await page.waitForLoadState('load');
        });

        await step('Verify that message “No results for” is visible on the page', async () => {
            await expect(blogPage.searchResultMessage).toHaveText(
                `${BLOG_SEARCH_RESULT_MESSAGE.noResult} ${randomString}`
            );
        });
    });
});
