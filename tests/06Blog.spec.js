import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT, INPUT_SEARCH_PART, INPUT_SEARCH_RELEVANT_NAME } from '../testData';
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
        await tms(`${GOOGLE_DOC_LINK}wu2onbnm0a9o`, 'ATC_06_08');
        await epic('Blog');
        test.slow();

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await headerComponent.clickBlogButton();
        await page.waitForURL(URL_ENDPOINT.blogPage);

        await step('Open a random article:', async () => {
            await blogPage.articlesList.first().waitFor({ state: 'visible' });
            const articleCount = await blogPage.articlesList.count();
            const randomIndex = Math.floor(Math.random() * articleCount);
            await blogPage.articlesList.nth(randomIndex).click();
        });

        await blogArticlePage.article.waitFor({ state: 'visible' });
        const buttonCount = await blogArticlePage.buttonsArticleList.count();

        for (let i = 0; i < buttonCount; i++) {
            const expectedText = await blogArticlePage.buttonsArticleList.nth(i).textContent();
            const actualHeading = await blogArticlePage.subArticlesList.nth(i).getByRole('heading');
            expect(actualHeading).toContainText(expectedText);
            await blogArticlePage.buttonsArticleList.nth(i).click();

            await actualHeading.waitFor({ state: 'visible' });

            await page.waitForTimeout(1000);

            const headingPosition = await page.evaluate((element) => {
                const rect = element.getBoundingClientRect();
                return { top: rect.top, bottom: rect.bottom };
            }, await actualHeading.elementHandle());

            const fixedHeaderHeight = 58;
            console.log(`Heading position for index ${i}:`, headingPosition);

            expect(headingPosition.top).toBeGreaterThanOrEqual(fixedHeaderHeight);
            expect(headingPosition.top).toBeLessThanOrEqual(fixedHeaderHeight + 30);

            const isOverlapping = await page.evaluate(({ element, headerHeight }) => {
                const rect = element.getBoundingClientRect();
                return rect.top < headerHeight;
            }, { element: await actualHeading.elementHandle(), headerHeight: fixedHeaderHeight });

            expect(isOverlapping).toBe(false);
        }
    });

});
