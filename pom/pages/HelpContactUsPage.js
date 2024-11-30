import { step } from 'allure-js-commons';

export default class HelpContactUsPage {
    constructor(page) {
        this.page = page;

        this.emailInput = this.page.getByPlaceholder('Enter your email');
        this.typeDropdown = this.page.getByRole('combobox');
        this.requestTypeDropdown = this.page.getByRole('combobox').nth(1);
        this.subjectInput = this.page.getByPlaceholder('Choose a clear and precise subject');
        this.descriptionInput = this.page.getByPlaceholder(
            'Describe your problem and its context as clearly as possible'
        );
        this.submitButton = this.page.getByRole('button', { name: 'Submit' });
        this.heading = this.page.locator('.page-report  h2');
        this.successMessage = this.page.locator('h2+p');
        this.returnHomeButton = this.page.getByRole('link', { name: 'Return Home' });
        this.goToTrustnameButton = this.page.getByRole('link', { name: 'Go to Trustname' });
    }

    async fillEmailInput(email) {
        await step('Fill in the "Email" input field.', async () => {
            this.emailInput.waitFor({ state: 'visible' });
            this.emailInput.fill(email);
        });
    }

    async clickTypeDropdown() {
        await step('Open the "Type" dropdown list.', async () => {
            this.typeDropdown.click();
        });
    }

    async chooseTypeOption(name) {
        await step(`Choose ${name} from dropdown list.`, async () => {
            await this.page.getByRole('option', { name: name }).waitFor({ state: 'visible' });
            await this.page.getByRole('option', { name: name }).click();
        });
    }

    async clickRequestTypeDropdown() {
        await step('Open the "Nature of Request" dropdown list.', async () => {
            this.requestTypeDropdown.click();
        });
    }

    async fillSubjectInput(subject) {
        await step('Fill in the "Email subject" input field.', async () => {
            this.subjectInput.waitFor({ state: 'visible' });
            this.subjectInput.fill(subject);
        });
    }
    async filldescriptionInput(description) {
        await step('Fill in the "Description" input field.', async () => {
            this.descriptionInput.waitFor({ state: 'visible' });
            this.descriptionInput.fill(description);
        });
    }

    async clickSubmitButton() {
        await step('Click on the "Submit" button.', async () => {
            await this.submitButton.click();
        });
    }

    async randomlyClickButton(n) {
        switch (n) {
            case 0:
                this.returnHomeButton.click();
                break;
            case 1:
                this.goToTrustnameButton.click();
                break;
        }
    }
}
