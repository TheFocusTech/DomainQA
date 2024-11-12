import { step } from 'allure-js-commons';

export default class SettingsGeneralPage {
    constructor(page) {
        this.page = page;

        this.changeButton = this.page.getByRole('button', { name: 'Change' });
        this.deleteAccountButton = this.page.locator('button:has-text("Delete account")');
        this.generalInfoButton = this.page.locator('button:has-text("General info")');
        this.messageAboutDeletion = this.page.locator('p:has-text("This account will be deleted in 30 days")');
        this.dateOfDeletion = this.page.locator('p:has-text("Date of deletion:")');
        this.cancelDeletionButton = this.page.locator('button:has-text("Cancel deletion")');
        this.twoFAToggle = this.page.locator('[class*="switch-2fa_switch-2fa__"]');
        this.checkbox = this.page.locator('[type="checkbox"]');
        this.disableTooltip = this.page.getByText('Two-factor authentication disabled');
        this.enableTooltip = this.page.getByText('Two-factor authentication enable');
        this.currencyButton = this.page.locator('.profile-currency-block button');
        this.currencyType = this.page.locator('.profile-currency-block button span[class*="text"]');
        this.notificationSettingsButton = this.page.getByRole('button', { name: 'Notification settings' });
        this.contactsButton = this.page.getByRole('button', { name: 'Contacts' });
    }

    async clickTwoFAToggle() {
        await this.twoFAToggle.click();
    }

    async clickChangeButton() {
        await step('Click on the "Change" button.', async () => {
            await this.changeButton.click();
        });
    }

    async clickDeleteAccountButton() {
        await step('Click on the "Delete account" button.', async () => {
            await this.deleteAccountButton.click();
        });
    }

    async clickCancelDeletionButton() {
        await step('Click on the "Cancel Deletion" button.', async () => {
            await this.cancelDeletionButton.click();
        });
    }

    async clickCurrencyButton() {
        await step('Click on the currency button.', async () => {
            await this.currencyButton.click();
        });
    }

    async isCurrencyTypeSet(type) {
        return await step('Get currency type value.', async () => {
            return (await this.currencyType.innerText()) === type;
        });
    }

    async changeCurrencyType(type) {
        return await step(`Change currency to the ${type}.`, async () => {
            await this.clickCurrencyButton();
            await this.clickCurrencyTypeDropdown(type);
            await this.clickCurrencyButton();
        });
    }

    async clickCurrencyTypeDropdown(type) {
        return await step(`Click ${type} type currency dropdown.`, async () => {
            await this.page.getByRole('button', { name: `${type}` }).click();
        });
    }

    async getCurrencyTypeSelected(type) {
        return await step('Get currency selected type.', async () => {
            return this.page.locator(`li[class*="menu-item"] span:has-text("${type}") + span`);
        });
    }

    async clickNotificationSettingsButton() {
        await step('Click on the "Notification settings" button.', async () => {
            await this.notificationSettingsButton.click();
        });
    }

    async clickContactsButton() {
        return await step('Click on the "Contacts" button.', async () => {
            await this.contactsButton.click();
        });
    }
}
