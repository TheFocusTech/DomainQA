import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, URL_ENDPOINT } from '../testData';
import { loginUser } from '../helpers/preconditions';

import DnsRecordModal from '../pom/components/modalDialogs/DNSRecordModal';

const ID = '5cac0ad4-633d-4670-b1f2-34ebeadbbda9';

test.describe('Domain', () => {
    test.beforeEach(async ({ page, homePage, loginPage }) => {
        await loginUser(page, homePage, loginPage);
        await page.waitForURL(process.env.URL);

        await step('Navigate to Hosted Zones/Managment for 42.com', async () => {
            await page.goto(`${process.env.URL}${URL_ENDPOINT.hostedZoneManagment}/${ID}`);
        });
    });

    test('TC_04_05_02 | Add new DNS-record modal was closed by Cancel button', async ({ page, hostedZoneDetailPage }) => {
        await tags('Domain', 'Positive');
        await severity('critical');
        await description('Verify DNS Record with required fields');
        await issue(`${QASE_LINK}suite=3&case=7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}n6onfj9qod5d`, 'ATC_04_05_02');
        await epic('Domain');

        await step('Open modal dialog Add record', async () => {
            await hostedZoneDetailPage.clickAddRecordButton();
        });

        const dnsRecorModal = new DnsRecordModal(page);

        await step('Verify Add record modal dialog is visible', async () => {
            await hostedZoneDetailPage.verifyModalDialogIsVisible();
        });

        await step('Close dialog by clicking Cancel', async () => {
            await dnsRecorModal.clickCancelButton();
        });

        await step('Verify Add record modal dialog is not visible', async () => {
            await hostedZoneDetailPage.verifyModalDialogIsNotVisible();
        });
    });

    test('TC_04_05_01 | Add new DNS-record modal was closed by X button', async ({ page, hostedZoneDetailPage }) => {
        await tags('Domain', 'Positive');
        await severity('critical');
        await description('Verify DNS Record with required fields');
        await issue(`${QASE_LINK}suite=3&case=7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}2tly5p2ks4km`, 'ATC_04_05_01');
        await epic('Domain');

        await step('Open modal dialog Add record', async () => {
            await hostedZoneDetailPage.clickAddRecordButton();
        });

        const dnsRecorModal = new DnsRecordModal(page);

        await step('Verify Add record modal dialog is visible', async () => {
            await hostedZoneDetailPage.verifyModalDialogIsVisible();
        });

        await step('Close dialog by clicking X', async () => {
            await dnsRecorModal.clickXButton();
        });

        await step('Verify Add record modal dialog is not visible', async () => {
            await hostedZoneDetailPage.verifyModalDialogIsNotVisible();
        });
    });
});
