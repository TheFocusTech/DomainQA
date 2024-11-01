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
        const getHostedZonesResponse = await request.get(url, { headers: authHeaders });
        if (!getHostedZonesResponse.ok()) {
            throw new Error(`GET hosted zones request failed with status: ${getHostedZonesResponse.status()}`);
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
    const url = `${process.env.API_URL}${API_ENDPOINT.createHostedZone}`;

    try {
        const createHostedZoneResponse = await request.post(url, {
            headers: authHeaders,
            data: { domain: domainName },
        });
        if (!createHostedZoneResponse.ok()) {
            throw new Error(`POST hosted zones request failed with status: ${createHostedZoneResponse.status()}`);
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
    const url = `${process.env.API_URL}${API_ENDPOINT.deleteHostedZone}${id}`;

    try {
        const deleteHostedZoneResponse = await request.delete(url, { headers: authHeaders });
        if (!deleteHostedZoneResponse.ok()) {
            throw new Error(`DELETE hosted zones request failed with status: ${deleteHostedZoneResponse.status()}`);
        }
        console.log(`Deleted hosted zone with id ${id}`);
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
    const authHeaders = getAuthHeaders(headers);
    const urlGet = `${process.env.API_URL}${API_ENDPOINT.getHostedZones}`;

    try {
        const getResponse = await request.get(urlGet, { headers: authHeaders });

        if (!getResponse.ok()) {
            throw new Error(`Failed to get hosted zones. Status: ${getResponse.status()}`);
        }

        const getZonesData = await getResponse.json();
        const zoneIds = getZonesData.results.map((zone) => zone.id);

        console.log(`Found ${zoneIds.length} hosted zones to delete.`);

        for (const id of zoneIds) {
            const urlDelete = `${process.env.API_URL}${API_ENDPOINT.deleteHostedZone}${id}`;

            const deleteResponse = await request.delete(urlDelete, {
                headers: authHeaders,
            });
            if (deleteResponse.ok()) {
                console.log(`Successfully deleted hosted zone with ID: ${id}`);
            } else {
                console.error(`Failed to delete hosted zone with ID: ${id}. Status: ${deleteResponse.status()}`);
            }
        }
    } catch (error) {
        console.error(`An error occurred while deleting all hosted zones: ${error.message}`);
    }
}
