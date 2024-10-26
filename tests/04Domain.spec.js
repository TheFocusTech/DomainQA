import { test } from '../fixtures';
import { description, tags, severity, epic, step, tms, issue } from 'allure-js-commons';
import { loginUser, createHostedZone } from '../helpers/preconditions';
import { QASE_LINK, GOOGLE_DOC_LINK, HOSTED_ZONE_DOMAIN_NAME } from '../testData';

test.describe('Domain', () => {
    test.beforeEach(async ({ page, homePage, loginPage, hostedZonesPage, createHostedZoneModal }) => {
        await loginUser(page, homePage, loginPage);
        await page.waitForURL(process.env.URL);
        await createHostedZone(page, hostedZonesPage, createHostedZoneModal);

        await step(`Navigate to Hosted Zones/Managment for ${HOSTED_ZONE_DOMAIN_NAME}`, async () => {
            await hostedZonesPage.clickOnHostedZoneName(HOSTED_ZONE_DOMAIN_NAME);
        });
    });

    test('TC_04_10 | "Add new DNS-record" modal was closed by Cancel or by X button', async ({
        hostedZonesDetailPage,
        dnsRecordModal,
    }) => {
        await tags('Domain', 'Positive');
        await severity('normal');
        await description('Verify DNS Record with required fields');
        await issue(`${QASE_LINK}suite=3&case=7`, 'Hosted-Zones');
        await tms(`${GOOGLE_DOC_LINK}2tly5p2ks4km`, 'ATC_04_10');
        await epic('Domain');

        await step('Open modal "Add new DNS-record".', async () => {
            await hostedZonesDetailPage.clickAddRecordButton();
        });

        await step('Verify "Add new DNS-record" modal is visible.', async () => {
            await hostedZonesDetailPage.verifyModalDialogIsVisible();
        });

        await step('Close "Add new DNS-record" by clicking Cancel.', async () => {
            await dnsRecordModal.clickCancelButton();
        });

        await step('Verify "Add new DNS-record" modal is not visible.', async () => {
            await hostedZonesDetailPage.verifyModalDialogIsNotVisible();
        });

        await step('Open "Add new DNS-record" modal.', async () => {
            await hostedZonesDetailPage.clickAddRecordButton();
        });

        await step('Verify "Add new DNS-record" modal is visible.', async () => {
            await hostedZonesDetailPage.verifyModalDialogIsVisible();
        });

        await step('Close dialog by clicking "X".', async () => {
            await dnsRecordModal.clickXButton();
        });

        await step('Verify "Add new DNS-record" modal is not visible.', async () => {
            await hostedZonesDetailPage.verifyModalDialogIsNotVisible();
        });
    });

    test.afterEach(async ({ hostedZonesPage, hostedZonesDetailPage, deleteHostedZoneModal }) => {
        await step(`Delete hosted zone after usage.`, async () => {
            await hostedZonesDetailPage.clickBackToHostedZonesButton();
            await hostedZonesPage.clickBreadcrumbMenuHostedZone();
            await hostedZonesPage.clickDeleteButton();
            await deleteHostedZoneModal.clickDeleteButton();
            await hostedZonesPage.verifyDeleteHostedZoneModalIsNotVisible();
        });

        await step(`Delete hosted zone after usage.`, async () => {});
    });
});
