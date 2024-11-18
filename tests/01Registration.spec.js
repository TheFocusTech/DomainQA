import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT, NEGATIVE_EMAIL_DATA_SET, REGISTER_USER } from '../testData';
import { deleteUserRequest } from '../helpers/apiCalls';
import { authorize, getVerificationCodeFromEmail } from '../index';

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

    test('TC_01_01_01 | Verify Registration form elements', async ({ page, headerComponent, signupPage }) => {
        await tags('Registration', 'Positive');
        await severity('normal');
        await description(
            'Verify the registration form contains all required elements for a complete user registration'
        );
        await issue(`${QASE_LINK}/01-1`, 'User Registration');
        await tms(`${GOOGLE_DOC_LINK}y7nujkap1fcv`, 'ATC_01_01');
        await epic('Registration');

        await step('Navigate to Home page.', async () => {
            await page.goto('/');
        });
        await headerComponent.clickSignup();
        await page.waitForURL(process.env.URL + URL_ENDPOINT.signup);

        await step('Verify the "Log in" hyperlink is present on the page.', async () => {
            await expect(signupPage.loginLink).toBeVisible();
        });

        await step('Verify the "Log in" link has the correct href attribute.', async () => {
            await expect(signupPage.loginLink).toHaveAttribute('href', URL_ENDPOINT.login);
        });

        await step('Verify the Email input field is present on the page.', async () => {
            await expect(signupPage.emailAddressInput).toBeVisible();
        });

        await step('Verify the "Create account" button is present on the page.', async () => {
            await expect(signupPage.createAccountButton).toBeVisible();
        });

        await step(
            'NOT FULLY IMPLEMENTED: Verify the "Terms of use" link is present on the page and has the correct href attribute.',
            async () => {
                await expect(signupPage.termsOfUseLink).toBeVisible();
                // await expect(signupPage.termsOfUseLink).toHaveAttribute('href', '/auth/sign-up#');
            }
        );

        await step(
            'NOT FULLY IMPLEMENTED: Verify the "Privacy Policy" link is present on the page and has the correct href attribute.',
            async () => {
                await expect(signupPage.privacyPolicyLink).toBeVisible();
                // await expect(signupPage.privacyPolicyLink).toHaveAttribute('href', '/auth/sign-up#');
            }
        );
    });

    test('TC_01_01_02 | Verify "Create Password" form elements and "Back to Sign Up" button functionality', async ({
        page,
        request,
        headerComponent,
        signupPage,
    }) => {
        await tags('Registration', 'Positive');
        await severity('normal');
        await description(
            'TC_01_01_02 | Verify "Create Password" form elements and "Back to Sign Up" button functionality'
        );
        await issue(`${QASE_LINK}/01-1`, 'User Registration');
        await tms(`${GOOGLE_DOC_LINK}4z8noa4hz8do`, 'ATC_01_01_02');
        await epic('Registration');

        await deleteUserRequest(request, REGISTER_USER.email, REGISTER_USER.password);

        await step('Navigate to Home page.', async () => {
            await page.goto('/');
        });
        await headerComponent.clickSignup();
        await page.waitForURL(process.env.URL + URL_ENDPOINT.signup);
        await signupPage.fillEmailAddressInput(REGISTER_USER.email);
        await signupPage.selectCheckboxReceiveEmails();
        await signupPage.clickCreateAccount();

        await step('Verify that the Create Password form is visible', async () => {
            await expect(signupPage.createPasswordHeader).toBeVisible();
        });

        await step('Verify the presence of the Return to Registration button', async () => {
            await expect(signupPage.backToSignUpButton).toBeVisible();
        });

        await step('Verify the presence of the Password input field', async () => {
            await expect(signupPage.passwordInput).toBeVisible();
        });

        await step('Verify the presence of the Confirm Password input field', async () => {
            await expect(signupPage.repeatPasswordInput).toBeVisible();
        });

        await step('Verify the presence of the Continue button', async () => {
            await expect(signupPage.continueButton).toBeVisible();
        });

        await signupPage.clickBackToSignUpButton();

        await step('Verify the user is redirected back to the registration page', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.signup);
            expect(page.url()).toEqual(process.env.URL + URL_ENDPOINT.signup);
        });
    });

    test('TC_01_01_03 | Verify redirection to "Check your email" form and its elements', async ({
        page,
        request,
        headerComponent,
        signupPage,
        confirmEmailPage,
    }) => {
        test.setTimeout(90000);
        await tags('Registration', 'Positive');
        await severity('normal');
        await description('Verify redirection to "Check your email" form and its elements');
        await issue(`${QASE_LINK}/01-1`, 'User Registration');
        await tms(`${GOOGLE_DOC_LINK}mfxv1h1qoe4b`, 'ATC_01_01_03');
        await epic('Registration');

        const codePattern = /^[0-9]{6}$/;

        await deleteUserRequest(request, REGISTER_USER.email, REGISTER_USER.password);

        await step('Navigate to Home page.', async () => {
            await page.goto('/');
        });
        await headerComponent.clickSignup();
        await page.waitForURL(process.env.URL + URL_ENDPOINT.signup);
        await signupPage.fillEmailAddressInput(REGISTER_USER.email);
        await signupPage.selectCheckboxReceiveEmails();
        await signupPage.clickCreateAccount();
        await signupPage.clickBackToSignUpButton();
        await signupPage.fillEmailAddressInput(REGISTER_USER.email);
        await signupPage.selectCheckboxReceiveEmails();
        await signupPage.clickCreateAccount();
        await signupPage.fillPasswordInput(REGISTER_USER.password);
        await signupPage.fillRepeatPasswordInput(REGISTER_USER.password);
        await signupPage.clickContinueButton();

        await step('Verify redirection to the "Check your email" form', async () => {
            await page.waitForURL(`${process.env.URL}${URL_ENDPOINT.confirmEmail}`);
            expect(page.url()).toEqual(`${process.env.URL}${URL_ENDPOINT.confirmEmail}`);
        });

        await step('Verify "Back to Sign up" is visible on the "Check your email" form', async () => {
            await expect(confirmEmailPage.backToSignUpButton).toBeVisible();
        });

        await step(
            'Verify the verification code input field with correct placeholder is visible on the "Check your email" form',
            async () => {
                await expect(confirmEmailPage.verificationCodeInput).toBeVisible();
                await expect(confirmEmailPage.verificationCodeInput).toHaveAttribute(
                    'placeholder',
                    'Enter verification'
                );
            }
        );

        await step(
            'Verify resend code button with countdown timer is visible on the "Check your email" form',
            async () => {
                await expect(confirmEmailPage.resendCodeButton).toBeVisible();
                await expect(await confirmEmailPage.resendCodeButton.textContent()).toMatch(
                    /Resend code \(0[0-1]:[0-5][0-9]\)/
                );
            }
        );

        await step('Verify the "Resend code" button is disabled', async () => {
            await expect(confirmEmailPage.resendCodeButton).toBeDisabled();
        });

        await step('Verify "Continue" button is visible on the "Check your email" form', async () => {
            await expect(confirmEmailPage.continueButton).toBeVisible();
        });

        const verificationCode = await getVerificationCodeFromEmail(await authorize(), REGISTER_USER.email);

        await step(
            "Verify an email with a verification code is sent to the user's registered email address",
            async () => {
                await expect(verificationCode).not.toBeNull();
                await expect(verificationCode).toMatch(codePattern);
            }
        );

        await confirmEmailPage.waitForTimerToComplete();

        await step('Verify the "Resend code" button is enabled', async () => {
            await expect(confirmEmailPage.resendCodeButton).toBeEnabled();
        });

        await confirmEmailPage.clickResendCodeButton();

        const newVerificationCode = await getVerificationCodeFromEmail(await authorize(), REGISTER_USER.email);

        await step(
            'Verify clicking on "Resend code" button again, resends the verification code to the email address',
            async () => {
                await expect(newVerificationCode).not.toBeNull();
                await expect(newVerificationCode).toMatch(codePattern);
                await expect(newVerificationCode).not.toBe(verificationCode);
            }
        );
    });
});
