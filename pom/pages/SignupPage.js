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
        this.errorMessageEmailExist = this.page.locator("p[class*='text-error']");
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
}
