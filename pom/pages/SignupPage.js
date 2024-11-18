import { step } from 'allure-js-commons';

export default class SignupPage {
    constructor(page) {
        this.page = page;

        this.emailAddressInput = this.page.getByPlaceholder('example@gmail.com');
        this.checkboxRecieveEmails = this.page
            .locator('label')
            .filter({ hasText: 'I’d like to receive emails' })
            .locator('div');
        this.createAccountButton = this.page.getByRole('button', { name: 'Create account' });
        this.errorMessageEmail = this.page.locator("p[class*='text-error']");
        this.loginLink = this.page.getByRole('link', { name: 'Log in' });
        this.termsOfUseLink = this.page.getByRole('link', { name: 'Term of use' });
        this.privacyPolicyLink = this.page.getByRole('link', { name: 'Privacy Policy' });
        this.createPasswordHeader = this.page.locator('h1:has-text("Create password")');
        this.backToSignUpButton = this.page.getByRole('button', { name: 'Back to Sign up' });
        this.passwordInput = this.page.getByPlaceholder('Enter password');
        this.repeatPasswordInput = this.page.getByPlaceholder('Repeat password');
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });
        this.createPasswordHeader = this.page.locator('h1:has-text("Create password")');
        this.createNewContactHeader = this.page.locator('h3:has-text("Create new contact")');
    }

    async fillEmailAddressInput(email) {
        await step('Fill in "Email" input field.', async () => {
            await this.emailAddressInput.fill(email);
        });
    }
    async selectCheckboxReceiveEmails() {
        await step('Click checkbox "Receive emails".', async () => {
            await this.checkboxRecieveEmails.click();
        });
    }
    async clickCreateAccount() {
        await step('Click on "Create account" button.', async () => {
            await this.createAccountButton.click();
        });
    }

    async clickBackToSignUpButton() {
        await step('Click on "Back to Sign up" button.', async () => {
            await this.backToSignUpButton.click();
        });
    }

    async fillPasswordInput(password) {
        await step('Fill in "Password" input field.', async () => {
            await this.passwordInput.fill(password);
        });
    }

    async fillRepeatPasswordInput(repeatPassword) {
        await step('Fill in "Repeat password" input field.', async () => {
            await this.repeatPasswordInput.fill(repeatPassword);
        });
    }

    async clickContinueButton() {
        await step('Click on "Continue" button.', async () => {
            await this.continueButton.click();
        });
    }
}
