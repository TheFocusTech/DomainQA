import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { getCookies } from '../helpers/utils';
import { API_ENDPOINT } from '../testData';
import { getHostedZonesAPI } from '../helpers/apiCalls';

test('API - UI', async ({ request, hostedZonesPage, page }) => {
    const resLogin = await request.post(`${process.env.API_URL}${API_ENDPOINT.login}`, {
        data: {
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD,
        },
    });

    const { accessToken: bearerToken, csrfToken } = await resLogin.json();
    const setCookieHeader = resLogin.headers()['set-cookie'] || '';
    const cookies = setCookieHeader.split(',').map((cookie) => cookie.split(';')[0]);
    const csrfCookie = cookies.find((cookie) => cookie.startsWith('_csrf='));
    const csrfCookieValue = csrfCookie ? csrfCookie.replace('_csrf=', '') : null;
    const webDomain = process.env.URL.replace(/^https?:\/\//, '');
    const apiDomain = process.env.API_URL.replace(/^https?:\/\//, '');

    // console.log({ bearerToken, csrfToken, csrfCookieValue });

    await page.context().addCookies([
        {
            name: 'dr.token',
            value: bearerToken,
            domain: webDomain,
            path: '/',
        },
        {
            name: 'dr.scrf-token',
            value: csrfToken,
            domain: webDomain,
            path: '/',
        },
        {
            name: '_csrf',
            value: csrfCookieValue,
            domain: apiDomain,
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        },
        {
            name: 'dr.is-email-verified',
            value: 'true',
            domain: webDomain,
            path: '/',
        },
        {
            name: 'dr.is-sign-up-end',
            value: 'true',
            domain: webDomain,
            path: '/',
        },
    ]);

    const headers = await getCookies(page);
    const res = await getHostedZonesAPI(request, headers);
    console.log(res);

    // UI
    await page.goto(process.env.URL);

    await hostedZonesPage.open();
    await expect(hostedZonesPage.createHostedZoneButton).toBeVisible();
});
