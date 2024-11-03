import { test } from '../fixtures';
import { expect } from '@playwright/test';
import { description, tags, severity, epic, step, tms, issue, feature } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, PASSWORD, TOAST_MESSAGE, MY_PROFILE_ITEMS, URL_ENDPOINT } from '../testData';
import { loginUser } from '../helpers/preconditions';

test.describe('My profile', () => {
    test('TC_08_01 | Verify the Profile Dropdown Menu is displayed on "My Profile" Button Click', async ({
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
        await description('To verify, that user can see pre-defined contact on his Contacts page');
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
            await expect(contactsPage.predefinedContactHeader).toBeVisible();
        });

        await contactsPage.clickMoreButton();
        await contactsPage.clickViewFullInfoButton();

        await step('Verify the "Contact details" page is open.', async () => {
            await expect(contactDetailsPage.title).toBeVisible();
        });

        await step('Verify the "Predefined Contact" card header is displayed.', async () => {
            await expect(contactDetailsPage.predefinedContactHeader).toBeVisible();
        });

        await step('Verify the "Predefined Contact" full info is displayed.', async () => {
            await expect(contactDetailsPage.groupTitles).toHaveText(['General info', 'Location', 'Contact info']);
            const contentTexts = await contactDetailsPage.predefinedContactContent.allTextContents();

            // const expectedTexts = [
            //     'AliasUse a pre-defined contact (free and recommended option) as the first layer of WHOIS privacyFirst nameRegistrationLast namePrivateCompany Name or OrganizationPerfect Privacy LLC c/o trustname.comJob TitleChief Privacy Defender',
            //     'Address line 1Harakiri.orgAddress line 2Hamilton Development Unit BCityCharlestownState / ProvinceNevis West IndiesZIP / Postal code00000CountryKN',
            //     'Phone number+19179671610Fax numberNo details addedEmail000001025-protected@harakiri.orgEmail (for Whois)Fill out the Contact Domain Owner form at https://harakiri.org/contact/',
            // ];
            const expectedTexts = [
                'Alias Use a pre-defined contact (free and recommended option) as the first layer of WHOIS privacy First name Registration Last name Private Company Name or Organization Perfect Privacy LLC c/o trustname.com Job Title Chief Privacy Defender',
                'Address line 1 Harakiri.org Address line 2 Hamilton Development Unit B City Charlestown State / Province Nevis West Indies ZIP / Postal code 00000 Country KN',
                'Phone number +19179671610 Fax number No details added Email 000001025-protected@harakiri.org Email (for Whois) Fill out the Contact Domain Owner form at https://harakiri.org/contact/',
            ];

            const normalizedContentTexts = contentTexts.map((text) => text.replace(/\s+/g, ' '));

            for (let i = 0; i < expectedTexts.length; i++) {
                expect(normalizedContentTexts[i]).toContain(expectedTexts[i]);
            }

            // for (let i = 0; i < expectedTexts.length; i++) {
            //     expect(contentTexts[i]).toContain(expectedTexts[i]);
            // }
        });
    });
});
