import { test } from '../../fixtures';
import { expect } from '@playwright/test';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT, SECRET_KEY_2FA } from '../../testData';
import { loginUser } from '../../helpers/preconditions';
import { generateVerificationCode } from '../../helpers/utils';

test.describe('My profile', () => {
    test.skip('TC_02_03 | User Authorization with 2FA: Use predefined user', async ({
        page,
        loginPage,
        headerComponent,
        settingsGeneralPage,
    }) => {
        await tags('My profile', 'Positive');
        await severity('normal');
        await description('User Authorization with 2FA');
        await issue(`${QASE_LINK}/01-24`, 'My profile');
        await tms(`${GOOGLE_DOC_LINK}bfo5k42mbcw4`, 'ATC_02_03');
        await epic('My profile');
        await feature('Account settings');

        await loginUser(
            page,
            headerComponent,
            loginPage,
            `${process.env.EMAIL_PREFIX}qa.mail.template1${process.env.EMAIL_DOMAIN}`,
            `${process.env.USER_PASSWORD}`
        );

        await step('Verify that the 2FA verification form is shown.', async () => {
            await expect(loginPage.loginButton).toBeHidden({ timeout: 10000 });
            await expect(loginPage.verificationCodeField).toBeVisible();
        });

        await step('Enter the valid 2FA code.', async () => {
            const code = generateVerificationCode(SECRET_KEY_2FA);
            await loginPage.verificationCodeField.fill(code.otp);
        });

        await step('Click on the "Continue" button.', async () => {
            await loginPage.continueButton.click();
        });

        await step('Verify that the user is redirected to the Home screen.', async () => {
            await page.waitForLoadState('networkidle');
            expect(page.url()).toEqual(process.env.URL);
        });

        await step('Navigate to page Account Settings', async () => {
            await page.goto(`${process.env.URL}${URL_ENDPOINT.accountSettings}`, {
                waitUntil: 'networkidle',
            });
        });

        await step('Verify 2FA toggle is checked', async () => {
            await expect(settingsGeneralPage.checkbox).toBeChecked();
        });
    });
});
