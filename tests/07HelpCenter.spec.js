import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT, HELP_SEARCH_POPUP_ALERT } from '../testData';
import { loginUser } from '../helpers/preconditions';

test.describe('Help Center', () => {
    test.use({ viewport: { width: 1600, height: 1200 } });
    test.describe.configure({ retries: 2, timeout: 60000 });

    test('TC_07_01_01 | Verify the user can search articles in the Help Center with random characters', async ({
        page,
        headerComponent,
        loginPage,
        helpCenterPage,
    }) => {
        await tags('Help_Center', 'Negative');
        await severity('normal');
        await description(
            'To verify the user gets alert-message when searches in the Help Center with random characters.'
        );
        await issue(`${QASE_LINK}/01-32`, 'User Login');
        await tms(`${GOOGLE_DOC_LINK}zg8gtwoz9y8t`, 'ATC_07_01_01');
        await epic('HelpCenter');

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Verify the user is redirected to help center page.', async () => {
            await headerComponent.clickHelpCenterButton();
            await expect(page).toHaveURL(URL_ENDPOINT.HelpCenter);
        });

        const randomString = await helpCenterPage.fillSearchInput();

        await step('Verify the user gets popup alert-message and empty list after input.', async () => {
            await expect(helpCenterPage.helpSearchPopup).toBeVisible();
            await expect(helpCenterPage.helpSearchPopupAlert).toHaveText(HELP_SEARCH_POPUP_ALERT);
        });

        await step('Verify the user redirects to search page and gets alert-message.', async () => {
            await helpCenterPage.clickHelpCenterSearchButton();
            const expectedSearchURL = `${process.env.URL}${URL_ENDPOINT.HelpCenterSearch}?search=${randomString}`;
            expect(page).toHaveURL(expectedSearchURL);
            const alertText = await helpCenterPage.helpSearchPopupAlert.innerText();
            const alertNormalizedText = alertText.replace(/“|”/g, '"');
            expect(alertNormalizedText).toContain(`No results for "${randomString}"`);
        });
    });
});
