import { test } from '../fixtures';
import { expect } from '@playwright/test';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import {
    QASE_LINK,
    GOOGLE_DOC_LINK,
    PASSWORD,
    TOAST_MESSAGE,
    CURRENCY_EUR_BUTTON_TEXT,
    CURRENCY_USD_BUTTON_TEXT,
} from '../testData';
import { loginUser } from '../helpers/preconditions';

test.describe('My profile', () => {
    test.skip('TC_08_02_02 | Verify user can change Password when 2FA is disabled', async ({
        page,
        loginPage,
        headerComponent,
        settingsGeneralPage,
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
        const newPassword = PASSWORD.password;

        await step('Preconditions:', async () => {
            await loginUser(page, headerComponent, loginPage);
        });

        await headerComponent.clickMyProfileButton();
        await headerComponent.clickAccountSettingsLink();
        await settingsGeneralPage.clickChangeButton();

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
            await expect(changePasswordModal.goodPasswordRule).toHaveCount(4);
        });

        await changePasswordModal.clickChangeButton();

        await step('Verify the toast message “Password changed successfully” appears.', async () => {
            await expect(toastComponent.toastBody.getByText(TOAST_MESSAGE.passwordChanged)).toBeVisible;
        });

        await step(
            'Postconditions: Change "New password" to "Current Password" and return to "Home Page"',
            async () => {
                await settingsGeneralPage.clickChangeButton();
                await changePasswordModal.fillCurrentPasswordField(newPassword);
                await changePasswordModal.fillNewPasswordField(currentPassword);
                await changePasswordModal.fillRepeatNewPasswordField(currentPassword);
                await changePasswordModal.clickChangeButton();
                await page.goto('/');
            }
        );
    });

    test('TC_08_06 | Verify the user can change currency USD (EUR) in the Profile Menu', async ({
        page,
        loginPage,
        headerComponent,
    }) => {
        await tags('My profile', 'Positive');
        await severity('normal');
        await description('To verify, that the user can change currency USD (EUR) in the Profile Menu');
        await issue(`${QASE_LINK}case=26&suite=14`, 'Currency selection');
        await tms(`${GOOGLE_DOC_LINK}pfzmnyprwi28`, 'ATC_08_06');
        await epic('My profile');
        await feature('Currency selection');

        await step('Preconditions:', async () => {
            await loginUser(page, headerComponent, loginPage);
        });

        await headerComponent.clickMyProfileButton();

        await step('The "Currency USD ($)" button is visible by default in the Profile Menu.', async () => {
            await expect(headerComponent.currencyUSDButton).toBeVisible();
        });

        await headerComponent.clickCurrencyUSDButton();

        await step('The "USD ($)" button is displayed.', async () => {
            await expect(headerComponent.usdButton).toBeVisible();
        });

        await step('The "USD ($)" button is selected by default (with a checkmark).', async () => {
            await expect(headerComponent.checkmarkUSDButton).toBeVisible();
        });

        await step('The "EUR (€)" button is displayed.', async () => {
            await expect(headerComponent.eurButton).toBeVisible();
        });

        await headerComponent.clickEurButton();

        await step('The "EUR (€)" button is selected (with a checkmark.', async () => {
            await expect(headerComponent.checkmarkEURButton).toBeVisible();
        });

        await step('The text of the "Currency USD ($)" button changes to "Currency EUR (€)".', async () => {
            await expect(headerComponent.currencyEURButton).toHaveText(CURRENCY_EUR_BUTTON_TEXT);
        });

        await headerComponent.clickUsdButton();

        await step('The "USD ($)" button is selected (with a checkmark.', async () => {
            await expect(headerComponent.checkmarkUSDButton).toBeVisible();
        });

        await step('The text of the "Currency EUR (€)" button changes back to "Currency USD ($)".', async () => {
            await expect(headerComponent.currencyUSDButton).toHaveText(CURRENCY_USD_BUTTON_TEXT);
        });
    });
});
