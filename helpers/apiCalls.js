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

    try {
        const getHostedZonesResponse = await request.get(`${process.env.API_URL}${API_ENDPOINT.getHostedZones}`, {
            headers: authHeaders,
        });
        if (!getHostedZonesResponse.ok()) {
            throw new Error(`GET hosted zones request failed with status: ${getHostedZonesResponse.status}`);
        }
        const hostedZonesData = await getHostedZonesResponse.json();
        const hostedZoneCount = hostedZonesData.meta.total;
        console.log(`Total number of hosted zones: ${hostedZoneCount}`);

        return hostedZoneCount;
    } catch (error) {
        console.error(`An error occurred while getting hosted zones: ${error.message}`);
        return null;
    }
}

export async function createHostedZoneAPI(request, headers) {
    const authHeaders = getAuthHeaders(headers);
    const domainName = await getRandomDomainName();

    try {
        const createHostedZoneResponse = await request.post(`${process.env.API_URL}${API_ENDPOINT.createHostedZone}`, {
            headers: authHeaders,
            data: {
                domain: domainName,
            },
        });
        if (!createHostedZoneResponse.ok()) {
            throw new Error(`POST hosted zones request failed with status: ${createHostedZoneResponse.status}`);
        }
        const createHostedZoneData = await createHostedZoneResponse.json();
        const hostedZoneId = createHostedZoneData.id;
        console.log(`Created hosted zone ${domainName} with id ${hostedZoneId}`);

        return createHostedZoneData;
    } catch (error) {
        console.error(`An error occurred while creating hosted zone: ${error.message}`);
        return null;
    }
}

export async function deleteHostedZoneAPI(request, id, headers) {
    const authHeaders = getAuthHeaders(headers);

    try {
        const deleteHostedZoneResponse = await request.delete(
            `${process.env.API_URL}${API_ENDPOINT.deleteHostedZone}${id}`,
            {
                headers: authHeaders,
            }
        );
        if (!deleteHostedZoneResponse.ok()) {
            throw new Error(`DELETE hosted zones request failed with status: ${deleteHostedZoneResponse.status}`);
        }
        console.log(`Deleted hosted zone with id ${id}`);
    } catch (error) {
        console.error(`An error occurred while deleting hosted zone: ${error.message}`);
    }
}
