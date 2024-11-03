import { test } from '../fixtures';
import { expect } from '@playwright/test';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, BLOG_SEARCH_RESULT_MESSAGE, URL_ENDPOINT } from '../testData';
import { loginUser } from '../helpers/preconditions';
import { getRandomCharacters } from '../helpers/utils';

test.describe('Blog', () => {
    test.beforeEach(async ({ page, loginPage, headerComponent }) => {
        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);
        await headerComponent.clickBlogButton();
    });

    test('TC_06_01 | Verify Blog search functionality with random characters', async ({ blogPage, page }) => {
        await tags('Blog', 'Negative');
        await severity('normal');
        await description('To verify that "No results" message appears after search with random characters.');
        await issue(`${QASE_LINK}/01-29`, 'My profile');
        await tms(`${GOOGLE_DOC_LINK}ior9d5z2nkji`, 'ATC_06_01');
        await epic('Blog');

        const randomString = await getRandomCharacters(10);

        await blogPage.fillBlogSearchInput(randomString);
        await blogPage.clickSearchButton();

        await step('Wait for load page with search results', async () => {
            const expectedSearchURL = `${process.env.URL}${URL_ENDPOINT.BlogSearchResults}?search=${randomString}`;
            await expect(page).toHaveURL(expectedSearchURL);
            await blogPage.searchResultMessage.waitFor({ state: 'visible' }, { timeout: 60000 });
        });

        await step('Verify that message “No results for” is visible on the page', async () => {
            await expect(blogPage.searchResultMessage).toHaveText(
                `${BLOG_SEARCH_RESULT_MESSAGE.noResult} ${randomString}`
            );
        });
    });
});
