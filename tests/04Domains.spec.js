import { test } from '../fixtures';
import { URL_ENDPOINT } from '../testData';
import { loginUser } from '../helpers/preconditions';
import { createHostedZoneAPI, deleteHostedZoneAPI } from '../helpers/apiCalls';
import { getCookies } from '../helpers/utils';
import { step } from 'allure-js-commons';
let headers;
let newHostedZoneId;
let domainName;

test.describe('Domains', () => {
    test.skip('TC_04_02 | Verify search by hosted zone name.', async ({
        page,
        request,
        homePage,
        loginPage,
        hostedZonesPage,
    }) => {
        await step('Preconditions:', async () => {
            await loginUser(page, homePage, loginPage);
            await page.waitForURL(process.env.URL);
        });

        await step('Preconditions: Create hosted zone via API.', async () => {
            headers = await getCookies(page);
            const createdHostedZoneResponse = await createHostedZoneAPI(request, headers);
            newHostedZoneId = createdHostedZoneResponse.id;
            domainName = createdHostedZoneResponse.domain;

            await page.goto(URL_ENDPOINT.hostedZones);
        });

        await hostedZonesPage.waitForHostedZoneIsVisible(domainName);

        await step('Postconditions: Delete hosted zone via API.', async () => {
            await deleteHostedZoneAPI(request, newHostedZoneId, headers);
        });
    });
});
