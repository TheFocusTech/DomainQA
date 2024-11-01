import { step } from 'allure-js-commons';

export default class FooterComponent {
    constructor(page) {
        this.page = page;

        this.contactUsLink = this.page.getByRole('link', { name: 'Contact Us', exact: true });
        this.reportAbuseLink = this.page.getByRole('link', { name: 'Report Abuse', exact: true });
    }

    async clickContactUsLink() {
        await step('Click on "Contact us" link in Footer.', async () => {
            await this.contactUsLink.click();
        });
    }

    async clickReportAbuseLink() {
        await step('Click on "Report abuse" link in Footer.', async () => {
            await this.reportAbuseLink.click();
        });
    }
}
