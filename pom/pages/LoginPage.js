import { step } from 'allure-js-commons';
import { expect } from '@playwright/test';

export default class LoginPage {
    constructor(page) {
        this.page = page;

        this.emailAddressInput = this.page.getByPlaceholder('example@gmail.com');
        this.passwordInput = this.page.getByPlaceholder('Enter password');
        this.loginButton = this.page.getByRole('button', { name: 'Log in' });
        this.signUpLink = this.page.getByRole('link', { name: 'Sign up' });
        this.forgotPasswordLink = this.page.getByRole('button', { name: 'Forgot password?' });
    }

    async fillEmailAddressInput(email) {
        await step('Fill in "Email" input field.', async () => {
            await this.emailAddressInput.fill(email);
        });
    }

    async fillPasswordInput(password) {
        await step('Fill in "Password" input field.', async () => {
            await this.passwordInput.fill(password);
        });
    }

    async clickLogin() {
        await step('Click on "Log in" button.', async () => {
            await this.loginButton.click();
        });
    }

    async verifyLoginFormUI() {
        await step('Verify the login form UI elements', async () => {
            await expect(this.signUpLink).toBeVisible();
            await expect(this.emailAddressInput).toBeVisible();
            await expect(this.passwordInput).toBeVisible();
            await expect(this.forgotPasswordLink).toBeVisible();
            await expect(this.loginButton).toBeVisible();
        });
    }
}
