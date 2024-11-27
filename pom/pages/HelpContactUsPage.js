import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';

export const CONTACT_US_INPUT_NAME = {
    email: 'yourEmail',
    pin: 'pin',
    companyName: 'companyName',
    subject: 'emailSubject',
};

export const CONTACT_US_DROPDOWN = [
    {
        name: 'Account Management & Access',
        subcategories: ['Password Reset', 'Credentials/Username Issues', '2FA Issues', 'Other'],
    },
    {
        name: 'Payment, Sales & Billing Issues',
        subcategories: ['Order Status', 'Declined Payment', 'Refund', 'Invoice', 'Other'],
    },
    {
        name: 'Domains',
        subcategories: [
            'Nameserver Changes',
            'DNSSEC',
            'DNS Records',
            'Transfer to Trustname',
            'Transfer from Trustname',
            'Transfer Disputes',
            'Domain Contact Issue',
            'Whois Verification',
            'Web Forwarding',
            'Renewal',
            'Other',
        ],
    },
    {
        name: 'Pre-Sales',
        subcategories: ['Domains', 'Hosting', 'SSL', 'Other'],
    },
    {
        name: 'Hosting',
        subcategories: [
            'Database',
            'File Transfer',
            'Server Creation',
            'VPS & Dedicated Servers',
            'Blocked Server',
            'Attach to a Domain',
            'Change the Owner',
            'Renewal, Credentials/Access Issues',
            'Other',
        ],
    },
    {
        name: 'SSL',
        subcategories: ['Revocation', 'Other'],
    },
    {
        name: 'Private Email',
        subcategories: [
            'Mailbox Suspended',
            'Configuration',
            'Problems Sending Emails',
            'Problems Receiving Emails',
            'Suspicious Phishing/Hacked Mails',
            'Other',
        ],
    },
    {
        name: 'Affiliate',
        subcategories: [],
    },
    {
        name: 'Bug/Technical Issue',
        subcategories: [],
    },
    {
        name: 'Feature/Product Request',
        subcategories: [],
    },
    {
        name: 'Commercial Matters',
        subcategories: [],
    },
    {
        name: 'Media Inquiries',
        subcategories: [],
    },
    {
        name: 'Feedback',
        subcategories: [],
    },
];

export default class HelpContactUsPage {
    constructor(page) {
        this.page = page;

        this.header = this.page.locator('h1');

        this.startDateField = this.page.getByRole('textbox', { name: 'startDate' });
        this.descriptionField = this.page.locator('textarea[name="description"]');

        this.dropdownMenu = this.page.getByRole('combobox');
        this.items = this.page.getByRole('option');
        this.dropdownPlaceholder = this.page.locator('[class*="placeholder"]');
        this.dropdownValue = this.page.locator('[class*="singleValue"]');

        this.attachFileButton = this.page.getByRole('button', { class: 'files-field__button-attach' });
        this.submitButton = this.page.getByRole('button', { name: 'Submit' });

        this.thankYouAlert = this.page.locator('[class*="alert-base_alert__title"]');
    }

    getInputLocator(name) {
        return this.page.locator(`input[name="${name}"]`);
    }

    async getDropdownLocator(dropdownName) {
        if ((await this.dropdownMenu.count()) > 1) {
            switch (dropdownName) {
                case 'Type':
                    return this.dropdownMenu.first();
                case 'Nature of Request':
                    return this.dropdownMenu.nth(1);
            }
        }
        return this.dropdownMenu;
    }

    async getDropdownPlaceholderLocator(dropdownName) {
        if ((await this.dropdownPlaceholder.count()) > 1) {
            switch (dropdownName) {
                case 'Type':
                    return this.dropdownPlaceholder.first();
                case 'Nature of Request':
                    return this.dropdownPlaceholder.nth(1);
            }
        }
        return this.dropdownPlaceholder;
    }

    async getDropdownValueLocator(dropdownName) {
        if ((await this.dropdownValue.count()) > 1) {
            switch (dropdownName) {
                case 'Type':
                    return this.dropdownValue.first();
                case 'Nature of Request':
                    return this.dropdownValue.nth(1);
            }
        }
        return this.dropdownValue;
    }

    async fillInputField(name, value) {
        await step(`Fill the "${name}" input field.`, async () => {
            let inputField = this.getInputLocator(name);
            await inputField.fill(value);
        });
    }

