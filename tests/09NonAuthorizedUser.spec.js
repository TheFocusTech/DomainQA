import { test } from '../fixtures';
import { expect } from '@playwright/test';
import { description, tag, severity, epic, step, tms, issue } from 'allure-js-commons';
import { QASE_LINK, GOOGLE_DOC_LINK, ACCESSIBLE_PAGE_TITLE, URL_ENDPOINT } from '../testData';

const nonAuthUserAccessiblePageActions = {
    Transfer: async ({ headerComponent }) => await headerComponent.clickTransferLink(),
    HomePage: async ({ headerComponent }) => await headerComponent.clickHomeButton(),
    WhoIs: async ({ headerComponent }) => await headerComponent.clickWhoisLink(),
    SSLCertificates: async ({ headerComponent }) => await headerComponent.clickSslSertificateLink(),
    Blog: async ({ headerComponent }) => await headerComponent.clickBlogButton(),
    HelpCenter: async ({ headerComponent }) => await headerComponent.clickHelpCenterButton(),
    ReportAbuse: async ({ footerComponent }) => await footerComponent.clickReportAbuseLink(),
    ContactUs: async ({ footerComponent }) => await footerComponent.clickContactUsLink(),
};

const accessiblePageRedirectCases = Object.keys(ACCESSIBLE_PAGE_TITLE).map((key) => ({
    linkName: key,
    action: nonAuthUserAccessiblePageActions[key],
    expectedTitle: ACCESSIBLE_PAGE_TITLE[key],
}));

test.describe('Non authorized user', () => {
    test.beforeEach(async ({ page }) => {
        await step('Open web-site as Non authorized user', async () => {
            await page.goto('/');
        });
    });

    accessiblePageRedirectCases.forEach(({ linkName, expectedTitle, action }) => {
        test(`TC_09_01|  Verify that non authorized user can navigate through  ${linkName} page`, async ({
            page,
            headerComponent,
            pageTitleComponent,
            footerComponent,
        }) => {
            await tag('Non_authorized_user');
            await severity('normal');
            await description(`Verify that ${linkName} page is accessible for non authorized user`);
            await issue(`${QASE_LINK}/01-16`, 'Redirect to available pages');
            await tms(`${GOOGLE_DOC_LINK}jcvsnakk56kb`, 'ATC_09_01');
            await epic('Non_authorized_user');

            await action({ headerComponent, footerComponent });
            await step(`Verify user is on ${linkName} page`, async () => {
                await page.waitForURL(process.env.URL + URL_ENDPOINT[linkName]);
                await expect(pageTitleComponent.pageTitle).toContainText(expectedTitle);
            });
        });
    });
});
