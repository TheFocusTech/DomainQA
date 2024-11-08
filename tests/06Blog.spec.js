import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT, INPUT_SEARCH_PART } from '../testData';
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

    test('TC_06_05 | Verify sidebar presence and header position on the blog page when switching between headings in the selected article', async ({
        page,
        headerComponent,
        loginPage,
        blogPage,
        blogArticlePage
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

        await step('Open a random article:', async () => {            
            await blogPage.articlesList.first().waitFor({ state: 'visible' });            
            const articleCount = await blogPage.articlesList.count();
            const randomIndex = Math.floor(Math.random() * articleCount);
            await blogPage.articlesList.nth(randomIndex).click();
        });
       // console.log(await blogArticlePage.headingsList.count());
       await blogArticlePage.articleBody.waitFor({ state: 'visible' });
        //console.log(await page.locator("h2").count());
        console.log(await blogArticlePage.headingsList.count());
    });
});
