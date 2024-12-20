import { step } from 'allure-js-commons';
import { DNS_RECORD_DATA } from '../../testData';

export default class DnsRecordModal {
    constructor(page) {
        this.page = page;

        this.dialog = this.page.locator('section[role="dialog"]');
        this.nameInput = this.page.locator('[name="name"]');
        this.commentInput = this.page.locator('textarea[name*="__description"]');
        this.cancelButton = this.page.getByText('Cancel');
        this.saveButton = this.page.getByText('Save');
        this.iconButtonX = this.page.locator('[role="dialog"] button[class*="button-icon-overlay_"]');
        this.copyButton = this.page.locator(
            '[role="dialog"] [class*="button-icon-flat_button-icon-flat--light-mode__"]'
        );
        this.infoIcon = this.page.locator('[class*="input-base_input-base__after-box__"]');
        this.tooltip = this.page.getByText('Enter root domain or domain with subdomains');
        this.rootDomainName = this.page.locator('[class*="create-form_body__description__"] b');
        this.typeDropdown = this.page
            .locator('div')
            .filter({ hasText: /^Type\*A$/ })
            .locator('svg')
            .first();
        this.ttlDropdown = this.page
            .locator('div')
            .filter({ hasText: /^TTL\*Auto$/ })
            .locator('svg');

        this.digestTypeDropdown = this.page
            .locator('div')
            .filter({ hasText: /^Digest type\*SHA-1$/ })
            .locator('svg');

        this.target = this.page.getByPlaceholder('Enter target');
        this.addressIPv4 = this.page.getByPlaceholder('Enter IPv4-address');
        this.addressIPv6 = this.page.getByPlaceholder('Enter IPv6-address');
        this.mailserverInput = this.page.locator('[name="type_mx__mailserver"]');
        this.priorityInput = this.page.locator('[name="type_mx__priority"]');
        this.nameserverInput = this.page.locator('[name="type_ns__nameserver"]');
        this.valueInput = this.page.locator('[name="type_txt__value"]');
        this.keyTag = this.page.getByPlaceholder('Enter key tag number');
        this.algorithm = this.page.locator('input[name="type_ds__algorithm"]');
        this.digest = this.page.locator('input[name="type_ds__digest"]');
        this.title = this.page.locator('[class*="modal-title_modal-title"]');
        this.description = this.page.locator('[class*="create-form_body__description-outer__"]');
    }

    async getRootDomainName() {
        return this.rootDomainName.textContent();
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

    async fillForm(dnsType, withOptionalField) {
        let dnsObj = {};
        const dnsRecordData = DNS_RECORD_DATA[dnsType];

        await step(`Select type ${dnsType}.`, async () => {
            await this.selectDnsType(dnsType);
        });

        dnsObj.ttl = await this.selectTtl();
        dnsObj.name = dnsRecordData.name;
        dnsObj.content = dnsRecordData.expected.content;

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
            case 'DS':
                await step(`Filling data for type: ${dnsType}.`, async () => {
                    await this.nameInput.fill(dnsRecordData.name);
                    await this.keyTag.fill(dnsRecordData.keyTag);
                    await this.algorithm.fill(dnsRecordData.algorithm);
                    await this.selectDigestType();
                    await this.digest.fill(dnsRecordData.digest);
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
                    await this.fillUpName(dnsRecordData.name);
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

        if (withOptionalField === true) {
            await this.commentInput.fill(DNS_RECORD_DATA.comment);
        }
        return dnsObj;
    }

    async selectDnsType(dnsType) {
        const types = {
            A: 0,
            AAAA: 1,
            CNAME: 2,
            DS: 3,
            MX: 4,
            NS: 5,
            TXT: 6,
        };

        const locator = this.dialog.locator('[aria-disabled]');
        const count = await locator.count();

        if (count === 0) {
            await step('Open DNS type dropdown.', async () => {
                await this.typeDropdown.click();
            });
            const optionIndex = types[dnsType];
            const item = this.dialog.locator(`[id*=":-option-${optionIndex}"]`);
            await item.scrollIntoViewIfNeeded();
            await item.click();
        }
    }

    async selectTtl() {
        const arr = ['Auto', '1 min', '2 min', '5 min', '10 min', '30 min', '1 h', '1 d'];
        const index = Math.floor(Math.random() * arr.length);

        await step('Open Ttl  dropdown.', async () => {
            await this.ttlDropdown.click();
        });
        const item = this.dialog.locator(`[id*=":-option-${index}"]`);
        await item.scrollIntoViewIfNeeded();
        await item.click();

        return arr[index];
    }

    async selectDigestType() {
        const arr = ['SHA-1', 'SHA-256', 'GOST R 34.11-94', 'SHA-384'];
        const index = Math.floor(Math.random() * arr.length);
        await step('Open "Digest Type" dropdown.', async () => {
            await this.digestTypeDropdown.click();
        });
        const item = this.dialog.locator(`[id*=":-option-${index}"]`);
        await item.scrollIntoViewIfNeeded();
        await item.click();
        return arr[index];
    }

    async fillUpName(name) {
        const text = await this.nameInput.textContent();
        if (text !== '') {
            await this.nameInput.clear();
        }
        await this.nameInput.fill(name);
    }
}
