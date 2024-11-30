import { expect } from '@playwright/test';
export default class StatusReportAbusePage {
    constructor(page) {
        this.page = page;

        this.returnHomeButton = this.page.getByRole('button', { name: 'Return Home' });
        this.goToTrastnameButton = this.page.getByRole('button', { name: 'Go to Trustname' });
        this.thanksMessage = this.page.getByRole('heading', { name: 'Thank you!' });
        this.confirmationMessage = this.page.getByText('Your report has been');
        this.reportAbuseButton = this.page.getByRole('link', { name: 'Report abuse', exact: true });
    }
    async verifySuccessfulSubmission(email) {
        await expect(this.thanksMessage).toBeVisible();
        await expect(this.confirmationMessage).toContainText(email);
        await expect(this.returnHomeButton).toBeVisible();
        await expect(this.goToTrastnameButton).toBeVisible();
    }

    async clickReportAbuseButton() {
        await this.reportAbuseButton.click();
    }
}
