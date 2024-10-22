import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';

export default class SignupPage {
    constructor(page) {
        this.page = page;

        this.emailAddressInput = this.page.getByPlaceholder('example@gmail.com');
        this.checkboxRecieveEmails = this.page.locator('label').filter({ hasText: "I’d like to receive emails" }).locator('div');
        this.createAccountButton = this.page.getByRole('button', { name: 'Create account' });
        this.errorMessageEmailExist = this.page.locator('p.field-control_field-control__text-error__NtUUK');
      //  this.errorMessageEmailExist = this.page.locator('p.field-control_field-control__text-error__NtUUK', { hasText: 'This email is already registered' });
    }

    async fillEmailAddressInput(email) {
        await step('Fill in "Email" input field.', async () => {
            await this.emailAddressInput.fill(email);
        });
    }
    async selectCheckboxReceiveEmails() {
        await step('Click checkbox "Receive Emails".', async () => {
            await this.checkboxRecieveEmails.click();
        });
    }
    async clickCreateAccount() {
        await step('Click on "Create account" button.', async () => {
            await this.createAccountButton.click();
        });
    }
}