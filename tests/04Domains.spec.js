import { test } from '../fixtures';
import { URL_ENDPOINT } from '../testData';
import { loginUser } from '../helpers/preconditions';
import { createHostedZoneAPI, deleteHostedZoneAPI, getHostedZonesAPI } from '../helpers/apiCalls';
import { getCookies } from '../helpers/utils';
import { step } from 'allure-js-commons';
import { expect } from 'allure-playwright';
let headers;
let newHostedZoneId;
let domainName;
let hostedZoneCount;

test.describe('Domains', () => {
    test.skip('TC_04_02 | Verify search by hosted zone name.', async ({
        page,
        request,
        homePage,
        loginPage,
        hostedZonesPage,
    }) => {
        await step('Preconditions: Login as a registered user', async () => {
            await loginUser(page, homePage, loginPage);
            await page.waitForURL(process.env.URL);
        });

        await step('Preconditions: Create hosted zone via API.', async () => {
            headers = await getCookies(page);

            const createdHostedZoneResponse = await createHostedZoneAPI(request, headers);
            newHostedZoneId = createdHostedZoneResponse.id;
            domainName = createdHostedZoneResponse.domain;

            hostedZoneCount = await getHostedZonesAPI(request, headers);

            await page.goto(URL_ENDPOINT.hostedZones);
        });

        await hostedZonesPage.waitForHostedZoneIsVisible(domainName);

        await step('Postconditions: Delete hosted zone via API.', async () => {
            await deleteHostedZoneAPI(request, newHostedZoneId, headers);

            const hostedZoneCountAfter = await getHostedZonesAPI(request, headers);

            expect(hostedZoneCountAfter).toEqual(hostedZoneCount - 1);
        });
    });
});
