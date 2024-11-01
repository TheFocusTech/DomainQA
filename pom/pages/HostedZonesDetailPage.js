import { step } from 'allure-js-commons';

export default class HostedZonesDetailPage {
    constructor(page) {
        this.page = page;

        this.addRecordButton = this.page.getByRole('button', { name: 'Add record' });
        this.hostedZoneModal = this.page.locator('section[role="dialog"]');
        this.backToHostedZonesButton = this.page.getByRole('link', { name: 'Back to Hosted zones' });
        this.dnsManagementRows = this.page.locator('tbody [class*="table-row_table-row"]');
    }

    async clickBackToHostedZonesButton() {
        await step('Click "Back to Hosted zones" button.', async () => {
            await this.backToHostedZonesButton.click();
        });
    }

    async clickAddRecordButton() {
        await step('Click "Add Record" button.', async () => {
            await this.addRecordButton.click();
        });
    }

    async getDnsRecords() {
        let dnsRecords = [];
        const mainRows = await this.dnsManagementRows.all();

        for (const mainRow of mainRows) {
            const nestedRows = await mainRow.locator('[class*="table-body-cell_table-body-cell__content__"]').all();
            const rowNames = ['type', 'name', 'content', 'ttl'];
            let dnsRecord = {};

            for (const [index, nestedRow] of nestedRows.entries()) {
                const textContent = await nestedRow.textContent();
                if (textContent != '') {
                    dnsRecord[rowNames[index]] = textContent.trim();
                }
            }
            dnsRecords.push(dnsRecord);
        }
        return dnsRecords;
    }
}