    async fillDescriptionField(text) {
        await step('Fill the description area.', async () => {
            await this.descriptionField.fill(text);
        });
    }

    async clickDropdownMenu(dropdownName) {
        await step('Click on "Type" dropdown menu', async () => {
            let dropdownMenu = await this.getDropdownLocator(dropdownName);
            await dropdownMenu.click();
        });
    }

    async clickSubmitButton() {
        await this.submitButton.click();
    }

    async getDropdownCount() {
        return await this.dropdownMenu.count();
    }

    async selectDropdownItem(value) {
        await step('Select the type of message from dropdown menu.', async () => {
            const dropdownItem = this.page.getByRole('option', { name: `${value}` });
            await dropdownItem.click();
        });
    }

    async isInputVisible(fieldName) {
        let fieldLocator = this.getInputLocator(fieldName);
        await step(`Verify is "${fieldName}" input field visible`, async () => {
            await expect(fieldLocator).toBeVisible();
        });
    }

    async isDropdownVisible(dropdownName) {
        await step(`Verify is "${dropdownName}" dropdown visible`, async () => {
            let dropdownMenu = await this.getDropdownLocator(dropdownName);
            await expect(dropdownMenu).toBeVisible();
        });
    }

    async isHeaderVisible() {
        await step('Verify is Header visible', async () => {
            await expect(this.header).toBeVisible();
        });
    }

    async isDescriptionVisible() {
        await step('Verify is "Description" area visible', async () => {
            await expect(this.descriptionField).toBeVisible();
        });
    }

    async isSubmitButtonVisible() {
        await step('Verify is "Submit" button visible', async () => {
            await expect(this.submitButton).toBeVisible();
        });
    }

    async isThankYouAlertVisible() {
        await step('Verify is "Thenk you!" alert visible', async () => {
            await expect(this.thankYouAlert).toBeVisible();
        });
    }

    async verifyDropdownItems(type) {
        await step(`Verify is the list of dropdown items corresponds to the "${type}".`, async () => {
            let dropdownItems = await this.items.allInnerTexts();
            let subItems =
                type === 'Type'
                    ? CONTACT_US_DROPDOWN.map((c) => c.name)
                    : CONTACT_US_DROPDOWN.find((c) => c.name === type).subcategories;
            let dropdownItemsSorted = dropdownItems.sort();
            let subItemsSorted = subItems.sort();
            console.log('->', dropdownItemsSorted);
            console.log('->', subItemsSorted);
            expect(
                dropdownItemsSorted.length === subItemsSorted.length &&
                    dropdownItemsSorted.every((value, index) => value === subItemsSorted[index])
            ).toBeTruthy();
        });
    }

    async verifyInputPlaceholder(elementName, value) {
        let elementLocator = await this.getInputLocator(elementName);
        await step(`Verify placeholder of the ${elementName}`, async () => {
            await expect(elementLocator).toHaveAttribute('placeholder', value);
        });
    }

    async verifyDropdownPlaceholder(dropdownName, value) {
        await step(`Verify placeholder of the "${dropdownName}" dropdown`, async () => {
            let dropdownMenu = await this.getDropdownPlaceholderLocator(dropdownName);
            await expect(dropdownMenu).toHaveText(value);
        });
    }

    async verifyDropdownValue(dropdownName, value) {
        await step(`Verify placeholder of the "${dropdownName}" dropdown`, async () => {
            let dropdownMenu = await this.getDropdownValueLocator(dropdownName);
            await expect(dropdownMenu).toHaveText(value);
        });
    }

    async verifyDescriptionPlaceholder(value) {
        await step('Verify placeholder of the "Descroption" area', async () => {
            await expect(this.descriptionField).toHaveAttribute('placeholder', value);
        });
    }

    async verifyInputValue(elementName, value) {
        let elementLocator = await this.getInputLocator(elementName);
        await step(`Verify velue of the ${elementName} input field`, async () => {
            await expect(elementLocator).toHaveAttribute('value', value);
        });
    }

    async verifyDescriptionText(value) {
        await step('Verify text of the Description area', async () => {
            await expect(this.descriptionField).toHaveText(value);
        });
    }

    async verifyHeaderText(value) {
        await step('Verify header text', async () => {
            await expect(this.header).toHaveText(value);
        });
    }

    async verifyThankYouAlertText(value) {
        await step('Verify text of the "Thank you" alert', async () => {
            await expect(this.thankYouAlert).toHaveText(value);
        });
    }
}
