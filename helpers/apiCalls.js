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
    const url = `${process.env.API_URL}${API_ENDPOINT.getHostedZones}`;

    try {
        const response = await request.get(url, { headers: authHeaders });
        if (!response.ok()) {
            throw new Error(`GET hosted zones request failed with status: ${response.status()}`);
        }
        const hostedZonesData = await response.json();
        const hostedZoneCount = hostedZonesData.meta.total;
        console.log(`Total number of hosted zones: ${hostedZoneCount}`);

        return hostedZonesData;
    } catch (error) {
        console.error(`An error occurred while getting hosted zones: ${error.message}`);
        return null;
    }
}

export async function createHostedZoneAPI(request, headers) {
    const authHeaders = getAuthHeaders(headers);
    const domainName = await getRandomDomainName();
    const url = `${process.env.API_URL}${API_ENDPOINT.createHostedZone}`;

    try {
        const response = await request.post(url, {
            headers: authHeaders,
            data: { domain: domainName },
        });
        if (!response.ok()) {
            throw new Error(`POST hosted zones request failed with status: ${response.status()}`);
        }
        const createHostedZoneData = await response.json();
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
    const url = `${process.env.API_URL}${API_ENDPOINT.deleteHostedZone}${id}`;

    try {
        const response = await request.delete(url, { headers: authHeaders });
        if (!response.ok()) {
            throw new Error(`DELETE hosted zone ${id} request failed with status: ${response.status()}`);
        }
    } catch (error) {
        console.error(`An error occurred while deleting hosted zone: ${error.message}`);
    }
}

export async function getDnsRecords(request, hostedZoneId, headers) {
    const authHeaders = getAuthHeaders(headers);
    const url = `${process.env.API_URL}/users/hosted-zones/${hostedZoneId}${API_ENDPOINT.resourceRecords}`;
    try {
        const response = await request.get(url, { headers: authHeaders });
        if (!response.ok()) {
            throw new Error(`GET dns records request failed with status: ${response.status()}`);
        }
        const dnsRecordData = await response.json();
        const resourceRecords = dnsRecordData.resourceRecords;
        return resourceRecords;
    } catch (error) {
        console.error(`An error occurred while getting dns records: ${error.message}`);
        return null;
    }
}

export async function deleteAllHostedZonesAPI(request, headers) {
    try {
        const getZonesData = await getHostedZonesAPI(request, headers);
        const zoneIds = getZonesData.results.map((zone) => zone.id);

        for (const id of zoneIds) {
            await deleteHostedZoneAPI(request, id, headers);
        }
        const remainingZonesData = await getHostedZonesAPI(request, headers);
        remainingZonesData.results.length === 0
            ? console.log('All zones deleted')
            : console.error('Not all zones deleted');
    } catch (error) {
        console.error(`An error occurred while deleting all hosted zones: ${error.message}`);
    }
}
