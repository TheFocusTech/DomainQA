import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT } from '../testData';
import { loginUser } from '../helpers/preconditions';
import { getRandomCharacters } from '../helpers/utils';

test.describe('Help Center', () => {
    test('TC_07_01_01 | Verify the user can search articles in the Help Center with random characters', async ({
        page,
        headerComponent,
        loginPage,
    }) => {
        await tags('Help_Center', 'Negative');
        await severity('normal');
        await description('To verify the user gets alert-message when searches in the Help Center with random characters.');
        await issue(`${QASE_LINK}/01-32`, 'User Login');
        await tms(`${GOOGLE_DOC_LINK}zg8gtwoz9y8t`, 'ATC_07_01_01');
        await epic('HelpCenter');

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Verify the user is redirected to help center page.', async () => {
            await headerComponent.clickHelpCenter();
            await expect(page).toHaveURL(URL_ENDPOINT.helpCenter);
        });

        // await step('Verify the user gets alert-message when searches in the Help Center with random characters.', async () => {
        //  await helpCenterPage
        // });


    });
});

// TC_07_01_02 | Verify the user can search articles in the Help Center with special characters
// click search locators
// locator('div').filter({ hasText: /^Search$/ }).nth(3)
// locator(.input-search-with-action_input-search__button-container__gq0Lg)
// .input-search-with-action_input-search__button-container__gq0Lg

// getByRole('button', { name: 'Search' }) 

