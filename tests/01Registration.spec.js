import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT, NEGATIVE_EMAIL_DATA_SET } from '../testData';

test.describe('Registration', () => {
    test('TC_01_02_01 | Verify user is not able to sign up with an existing email', async ({
        page,
        headerComponent,
        signupPage,
    }) => {
        await tags('Registration', 'Negative');
        await severity('normal');
        await description('Verify that registration fails when an existing email is used');
        await issue(`${QASE_LINK}/01-4`, 'User Registration');
        await tms(`${GOOGLE_DOC_LINK}i02y4jgrnqlw`, 'ATC_01_02_01');
        await epic('Registration');

        await step('Navigate to Home page.', async () => {
            await page.goto('/');
        });
        await headerComponent.clickSignup();
        await step('Verify user is on Sign up page.', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.signup);
        });
        await step('Verify the filling existing Email Address.', async () => {
            await signupPage.fillEmailAddressInput(process.env.USER_EMAIL);
        });
        await step('Verify the select of check box to receive emails.', async () => {
            await signupPage.selectCheckboxReceiveEmails();
        });
        await step('Verify the click the "Create account" button.', async () => {
            await signupPage.clickCreateAccount();
        });
        await step('Verify the registration is failed.', async () => {
            await signupPage.errorMessageEmail.isVisible();
        });
    });
    NEGATIVE_EMAIL_DATA_SET.forEach((typeEmailField) => {
        test(`TC_01_02_02 | Verify user is not able to sign up with an invalid email: ${typeEmailField[0]}`, async ({
            page,
            headerComponent,
            signupPage,
        }) => {
            await tags('Registration', 'Negative');
            await severity('normal');
            await description('Verify that registration fails when an invalid email is used');
            await issue(`${QASE_LINK}/01-4`, 'User Registration');
            await tms(`${GOOGLE_DOC_LINK}kjwdmepb5t7q`, 'ATC_01_02_02');
            await epic('Registration');

            await step('Navigate to Home page.', async () => {
                await page.goto('/');
            });
            await headerComponent.clickSignup();
            await step('Verify user is on Sign up page.', async () => {
                await page.waitForURL(process.env.URL + URL_ENDPOINT.signup);
            });
            await step('Verify the filling invalid Email Address.', async () => {
                await signupPage.fillEmailAddressInput(typeEmailField[1]);
            });
            await step('Verify the error message.', async () => {
                await expect(signupPage.errorMessageEmail).toHaveText(typeEmailField[2]);
            });
        });
    });
});
