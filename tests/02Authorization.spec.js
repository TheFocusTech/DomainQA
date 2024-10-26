import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT, INVALID_CREDS_AUTH, COLORS } from '../testData';

test.describe('Authorization', () => {
    test('TC_02_02 |  Verify user can login into their account without 2FA.', async ({
        page,
        homePage,
        loginPage,
        headerComponent,
    }) => {
        await tags('Authorization', 'Positive');
        await severity('critical');
        await description('To verify user login process without 2FA.');
        await issue(`${QASE_LINK}case=21&previewMode=side&suite=21`, 'User Login');
        await tms(`${GOOGLE_DOC_LINK}rrgjsbcqig8c`, 'ATC_02_02');
        await epic('Authorization');

        await step('Navigate to Home page.', async () => {
            await page.goto('/');
        });
        await homePage.clickLogin();

        await step('Verify user is on Login page', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.login);
            await expect(page).toHaveURL(process.env.URL + URL_ENDPOINT.login);
            await loginPage.verifyLoginFormUI();
        });
        await loginPage.fillEmailAddressInput(process.env.USER_EMAIL);
        await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
        await loginPage.clickLogin();

        await step('Verify user is logged in', async () => {
            await page.waitForURL(process.env.URL);
            await expect(headerComponent.myProfileButton).toBeVisible();
        });
    });

    test('TC_02_01 | Verify login with invalid credentials.', async ({ page, homePage, loginPage }) => {
        await tags('Authorization', 'Negative');
        await severity('normal');
        await description('To verify user is not able to login with empty and invalid credentials.');
        await issue(`${QASE_LINK}case=22&suite=21`, 'User Login');
        await tms(`${GOOGLE_DOC_LINK}6fjau1hl6v70`, 'ATC_02_01');
        await epic('Authorization');

        await step('Navigate to Home page.', async () => {
            await page.goto('/');
        });

        await homePage.clickLogin();

        await step('Verify user is on Login page.', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.login);
        });

        await step('Fill email and password inputs.', async () => {
            await loginPage.fillEmailAddressInput(process.env.USER_EMAIL);
            await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
        });

        await step('Clear and unfocus inputs.', async () => {
            await loginPage.fillEmailAddressInput('');
            await loginPage.fillPasswordInput('');
            await loginPage.emailAddressInput.blur();
            await loginPage.passwordInput.blur();
        });

        await step('Verify "Required field" messages are displayed.', async () => {
            await expect(loginPage.errorMessageRequiredField.first()).toBeVisible();
            await expect(loginPage.errorMessageRequiredField).toHaveCount(2);
        });

        await step('Verify inputs have red border.', async () => {
            await expect(loginPage.emailAddressInput).toHaveCSS('border-color', COLORS.red);
            await expect(loginPage.passwordInput).toHaveCSS('border-color', COLORS.red);
        });

        for (const { email, password, name } of INVALID_CREDS_AUTH) {
            await step(`Fill inputs with ${name}.`, async () => {
                await loginPage.fillEmailAddressInput(email);
                await loginPage.fillPasswordInput(password);
            });

            await loginPage.clickLogin();

            await step('Verify user stays on Login page and error message is displayed.', async () => {
                await expect(loginPage.errorMessageWrongCredentials).toBeVisible();
                await expect(page).toHaveURL(process.env.URL + URL_ENDPOINT.login);
            });
        }
    });
});
