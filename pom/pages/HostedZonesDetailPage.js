import { step } from 'allure-js-commons';

export default class HostedZonesDetailPage {
    constructor(page) {
        this.page = page;

        this.addRecordButton = this.page.getByRole('button', { name: 'Add record' });
        this.hostedZoneModal = this.page.locator('section[role="dialog"]');
        this.backToHostedZonesButton = this.page.getByRole('link', { name: 'Back to Hosted zones' });
        this.dnsManagementRows = this.page.locator('tbody [class*="table-row_table-row"]');
        this.hostedZonesDetailTitle = this.page.locator('h1[class*="management-detail-page"]');
        this.dnssecCardHeader = this.page.getByRole('heading', { name: 'DNSSEC' });
        this.notUsingDnssecWarning = this.page.locator('p:has-text("Your hosted zone is not using DNSSEC.")');
        this.dnssecActivationWarning = this.page.locator(
            'p:has-text("The activation process of DNSSEC is currently underway. It will take some time.")'
        );
        this.dnssecDescription = this.page.locator(
            'p:has-text("DNSSEC uses a cryptographic signature of published DNS records to protect your domain against forged DNS answers.")'
        );
        this.enableDnssecButton = this.page.getByRole('button', { name: 'Enable DNSSEC' });
        this.disableDnssecButton = this.page.getByRole('button', { name: 'Disable DNSSEC' });
        this.getDnssecInfoButton = this.page.getByRole('button', { name: 'Get DNSSEC info' });
        this.kebabMenu = this.page.locator('button[class*="button-icon-overlay"]').first();
        this.editButton = this.page.getByRole('button', { name: 'Edit' });
        this.allkebabMenus = this.page.locator('button[class*="button-icon-overlay"]');
        this.deleteDNSlink = this.page.getByRole('button', { name: 'Delete' });
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

    async clickEnableDnssecButton() {
        await step('Click "Enable DNSSEC" button.', async () => {
            await this.enableDnssecButton.click();
        });
    }

    async findAddedRecord(dnsType, dnsObj) {
        await this.page.waitForLoadState('domcontentloaded');

        const dnsResords = await this.getDnsRecords();
        return dnsResords.find((obj) => {
            return (
                obj.type === dnsType &&
                obj.name === dnsObj.name &&
                obj.content === dnsObj.content &&
                obj.ttl === dnsObj.ttl
            );
        });
    }

    async clickKebabMenuMenuHostedZone() {
        await step('Click on breadcrumb menu for dns record', async () => {
            await this.kebabMenu.scrollIntoViewIfNeeded();
            await this.kebabMenu.waitFor({ state: 'attached' });
            await this.kebabMenu.click();
        });
    }

    async isDeleteLinkVisible() {
        return await this.deleteDNSlink.isVisible();
    }

    async clickDeleteLink() {
        await this.deleteDNSlink.click();
    }

    async clickKebabMenuForRecords() {
        await step('Click on  kebab-menu for each DNS record in the list', async () => {
            const kebabMenus = await this.allkebabMenus.all();
            for (const menu of kebabMenus) {
                await menu.click();
                if (await this.isDeleteLinkVisible()) {
                    return true;
                } else {
                    await menu.click();
                }
            }
            return false;
        });
    }
}
