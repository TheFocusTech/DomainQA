import { DROPDOWN_FIELDS, REQUIRED_FIELDS } from '../../abuseReportData';

export default class ReportAbusePage {
    constructor(page) {
        this.page = page;
        this.abuseTypeDropdown = this.page.getByLabel('Abuse Type');
        this.abuseTypeOption = (abuseType) => this.page.getByRole('option', { name: abuseType });
        this.asteriskLabels = this.page.getByText('*');
        this.labelsPlusAsterisk = this.page.locator('label:has(span.field-control__label-symbol)');
        this.fieldLocator = (fieldName) => this.page.getByLabel(fieldName);
        this.dropdownOptions = this.page.getByRole('option');
        this.checkboxes = this.page.locator('label').filter({ hasText: /\*/ }).locator('div');
        this.submitButton = this.page.locator('button[type="submit"]');
    }

    async getAllLabels() {
        const labels1 = await this.labelsPlusAsterisk.allTextContents();
        const labels2 = await this.asteriskLabels.allTextContents();
        const allLabels = [...labels1, ...labels2];
        return allLabels;
    }

    async clickAbuseTypeDropdown() {
        await this.abuseTypeDropdown.click();
    }
    async selectAbuseType(abuseType) {
        await this.abuseTypeOption(abuseType).click();
    }

    async acceptAllCheckboxes() {
        const count = await this.checkboxes.count();
        for (let i = 0; i < count; i++) {
            await this.checkboxes.nth(i).check();
        }
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async fillRequiredFields() {
        const allLabels = await this.getAllLabels();
        for (const label of allLabels) {
            const fieldLocator = this.fieldLocator(label);
            const normalizedLabel = label.replace('*', '').trim();
            if (DROPDOWN_FIELDS.includes(normalizedLabel)) {
                await fieldLocator.click();
                const options = await this.dropdownOptions;
                const randomIndex = Math.floor(Math.random() * (await options.count()));
                await options.nth(randomIndex).click();
            }
            const value = REQUIRED_FIELDS[normalizedLabel];
            if (value) {
                console.log(`Filling field: ${label} with value: ${value}`);
                await fieldLocator.fill(value);
            }
        }
    }
}
