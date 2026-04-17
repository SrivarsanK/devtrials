import PhonePe from '../src/lib/phonepe';
import { config } from '../src/config';

async function testInitiate() {
  console.log('Testing PhonePe Initiate Payment (TS)...');
  console.log('Client ID:', config.apis.phonePe.clientId);
  console.log('Base URL:', config.apis.phonePe.baseUrl);

  try {
    const result = await PhonePe.initiatePayment({
      amount: 1,
      merchantOrderId: 'TEST_' + Date.now(),
      mobileNumber: '9999999999'
    });
    console.log('Success:', result);
  } catch (error: any) {
    console.error('Failed:');
    if (error.data) {
       console.error(JSON.stringify(error.data, null, 2));
    } else {
       console.error(error.message || error);
    }
  }
}

testInitiate();
