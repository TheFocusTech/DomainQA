import { step } from 'allure-js-commons';

export default class createRequestWhois {
    constructor(page) {
        this.page = page;

        this.createRequestWhoisTitle = this.page.getByText('Create request (WHOIS)');
        this.createRequestWhoisText = this.page.getByText('You need to fill out a');
        this.cancelRequestWhois = this.page.locator('button').filter({ hasText: 'Cancel' });
        this.submitRequestWhois = this.page.locator('button').filter({ hasText: 'Submit' });

        this.fullNameInput = this.page.getByPlaceholder('Enter your name');
        this.phoneInput = this.page.getByPlaceholder('+1 000 000 00');
        this.zipCodeInput = this.page.getByPlaceholder('Enter postal code');
        this.cityInput = this.page.getByPlaceholder('Enter your city');
        this.emailInput = this.page.getByPlaceholder('example@mail.com');
        this.countryInput = this.page.locator('.css-nlz5p3');
        this.streetInput = this.page.getByPlaceholder('Enter street');
    }

    async clickCancelButton() {
        await step('Click on "cancel" button', async () => {
            await this.cancelRequestWhois.click();
        });
    }

    async clickSubmitButton() {
        await step('Click on "Submit" button.', async () => {
            await this.submitRequestWhois.click();
        });
    }

    async fillFullNameInput(fullName) {
        await step(`Fill in "Full name" input field`, async () => {
            await this.fullNameInput.fill(fullName);
        });
    }

    async fillStreetInput(address) {
        await step(`Fill street input field`, async () => {
            await this.streetInput.fill(address);
        });
    }

    async fillCityInput(city) {
        await step(`Fill in "City" input`, async () => {
            await this.cityInput.fill(city);
        });
    }

    async fillZipCodeInput(zipCode) {
        await step(`Fill in "Zip Code" input`, async () => {
            await this.zipCodeInput.fill(zipCode);
        });
    }

    async selectCountryByName() {
        await step(`Click on "Country" dropdown and select a country`, async () => {
            await this.countryInput.click();
            await this.page.getByText('United States of America').click();
        });
    }

    async fillPhoneNumberInput(phoneNumber) {
        await step(`Fill in "Phone number" input field`, async () => {
            await this.phoneInput.fill(phoneNumber);
        });
    }

    async fillEmailInput(email) {
        await step('Fill in "Email" input field.', async () => {
            await this.emailInput.fill(email);
        });
    }
}
