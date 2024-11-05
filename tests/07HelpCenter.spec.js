import { test } from '../fixtures';
import { expect } from '@playwright/test';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT, HELP_SEARCH_PART } from '../testData';
import { loginUser } from '../helpers/preconditions';

test.describe('Help center', () => {
    test('TC_07_01_03 | Verify  the autocomplete suggestions displayed correspond to the entered letters in Help Center', async ({
        page,
        loginPage,
        headerComponent,
        helpCenterPage,
    }) => {
        await tags('Help center', 'Positive');
        await severity('normal');
        await description(
            'Verify that user can see autocomplete suggestions correspond to the entered letters in Help Center'
        );
        await issue(`${QASE_LINK}/01-32`, 'Help center');
        await tms(`${GOOGLE_DOC_LINK}t0sf9gst04b3`, 'ATC_07_01_03');
        await epic('Help center');

        await loginUser(page, headerComponent, loginPage);

        await headerComponent.clickHelpCenterButton();
        await page.waitForURL(URL_ENDPOINT.HelpCenter);

        await step(
            'Verify that  autocomplete suggestions that match the input ("dom") are displayed in popup search window',
            async () => {
                await helpCenterPage.fillHelpSearchInput(HELP_SEARCH_PART);
                await helpCenterPage.waitForHelpSearchPopup();
                await expect(helpCenterPage.helpSearchPopup).toContainText(new RegExp(HELP_SEARCH_PART, 'i'));
            }
        );
    });
});
