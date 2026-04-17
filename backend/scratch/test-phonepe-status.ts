import axios from 'axios';

const clientId = 'M23W0Q52TIBAP_2604170956';
const clientSecret = 'ZDA2NTIzNWItYjEzNy00MGE1LWFlYmYtYTU4YjU3YjkyNTBj';
const baseUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const orderId = 'OMO2604172104053813442939'; // The one we just got

async function testStatus() {
  try {
    const tokenResponse = await axios.post(
      `${baseUrl}/v1/oauth/token`,
      new URLSearchParams({
        client_id: clientId,
        client_version: '1',
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }).toString()
    );

    const token = tokenResponse.data.access_token;

    console.log(`Checking status for ${orderId}...`);
    const statusResponse = await axios.get(
      `${baseUrl}/subscriptions/v2/status/M23W0Q52TIBAP/${orderId}`,
      {
        headers: {
          'Authorization': `O-Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-MERCHANT-ID': 'M23W0Q52TIBAP',
        },
      }
    );

    console.log('Status Response:', JSON.stringify(statusResponse.data, null, 2));
  } catch (error: any) {
    console.error('Status Failed:', error.response?.data || error.message);
  }
}

testStatus();
