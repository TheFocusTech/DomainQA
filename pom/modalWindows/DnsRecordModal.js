import { step } from 'allure-js-commons';
import { DNS_RECORD_DATA } from '../../testData';

export default class DnsRecordModal {
    constructor(page) {
        this.page = page;

        this.dialog = this.page.locator('section[role="dialog"]');
        this.nameInput = this.page.getByPlaceholder('Enter name');
        this.commentInput = this.page.locator('textarea[name*="__description"]');
        this.cancelButton = this.page.getByText('Cancel');
        this.saveButton = this.page.getByText('Save');
        this.iconButtonX = this.page.locator('[role="dialog"] button[class*="button-icon-overlay_"]');
        this.typeDropdown = this.page
            .locator('div')
            .filter({ hasText: /^Type\*A$/ })
            .locator('svg')
            .first();
        this.ttlDropdown = this.page
            .locator('div')
            .filter({ hasText: /^TTL\*Auto$/ })
            .locator('svg');

        this.target = this.page.getByPlaceholder('Enter target');
        this.addressIPv4 = this.page.getByPlaceholder('Enter IPv4-address');
        this.addressIPv6 = this.page.getByPlaceholder('Enter IPv6-address');
        this.target = this.page.getByPlaceholder('Enter target');
        this.mailserverInput = this.page.locator('[name="type_mx__mailserver"]');
        this.priorityInput = this.page.locator('[name="type_mx__priority"]');
        this.nameserverInput = this.page.locator('[name="type_ns__nameserver"]');
        this.valueInput = this.page.locator('[name="type_txt__value"]');
        this.keyTag = this.page.getByPlaceholder('Enter key tag number');
        this.algorithm = this.page.locator('input[name="type_ds__algorithm"]');
        this.digestInput = this.page.locator('input[name="type_ds__digest"]');
    }

    async clickSaveButton() {
        await step('Click save button.', async () => {
            await this.saveButton.click();
        });
    }

    async clickCancelButton() {
        await step('Click cancel button.', async () => {
            await this.cancelButton.click();
        });
    }

    async clickXButton() {
        await step('Click X button.', async () => {
            await this.iconButtonX.click();
        });
    }

    async fillForm(dnsType) {
        const dnsRecordData = DNS_RECORD_DATA[dnsType];

        await step(`Select type ${dnsType}.`, async () => {
            await this.selectDnsType(dnsType);
        });

        await step(`Select TTL.`, async () => {
            await this.selectTtl();
        });

        switch (dnsType) {
            case 'A':
                await step(`Filling data for type: ${dnsType}.`, async () => {
                    await this.nameInput.fill(dnsRecordData.name);
                    await this.addressIPv4.fill(dnsRecordData.addressIPv4);
                });
                break;
            case 'AAAA':
                await step(`Filling data for type: ${dnsType}.`, async () => {
                    await this.nameInput.fill(dnsRecordData.name);
                    await this.addressIPv6.fill(dnsRecordData.addressIPv6);
                });
                break;
            case 'CNAME':
                await step(`Filling data for type: ${dnsType}.`, async () => {
                    await this.nameInput.fill(dnsRecordData.name);
                    await this.target.fill(dnsRecordData.target);
                });
                break;
            case 'MX':
                await step(`Filling data for type: ${dnsType}.`, async () => {
                    await this.nameInput.fill(dnsRecordData.name);
                    await this.mailserverInput.fill(dnsRecordData.mailserver);
                    await this.priorityInput.fill(dnsRecordData.priority);
                });
                break;
            case 'NS':
                await step(`Filling data for type: ${dnsType}.`, async () => {
                    await this.nameInput.fill(dnsRecordData.name);
                    await this.nameserverInput.fill(dnsRecordData.nameserver);
                });
                break;
            case 'TXT':
                await step(`Filling data for type: ${dnsType}.`, async () => {
                    await this.nameInput.fill(dnsRecordData.name);
                    await this.valueInput.fill(dnsRecordData.value);
                });
                break;
            default:
                throw new Error(`Unsupported form type: ${dnsType}`);
        }

        await this.commentInput.fill(DNS_RECORD_DATA.comment);
    }

    async selectDnsType(dnsType) {
        await step('Open DNS type dropdown.', async () => {
            await this.typeDropdown.click();
        });
        await this.page.locator('section[role="dialog"]').getByText(dnsType).click();
    }

    async selectTtl() {
        const arr = ['Auto', '1 min', '2 min', '5 min', '10 min', '30 min', '1 h', '1 d'];
        const index = Math.floor(Math.random() * arr.length);
        await this.ttlDropdown.click();
        await this.dialog.getByText(arr[index]).click();
    }
}
