import { expect } from '@playwright/test';
import { REQUIRED_FIELDS } from '../../abuseReportData';
export default class StatusReportAbusePage {
    constructor(page) {
        this.page = page;

        this.returnHomeButton = this.page.getByRole('button', { name: 'Return Home' });
        this.goToTrastnameButton = this.page.getByRole('button', { name: 'Go to Trustname' });
        this.thanksMessage = this.page.getByRole('heading', { name: 'Thank you!' });
        this.confirmationMessage = this.page.getByText('Your report has been');
    }
    async verifySuccessfulSubmission(yourEmail) {
        const confirmationText = await this.confirmationMessage.textContent();
        expect(confirmationText.toLowerCase()).toContain(yourEmail.toLowerCase());
        await expect(this.confirmationMessage).toBeVisible();
        await expect(this.thanksMessage).toBeVisible();
        await expect(this.returnHomeButton).toBeVisible();
        await expect(this.goToTrastnameButton).toBeVisible();
    }

}
