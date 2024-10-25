import { test } from '../fixtures';
import { expect } from '@playwright/test';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, PASSWORD, TOAST_MESSAGE } from '../testData';
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

        const currentPassword = PASSWORD.password;
        const newPassword = PASSWORD.newPassword;

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

        await changePasswordModal.fillCurrentPasswordField(currentPassword);
        await changePasswordModal.fillNewPasswordField(newPassword);
        await changePasswordModal.fillRepeatNewPasswordField(newPassword);

        await step('Verify the password is good.', async () => {
            await expect(changePasswordModal.goodPasswordRules).toHaveCount(4);
        });

        await changePasswordModal.clickChangeButton();

        await step('Verify the toast message “Password changed successfully” appears.', async () => {
            await expect(toastComponent.toastBody.getByText(TOAST_MESSAGE.passwordChanged)).toBeVisible;
        });

        await step(
            'Postconditions: Change "New password" to "Current Password" and return to "Home Page"',
            async () => {
                await generalSettingsPage.clickChangeButton();
                await changePasswordModal.fillCurrentPasswordField(newPassword);
                await changePasswordModal.fillNewPasswordField(currentPassword);
                await changePasswordModal.fillRepeatNewPasswordField(currentPassword);
                await changePasswordModal.clickChangeButton();
                await page.goto('/');
            }
        );
    });
});
