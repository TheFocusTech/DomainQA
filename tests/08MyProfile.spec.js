import { test } from '../fixtures';
import { expect } from '@playwright/test';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import {
    QASE_LINK,
    GOOGLE_DOC_LINK,
    PASSWORD,
    TOAST_MESSAGE,
    MY_PROFILE_ITEMS,
    URL_ENDPOINT,
    NOTIFICATIONS_TYPE,
    CURRENCY_TYPE,
    CONTACTS,
} from '../testData';
import { loginUser } from '../helpers/preconditions';
import { generateVerificationCode } from '../helpers/utils';

let code;
let secretKey;

test.describe('My profile', () => {
    test.skip('TC_08_01 | Verify the Profile Dropdown Menu is displayed on "My Profile" Button Click', async ({
        page,
        loginPage,
        headerComponent,
    }) => {
        await tags('My profile', 'Positive');
        await severity('normal');
        await description('To verify the Profile Dropdown Menu on clicking "My Profile');
        await issue(`${QASE_LINK}/01-24`, 'My profile');
        await tms(`${GOOGLE_DOC_LINK}gu0m5ch4yg2x`, 'ATC_08_01');
        await epic('My profile');

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await headerComponent.clickMyProfileButton();

        await step('Verify the Profile Dropdown menu is displayed and contain 5 items', async () => {
            await expect(headerComponent.myProfileDropdownMenu).toBeVisible();
            await expect(headerComponent.myProfileDropdownMenuItems).toHaveCount(5);
            await expect(headerComponent.myProfileDropdownMenuItems).toHaveText(MY_PROFILE_ITEMS);
        });

        await step('Verify the Profile Dropdown menu is closed (not visible)', async () => {
            await headerComponent.clickMyProfileButton();
            await expect(headerComponent.myProfileDropdownMenu).not.toBeVisible();
        });

        await step('Verify the Profile Dropdown menu is visible', async () => {
            headerComponent.clickMyProfileButton();
            await expect(headerComponent.myProfileDropdownMenu).toBeVisible();
        });

        await step('Verify the Profile Dropdown menu is closed (not visible)', async () => {
            headerComponent.clickLogoButton();
            await expect(headerComponent.myProfileDropdownMenu).not.toBeVisible();
        });
    });

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
        await issue(`${QASE_LINK}/01-13`, 'General info');
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

    test('TC_08_02_03 | Verify the user can enable/disable Two-factor authentication (2FA)', async ({
        page,
        loginPage,
        headerComponent,
        twoFactorAuthModal,
        settingsGeneralPage,
    }) => {
        await tags('My profile', 'Positive');
        await severity('normal');
        await description('Verify the user can enable/disable Two-factor authentication (2FA)');
        await issue(`${QASE_LINK}/01-24`, 'My profile');
        await tms(`${GOOGLE_DOC_LINK}heuetjbfz4nu`, 'ATC_08_02_03');
        await epic('My profile');

        await loginUser(page, headerComponent, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Navigate to page Account Settings', async () => {
            await page.goto(`${process.env.URL}${URL_ENDPOINT.accountSettings}`, {
                waitUntil: 'networkidle',
            });
        });

        await step('Enable 2FA by clicking on toggle', async () => {
            await settingsGeneralPage.clickTwoFAToggle();
            await expect(twoFactorAuthModal.dialog).toBeVisible();
        });

        await step('Generate verification code', async () => {
            secretKey = await twoFactorAuthModal.getSecretKey();
        });

        await step('Set verification code to 2FA input', async () => {
            code = generateVerificationCode(secretKey);
            await twoFactorAuthModal.enterVerificationCode(code.otp);
        });

        await step('Click button Enable 2FA in dialog', async () => {
            await twoFactorAuthModal.enableButton.click();
            await expect(twoFactorAuthModal.dialog).not.toBeVisible();
        });

        await expect(settingsGeneralPage.checkbox).toBeChecked();
        await expect(settingsGeneralPage.enableTooltip).toBeVisible();

        await step('Disable 2FA', async () => {
            await settingsGeneralPage.clickTwoFAToggle();
        });

        await expect(settingsGeneralPage.checkbox).not.toBeChecked();
        await expect(settingsGeneralPage.disableTooltip).toBeVisible();
    });

    CURRENCY_TYPE.forEach(({ type }) => {
        test(`TC_08_02_04 | Verify user can change currency from ${type[0]} to ${type[1]}`, async ({
            page,
            loginPage,
            headerComponent,
            settingsGeneralPage,
        }) => {
            await tags('My profile', 'Positive');
            await severity('normal');
            await description('To verify that the user can change currency');
            await issue(`${QASE_LINK}/01-13`, 'General info');
            await tms(`${GOOGLE_DOC_LINK}zaopf49oholc`, 'ATC_08_02_04');
            await epic('My profile');
            await feature('Account settings');

            await loginUser(page, headerComponent, loginPage);

            await headerComponent.clickMyProfileButton();
            await headerComponent.clickAccountSettingsLink();

            (await settingsGeneralPage.isCurrencyTypeSet(type[0]))
                ? null
                : await settingsGeneralPage.changeCurrencyType(type[0]);

            await settingsGeneralPage.clickCurrencyButton();
            await settingsGeneralPage.clickCurrencyTypeDropdown(type[1]);

            await step(`Verify the ${type[1]} currency type is selected.`, async () => {
                await expect(await settingsGeneralPage.getCurrencyTypeSelected(type[1])).toBeVisible();
            });

            await step(`Verify the ${type[1]} button is displayed.`, async () => {
                expect(await settingsGeneralPage.currencyType.innerText()).toEqual(type[1]);
            });
        });
    });

    CURRENCY_TYPE.forEach(({ type }) => {
        test(`TC_08_06 | Verify user can change currency from ${type[0]} to ${type[1]} in the Profile Menu`, async ({
            page,
            loginPage,
            headerComponent,
        }) => {
            await tags('My profile', 'Positive');
            await severity('normal');
            await description('To verify, that the user can change currency USD (EUR) in the Profile Menu');
            await issue(`${QASE_LINK}/01-26`, 'Currency selection');
            await tms(`${GOOGLE_DOC_LINK}pfzmnyprwi28`, 'ATC_08_06');
            await epic('My profile');
            await feature('Currency selection');

            await step('Preconditions:', async () => {
                await loginUser(page, headerComponent, loginPage);
            });

            await headerComponent.clickMyProfileButton();

            (await headerComponent.isCurrencyTypeSet(type[0]))
                ? null
                : await headerComponent.changeCurrencyType(type[0]);

            await headerComponent.clickCurrencyButton();
            await headerComponent.clickCurrencyTypeDropdown(type[1]);

            await step(`Verify the ${type[1]} currency type is selected.`, async () => {
                await expect(await headerComponent.getCurrencyTypeSelected(type[1])).toBeVisible();
            });

            await step(`Verify the "Currency ${type[1]}" button is displayed.`, async () => {
                expect(await headerComponent.isCurrencyTypeSet(type[1])).toBeTruthy();
            });
        });
    });

    test('TC_08_07 | Verify that the user can log out of the account from the Profile Menu', async ({
        page,
        loginPage,
        headerComponent,
        toastComponent,
    }) => {
        await tags('My profile', 'Positive');
        await severity('normal');
        await description('To verify, that the user can log out of the account from the Profile Menu');
        await issue(`${QASE_LINK}/01-28`, 'Log out');
        await tms(`${GOOGLE_DOC_LINK}w8we6didi3d6`, 'ATC_08_07');
        await epic('My profile');
        await feature('Log out');

        await step('Preconditions:', async () => {
            await loginUser(page, headerComponent, loginPage);
        });

        await step('The "My profile" button is visible in the header.', async () => {
            await expect(headerComponent.myProfileButton).toBeVisible();
        });

        await headerComponent.clickMyProfileButton();

        await step('The "Log out" button is visible by default in the Profile Menu.', async () => {
            await expect(headerComponent.logOutButton).toBeVisible();
        });

        await headerComponent.clickLogOutButton();

        await step('The “You have been logged out” toast massage is displayed.', async () => {
            await expect(toastComponent.toastBody.getByText(TOAST_MESSAGE.loggedOut)).toBeVisible;
        });

        await step('The "My profile" button is not visible in the header..', async () => {
            await expect(headerComponent.myProfileButton).not.toBeVisible();
        });
    });

    test('TC_08_04_01 | Verify user can manage Account Notifications settings', async ({
        page,
        loginPage,
        headerComponent,
        settingsNotificationsPage,
        settingsGeneralPage,
    }) => {
        await tags('My profile', 'Notifications');
        await severity('normal');
        await description('To verify, that user user can manage Account Notifications settings');
        await issue(`${QASE_LINK}/01-15`, 'Notifications settings');
        await tms(`${GOOGLE_DOC_LINK}333obp2smjp7`, 'ATC_08_04_01');
        await epic('My profile');
        await feature('Account settings');

        await step('Preconditions:', async () => {
            await loginUser(page, headerComponent, loginPage);
        });

        await headerComponent.clickMyProfileButton();
        await headerComponent.clickAccountSettingsLink();
        await settingsGeneralPage.clickNotificationSettingsButton();

        await step('Verify the "Manage your notifications" header is displayed.', async () => {
            await expect(settingsNotificationsPage.notificationsHeading).toBeVisible();
        });
        await step('Verify the "Manage your notifications" table is displayed.', async () => {
            await expect(settingsNotificationsPage.notificationsTableRow).toHaveCount(3);
        });
        await step('Verify the "Notifications Type".', async () => {
            await expect(settingsNotificationsPage.notificationsType).toHaveText([
                NOTIFICATIONS_TYPE.type1,
                NOTIFICATIONS_TYPE.type2,
                NOTIFICATIONS_TYPE.type3,
            ]);
        });

        await step('Verify the "Email" notifications is checked by default.', async () => {
            for (const checkbox of await settingsNotificationsPage.emailNotificationsCheckbox.all()) {
                expect(checkbox).toBeChecked();
            }
        });

        await step('Verify the "Browser" notifications is checked by default.', async () => {
            for (const checkbox of await settingsNotificationsPage.browserNotificationsCheckbox.all()) {
                expect(checkbox).toBeChecked();
            }
        });

        await step('Verify the "Browser" notifications can be checked / unchecked.', async () => {
            for (const checkbox of await settingsNotificationsPage.browserNotifications.all()) {
                await expect(checkbox).toBeChecked();
                await checkbox.uncheck();
                await expect(checkbox).not.toBeChecked();
                await checkbox.check();
                await expect(checkbox).toBeChecked();
            }
        });
    });

    test('TC_08_03 | Verify user can see pre-defined contact on his Contacts page', async ({
        page,
        loginPage,
        headerComponent,
        settingsGeneralPage,
        contactsPage,
        contactDetailsPage,
    }) => {
        await tags('My profile', 'Contacts');
        await severity('normal');
        await description('To verify, that pre-defined contact is present on the Contacts page');
        await issue(`${QASE_LINK}/01-14`, 'Contacts');
        await tms(`${GOOGLE_DOC_LINK}1a1phpmqi56e`, 'ATC_08_03');
        await epic('My profile');
        await feature('Account settings');

        await loginUser(page, headerComponent, loginPage);

        await headerComponent.clickMyProfileButton();
        await headerComponent.clickAccountSettingsLink();

        await settingsGeneralPage.clickContactsButton();

        await step('Verify user is on the Contacts page.', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.contacts);
        });

        await step('Verify the "Search" field is displayed.', async () => {
            await expect(contactsPage.searchInput).toBeVisible();
            await expect(contactsPage.searchInput).toBeEmpty();
        });

        await step('Verify the "Add new contact" button is displayed.', async () => {
            await expect(contactsPage.addNewContactButton).toBeVisible();
        });

        await step('Verify the "Predefined Contact" card header is displayed.', async () => {
            await expect(contactsPage.predefContactHeader).toBeVisible();
        });

        await step('Verify the "Predefined Contact" card content is displayed.', async () => {
            const keysToCheck = ['alias', 'firstName', 'lastName', 'email'];

            for (const key of keysToCheck) {
                const value = CONTACTS.predefined[key];
                const field = contactsPage.predefinedContactCard.locator('p', { hasText: value, exact: true }).first();
                await expect(field).toBeVisible();
            }
        });

        await contactsPage.clickMoreButtonByContact(CONTACTS.predefined.alias);
        await contactsPage.clickViewFullInfoButton();

        await step('Verify the "Contact details" page is open.', async () => {
            await expect(contactDetailsPage.title).toBeVisible();
        });

        await step('Verify the "Predefined Contact" card header is displayed.', async () => {
            await expect(contactDetailsPage.predefinedContactHeader).toBeVisible();
        });

        await step('Verify the "Predefined Contact" full info is displayed.', async () => {
            for (const value of Object.values(CONTACTS.predefined)) {
                const field = await contactDetailsPage.predefinedContactCard
                    .locator('p', { hasText: `${value}`, exact: true })
                    .first();
                await expect(field).toBeVisible();
            }
        });

        await contactDetailsPage.clickBackToAccountSettingsButton();

        await step('Verify the "Contacts" page is open.', async () => {
            await page.waitForURL(process.env.URL + URL_ENDPOINT.contacts);
            await expect(settingsGeneralPage.contactsButton).toBeVisible();
        });
    });
});
