import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT, INVALID_CREDS_AUTH, COLORS } from '../testData';
import { loginUser } from '../helpers/preconditions';

test.describe('Authorization', () => {
    test('TC_02_02 |  Verify user can login into their account without 2FA.', async ({
        page,
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
        await headerComponent.clickLogin();

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

    test('TC_02_01 | Verify login with invalid credentials.', async ({ page, headerComponent, loginPage }) => {
        await tags('Authorization', 'Negative');
        await severity('normal');
        await description('To verify user is not able to login with empty and invalid credentials.');
        await issue(`${QASE_LINK}case=22&suite=21`, 'User Login');
        await tms(`${GOOGLE_DOC_LINK}6fjau1hl6v70`, 'ATC_02_01');
        await epic('Authorization');

        await step('Navigate to Home page.', async () => {
            await page.goto('/');
        });

        await headerComponent.clickLogin();

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

    test('TC_02_04 | Account Deletion Without 2FA', async ({
        page,
        loginPage,
        headerComponent,
        settingsGeneralPage,
        accountDeletionModal,
        acDeleteConfirmationModal,
        cancelDeletionModal,
    }) => {
        await tags('Authorization', 'Positive');
        await severity('critical');
        await description('To verify user can delete account without 2FA');
        await issue(`${QASE_LINK}case=23&suite=21`, 'Account Deletion');
        await tms(`${GOOGLE_DOC_LINK}iiqbm2c7rcc8`, 'ATC_02_04');
        await epic('Authorization');

        await step('Preconditions:', async () => {
            await loginUser(page, headerComponent, loginPage);
        });

        await headerComponent.clickMyProfileButton();
        await headerComponent.clickAccountSettingsLink();

        await step('The “General info” tab is selected.', async () => {
            await expect(settingsGeneralPage.generalInfoButton).toBeVisible();
        });

        await settingsGeneralPage.clickDeleteAccountButton();

        await step('Verify the "Yes, I consent to delete my account" checkbox is displayed.', async () => {
            await expect(accountDeletionModal.checkbox).toBeVisible();
        });
        await step('Verify the "CancelButton" button is displayed.', async () => {
            await expect(accountDeletionModal.cancelButton).toBeVisible();
        });
        await step('Verify the "ContinueButton" button is displayed.', async () => {
            await expect(accountDeletionModal.continueButton).toBeVisible();
        });
        await step('Verify the "x" button is displayed.', async () => {
            await expect(accountDeletionModal.closeButton).toBeVisible();
        });
        await step('Click on the "x" button in the modal', async () => {
            await accountDeletionModal.clickCloseButton();
        });
        await step('Verify that the account deletion modal is closed', async () => {
            await expect(accountDeletionModal.accountDeletionModalContainer).toBeEmpty();
        });

        await step('Reopen the account deletion modal', async () => {
            await settingsGeneralPage.clickDeleteAccountButton();
        });

        await step('Mark the checkbox and verify that the "Continue" button is now enabled', async () => {
            await accountDeletionModal.markCheckbox();
            await expect(accountDeletionModal.continueButton).toBeEnabled();
        });
        await step('Click on the "ContinueButton" button in the modal', async () => {
            await accountDeletionModal.clickContinueButton();
        });

        await step('Ensure the confirmation modal opens', async () => {
            await expect(acDeleteConfirmationModal.modalDescription).toBeVisible();
        });
        await step(
            'Verify that the delete input, buttons "x," "Cancel," and "Delete account" are displayed.',
            async () => {
                await expect(acDeleteConfirmationModal.deleteInput).toBeVisible();
                await expect(acDeleteConfirmationModal.cancelButton).toBeVisible();
                await expect(acDeleteConfirmationModal.closeButton).toBeVisible();
                await expect(acDeleteConfirmationModal.deleteButton).toBeVisible();
            }
        );

        await step('Confirm account deletion', async () => {
            await acDeleteConfirmationModal.enterDeleteText();
            await acDeleteConfirmationModal.clickDeleteAccountButton();
        });

        await step('Verify that the account deletion is successful', async () => {
            await expect(settingsGeneralPage.messageAboutDeletion).toBeVisible();
            await expect(settingsGeneralPage.dateOfDeletion).toBeVisible();
            await expect(settingsGeneralPage.cancelDeletionButton).toBeVisible();
        });

        await step('Postconditions: Cancel deletion', async () => {
            await settingsGeneralPage.clickCancelDeletionButton();
            await cancelDeletionModal.clickAcceptDeletionButton();
        });
    });
});
