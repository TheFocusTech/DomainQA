import { step } from 'allure-js-commons';

export default class FooterComponent {
    constructor(page) {
        this.page = page;

        this.contactUsLink = this.page.getByRole('link', { name: 'Contact Us', exact: true });
        this.reportAbuseLink = this.page.getByRole('link', { name: 'Report Abuse', exact: true });
        this.logo = this.page.locator('footer a[class^="logo"]');
        this.domainSearchLink = this.page.getByRole('link', { name: 'Domain Name Search', exact: true });
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

    async clickLogo() {
        await step('Click on the Logo in Footer.', async () => {
            await this.logo.click();
        });
    }

    async clickDomainSearchLink() {
        await step('Click on "Domain Name Search" link in Footer.', async () => {
            await this.domainSearchLink.click();
        });
    }
}
