
const clientId = 'M23W0Q52TIBAP_2604170956';
const clientSecret = 'ZDA2NTIzNWItYjEzNy00MGE1LWFlYmYtYTU4YjU3YjkyNTBj';

async function testOAuth() {
  const authUrl = 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token';
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('client_version', '1');
  params.append('grant_type', 'client_credentials');

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();
    console.log('OAuth Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('OAuth Error:', err);
  }
}

testOAuth();
