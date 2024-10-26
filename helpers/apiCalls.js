import { API_ENDPOINT } from '../testData';
import { getRandomDomainame } from './utils';

export async function createHostedZoneAPI(request, headers) {
    const domainName = await getRandomDomainame();
    const { 'dr.token': authToken, 'dr.scrf-token': xsrfToken, _csrf: csrfCookie } = headers;
    const createHostedZoneResponse = await request.post(`${process.env.API_URL}${API_ENDPOINT.createHostedZone}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
            'x-csrf-token': xsrfToken,
            Cookie: `_csrf=${csrfCookie}`,
        },
        data: {
            domain: domainName,
        },
    });
    if (!createHostedZoneResponse.ok()) {
        console.error(`Failed to create hosted zone: ${createHostedZoneResponse.statusText()}`);
    }
    const createHostedZoneData = await createHostedZoneResponse.json();
    const hostedZoneId = createHostedZoneData.id;
    console.log(`Created hosted zone ${domainName} with id ${hostedZoneId}`);

    return createHostedZoneData;
}

export async function deleteHostedZoneAPI(request, id, headers) {
    const { 'dr.token': authToken, 'dr.scrf-token': xsrfToken, _csrf: csrfCookie } = headers;
    const deleteResponse = await request.delete(`${process.env.API_URL}${API_ENDPOINT.deleteHostedZone}${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
            'x-csrf-token': xsrfToken,
            Cookie: `_csrf=${csrfCookie}`,
        },
    });
    if (!deleteResponse.ok()) {
        console.error(`Failed to delete hosted zone: ${deleteResponse.statusText()}`);
    }
    console.log(`Deleted hosted zone with id ${id}`);
}
