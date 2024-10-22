import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT } from '../testData';

test.describe('Authorization', () => {
    test('TC_02_02 |  Verify user can login into their account without 2FA.', async ({ page, homePage, loginPage }) => {
        await tags('Authorization', 'Positive');
        await severity('critical');
        await description('To verify user login process without 2FA.');
        await issue(`${QASE_LINK}case=21&previewMode=side&suite=21`, 'User Login');
        await tms(`${GOOGLE_DOC_LINK}rrgjsbcqig8c`, 'ATC_02_02');
        await epic('Autorization');

        await step('Navigate to Home page.', async () => {
            await page.goto('/');
        });
        await homePage.clickLogin();

        await step('Verify user is on Login page', async () => {
            await expect(page).toHaveURL(process.env.URL + URL_ENDPOINT.login);
        });
        await loginPage.verifyLoginFormUI();

        await loginPage.fillEmailAddressInput(process.env.USER_EMAIL);
        await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
        await loginPage.clickLogin();

        await step('Verify user is logged in', async () => {
            await expect(page).toHaveURL(process.env.URL);
            await expect(homePage.myProfileButton).toBeVisible();
        });
    });
});
