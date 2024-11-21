import { step } from 'allure-js-commons';

export default class CreateContactPage {
    constructor(page) {
        this.page = page;

        this.createNewContactHeader = this.page.locator('h3:has-text("Create new contact")');
        this.firstNameInput = this.page.locator('[name="firstName"]');
        this.lastNameInput = this.page.locator('[name="lastName"]');
        this.addressLine1Input = this.page.locator('[name="addressLineOne"]');
        this.cityInput = this.page.locator('[name="city"]');
        this.countryInput = this.page.getByRole('combobox');
        this.phoneNumberInput = this.page.locator('[name="phoneNumber"]');
        this.emailInput = this.page.locator('[name="email"]');
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });
        this.loadingSpinner = this.page.locator('svg[class^="spinner_spinner"]');
    }

    async fillFirstNameInputIfEmpty(firstName) {
        await step('Fill in "First name" input field.', async () => {
            const value = await this.firstNameInput.inputValue();
            if (!value) {
                await this.firstNameInput.fill(firstName);
            }
        });
    }

    async fillLastNameInputIfEmpty(lastName) {
        await step('Fill in "Last name" input field.', async () => {
            const value = await this.lastNameInput.inputValue();
            if (!value) {
                await this.lastNameInput.fill(lastName);
            }
        });
    }

    async fillAddressLine1Input(address) {
        await step('Fill in "Address line1" input field.', async () => {
            await this.addressLine1Input.fill(address);
        });
    }

    async fillCityInput(city) {
        await step('Fill in "City" input field.', async () => {
            await this.cityInput.fill(city);
        });
    }

    async selectCountryByName(country) {
        await step('Click on "Country" dropdown and select a country {country}', async () => {
            await this.countryInput.click();
            await this.page.getByRole('option', { name: country }).click();
        });
    }

    async fillPhoneNumberInput(phoneNumber) {
        await step('Fill in "Phone number" input field.', async () => {
            await this.phoneNumberInput.fill(phoneNumber);
        });
    }

    async fillEmailInput(email) {
        await step('Fill in "Email" input field.', async () => {
            await this.emailInput.fill(email);
            await this.loadingSpinner.waitFor({ state: 'visible' });
            await this.loadingSpinner.waitFor({ state: 'hidden' });
        });
    }

    async clickContinueButton() {
        await step('Click on "Continue" button.', async () => {
            await this.continueButton.click();
        });
    }
}
