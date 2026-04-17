import { PhonePeCheckoutClient, PhonePeEnvironment, StandardCheckoutPayRequest } from '@phonepe-pg/pg-sdk-node';
import { v4 as uuidv4 } from 'uuid';

const merchantId = 'M23W0Q52TIBAP';
const saltKey = 'ZDA2NTIzNWItYjEzNy00MGE1LWFlYmYtYTU4YjU3YjkyNTBj'; // User gave secret, but is it the saltKey?
const saltIndex = 1;

// Wait! Salt Key is usually a UUID provided in dashboard. 
// User gave Client Secret: ZDA2NTIzNWItYjEzNy00MGE1LWFlYmYtYTU4YjU3YjkyNTBj
// This looks LIKE a UUID (Salt Key format).

const client = new PhonePeCheckoutClient(merchantId, saltKey, saltIndex, PhonePeEnvironment.UAT);

async function testSDK() {
  try {
    console.log('Testing SDK Pay for Autopay...');
    const merchantOrderId = 'ORDER_' + Date.now();
    
    // We try to craft a pay request that the SDK accepts but with Autopay fields
    const request = StandardCheckoutPayRequest.Builder()
      .setMerchantOrderId(merchantOrderId)
      .setAmount(100)
      .setCallbackUrl('https://example.com/callback')
      .setRedirectUrl('https://example.com/redirect')
      .setMobileNumber('9999999999')
      .build();

    // Now, can we add extra fields? The SDK might not allow it via builder.
    // Let's try to override the payload.
    (request as any).paymentFlow = {
      type: 'SUBSCRIPTION_CHECKOUT_SETUP',
      subscriptionDetails: {
          merchantSubscriptionId: 'SUB_' + Date.now(),
          subscriptionType: 'RECURRING',
          productType: 'UPI_MANDATE',
          authWorkflowType: 'TRANSACTION',
          amountType: 'FIXED',
          maxAmount: 100,
          frequency: 'MONTHLY',
          expireAt: Date.now() + (365 * 24 * 60 * 60 * 1000),
      }
    };

    const response = await client.pay(request);
    console.log('SDK Response:', JSON.stringify(response, null, 2));
  } catch (error: any) {
    console.error('SDK Failed:', error.message);
  }
}

testSDK();
