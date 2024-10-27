import { API_ENDPOINT } from '../testData';
import { getRandomDomainName } from './utils';

function getAuthHeaders(headers) {
    const { 'dr.token': authToken, 'dr.scrf-token': xsrfToken, _csrf: csrfCookie } = headers;
    return {
        Authorization: `Bearer ${authToken}`,
        'x-csrf-token': xsrfToken,
        Cookie: `_csrf=${csrfCookie}`,
    };
}

export async function getHostedZonesAPI(request, headers) {
    const authHeaders = getAuthHeaders(headers);

    const getHostedZonesResponse = await request.get(`${process.env.API_URL}${API_ENDPOINT.getHostedZones}`, {
        headers: authHeaders,
    });
    if (!getHostedZonesResponse.ok()) {
        console.error(`Failed to get hosted zones: ${getHostedZonesResponse.statusText()}`);
    }
    const hostedZonesData = await getHostedZonesResponse.json();
    const hostedZoneCount = hostedZonesData.meta.total;
    console.log(`Total number of hosted zones: ${hostedZoneCount}`);

    return hostedZoneCount;
}

export async function createHostedZoneAPI(request, headers) {
    const authHeaders = getAuthHeaders(headers);
    const domainName = await getRandomDomainName();

    const createHostedZoneResponse = await request.post(`${process.env.API_URL}${API_ENDPOINT.createHostedZone}`, {
        headers: authHeaders,
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
    const authHeaders = getAuthHeaders(headers);

    const deleteResponse = await request.delete(`${process.env.API_URL}${API_ENDPOINT.deleteHostedZone}${id}`, {
        headers: authHeaders,
    });
    if (!deleteResponse.ok()) {
        console.error(`Failed to delete hosted zone: ${deleteResponse.statusText()}`);
    }
    console.log(`Deleted hosted zone with id ${id}`);
}
