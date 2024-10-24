import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT } from '../testData';

test.describe('Registration', () => {
    test('TC_01_02_01 | Verify user is not able to sign up with an existing email', async ({
        page,
        homePage,
        signupPage,
    }) => {
        await tags('Registration', 'Negative');
        await severity('normal');
        await description('Verify that registration fails when an existing email is used');
        await issue(`${QASE_LINK}suite=1&case=4`, 'User Registration');
        await tms(`${GOOGLE_DOC_LINK}i02y4jgrnqlw`, 'ATC_01_02_01');
        await epic('Registration');

        await step('Navigate to Home page.', async () => {
            await page.goto('/');
        });
        await homePage.clickSignup();
        await step('Verify user is on Sign up page.', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.signup);
        });
        await signupPage.fillEmailAddressInput(process.env.USER_EMAIL);
        await signupPage.selectCheckboxReceiveEmails();
        await signupPage.clickCreateAccount();
        await step('Verify the registration is failed.', async () => {
            await signupPage.errorMessageEmailExist.isVisible();
        });
    });
});
