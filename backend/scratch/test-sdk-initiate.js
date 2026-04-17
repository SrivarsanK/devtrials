const PhonePe = require('./dist/lib/phonepe').default;
const { config } = require('./dist/config');

async function testInitiate() {
  console.log('Testing PhonePe Initiate Payment...');
  console.log('Merchant ID:', config.apis.phonePe.clientId);
  console.log('Base URL:', config.apis.phonePe.baseUrl);

  try {
    const result = await PhonePe.initiatePayment({
      amount: 1,
      merchantOrderId: 'TEST_' + Date.now(),
      mobileNumber: '9999999999'
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Failed:');
    if (error.data) {
       console.error(JSON.stringify(error.data, null, 2));
    } else {
       console.error(error);
    }
  }
}

testInitiate();
