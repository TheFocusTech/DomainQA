import { test } from '../fixtures';
import { expect } from '@playwright/test';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, NEW_PASSWORD, TOAST_MESSAGE } from '../testData';
import { loginUser } from '../helpers/preconditions';

test.describe('My profile', () => {
    test('TC_08_02_02 | Verify user can change Password when 2FA is disabled', async ({
        page,
        homePage,
        loginPage,
        headerComponent,
        generalSettingsPage,
        changePasswordModal,
        toastComponent,
    }) => {
        await tags('My profile', 'Password');
        await severity('normal');
        await description('To verify, that user can change Password when Two-factor authentication (2FA) is disabled');
        await issue(`${QASE_LINK}case=13&suite=11`, 'General info');
        await tms(`${GOOGLE_DOC_LINK}g7yno6cbuqi`, 'ATC_08_02_02');
        await epic('My profile');
        await feature('Account settings');

        await step('Preconditions:', async () => {
            await loginUser(page, homePage, loginPage);
        });

        await headerComponent.clickMyProfileButton();
        await headerComponent.clickAccountSettingsLink();
        await generalSettingsPage.clickChangeButton();

        await step('Verify the "Current password" field is displayed.', async () => {
            await expect(changePasswordModal.currentPasswordField).toBeVisible();
        });
        await step('Verify the "New password" field is displayed.', async () => {
            await expect(changePasswordModal.newPasswordField).toBeVisible();
        });
        await step('Verify the "Repeat new password" field is displayed.', async () => {
            await expect(changePasswordModal.repeatNewPassword).toBeVisible();
        });
        await step('Verify the "x" button is displayed.', async () => {
            await expect(changePasswordModal.closeButton).toBeVisible();
        });
        await step('Verify the "Cancel" button is displayed.', async () => {
            await expect(changePasswordModal.cancelButton).toBeVisible();
        });
        await step('Verify the "Change" button is displayed.', async () => {
            await expect(changePasswordModal.changeButton).toBeVisible();
        });

        await changePasswordModal.fillCurrentPasswordField(process.env.USER_PASSWORD);
        await changePasswordModal.fillNewPasswordField(NEW_PASSWORD.newPassword);
        await changePasswordModal.fillRepeatNewPasswordField(NEW_PASSWORD.newPassword);
        await changePasswordModal.clickChangeButton();

        await step('Verify the toast message “Password changed successfully” appears.', async () => {
            await expect(toastComponent.toastBody.getByText(TOAST_MESSAGE.passwordChanged)).toBeVisible;
        });

        await step(
            'Postconditions: Change "New password" to "Current Password" and return to "Home Page"',
            async () => {
                await generalSettingsPage.clickChangeButton();
                await changePasswordModal.fillCurrentPasswordField(NEW_PASSWORD.newPassword);
                await changePasswordModal.fillNewPasswordField(process.env.USER_PASSWORD);
                await changePasswordModal.fillRepeatNewPasswordField(process.env.USER_PASSWORD);
                await changePasswordModal.clickChangeButton();
                await page.goto('/');
            }
        );
    });
});
