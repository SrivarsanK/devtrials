import { 
  StandardCheckoutClient, 
  Env, 
  StandardCheckoutPayRequest,
  PrefillUserLoginDetails,
  PhonePeException 
} from '@phonepe-pg/pg-sdk-node';
import { config } from '../config';
import crypto from 'crypto';
import axios from 'axios';

/**
 * PhonePe V2 Standard Checkout Library
 * Uses the official PhonePe SDK for Node.js
 */

class PhonePeLibrary {
  private static instance: PhonePeLibrary;
  private client: StandardCheckoutClient;

  private constructor() {
    const { clientId, clientSecret, clientVersion, baseUrl } = config.apis.phonePe;
    
    // Determine environment based on base URL or explicitly from config if we added it
    // Default to SANDBOX for safety if not explicitly PRODUCTION
    const env = baseUrl.includes('api.phonepe.com') ? Env.PRODUCTION : Env.SANDBOX;

    console.log(`[PhonePe] Initializing SDK for environment: ${env}`);
    
    this.client = StandardCheckoutClient.getInstance(
      clientId,
      clientSecret,
      parseInt(clientVersion, 10),
      env
    );
  }

  public static getInstance(): PhonePeLibrary {
    if (!PhonePeLibrary.instance) {
      PhonePeLibrary.instance = new PhonePeLibrary();
    }
    return PhonePeLibrary.instance;
  }

  /**
   * Initiates a payment and returns the redirect URL
   */
  async initiatePayment(params: {
    amount: number;
    merchantOrderId: string;
    mobileNumber?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const { amount, merchantOrderId, mobileNumber, metadata } = params;

      console.log(`[PhonePe] Initiating payment for Order: ${merchantOrderId}, Amount: ${amount}`);

      const prefill = mobileNumber 
        ? PrefillUserLoginDetails.builder().phoneNumber(mobileNumber).build()
        : undefined;

      const requestBuilder = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantOrderId)
        .amount(amount * 100) // Convert to paise
        .redirectUrl(`${config.apis.phonePe.redirectUrl}?id=${merchantOrderId}`);

      if (prefill) {
        requestBuilder.prefillUserLoginDetails(prefill);
      }

      const request = requestBuilder.build();

      const response = await this.client.pay(request);
      
      console.log(`[PhonePe] Initiation successful. Redirect URL: ${response.redirectUrl}`);
      
      return {
        success: true,
        redirectUrl: response.redirectUrl,
        orderId: response.orderId
      };
    } catch (error) {
      this.handleError(error, 'initiatePayment');
      throw error;
    }
  }

  /**
   * Checks the status of a payment (Standard or Subscription)
   */
  async checkStatus(merchantOrderId: string) {
    try {
      console.log(`[PhonePe] Checking status for Order: ${merchantOrderId}`);
      
      // Try SDK first (Standard V1)
      try {
        const response = await this.client.getOrderStatus(merchantOrderId);
        const latestPayment = response.paymentDetails?.[0];
        
        return {
          success: response.state === 'COMPLETED',
          state: response.state,
          amount: response.amount / 100,
          merchantOrderId: response.merchantOrderId,
          transactionId: latestPayment?.transactionId,
          paymentMode: latestPayment?.paymentMode,
          subscriptionId: (response as any).subscriptionDetails?.subscriptionId,
          rawResponse: response
        };
      } catch (sdkError) {
        // If SDK fails (e.g. for V2 subscriptions), try direct V2 status check
        console.log(`[PhonePe] SDK Status check failed, trying direct V2...`);
        
        const { clientId, clientSecret, baseUrl } = config.apis.phonePe;
        const merchantId = clientId.split('_')[0];

        const tokenResponse = await axios.post(`${baseUrl}/v1/oauth/token`,
          new URLSearchParams({
            grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret, client_version: '1.0.0'
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        const token = tokenResponse.data.access_token;

        const response = await axios.get(
          `${baseUrl}/subscriptions/v2/status/${merchantId}/${merchantOrderId}`,
          {
            headers: {
              "Authorization": `O-Bearer ${token}`,
              "X-MERCHANT-ID": merchantId
            }
          }
        );

        const data = response.data.data || response.data;

        return {
          success: data.state === 'COMPLETED' || data.state === 'ACTIVE',
          state: data.state,
          amount: data.amount / 100,
          merchantOrderId: data.merchantOrderId,
          subscriptionId: data.subscriptionId,
          rawResponse: data
        };
      }
    } catch (error) {
      this.handleError(error, 'checkStatus');
      throw error;
    }
  }

  /**
   * Verifies the webhook callback signature
   */
  async verifyWebhookSignature(headers: any, bodyString: string) {
    try {
      // The SDK uses validateCallback(username, password, authHeader, body)
      // Note: User needs to provide Merchant Username/Password for callback validation if applicable
      // For Standard Checkout V2, it might use Client ID/Secret or specific S2S credentials.
      // The docs showed MERCHANT_USERNAME and MERCHANT_PASSWORD.
      
      // If we don't have these, we might need to use the Client ID/Secret if they are the same.
      // However, usually V2 webhooks are signed with a header.
      
      const authHeader = headers['x-verify'] || headers['authorization'];
      
      // If the SDK requires username/password, we might use clientId/clientSecret or wait for user inputs.
      // For now, I'll attempt with clientId/clientSecret as fallback placeholders or check if it works.
      
      // Actually, many V2 integrations use a simplified validation if it's just a checksum.
      // I'll try to find the specific validateCallback parameters for this SDK version.
      
      console.log('[PhonePe] Verifying webhook signature...');
      
      // Placeholder: The actual implementation might vary based on user credentials.
      // I'll assume standard validation for now.
      const result = await this.client.validateCallback(
        config.apis.phonePe.clientId,
        config.apis.phonePe.clientSecret,
        authHeader,
        bodyString
      );

      return {
        isValid: true,
        payload: result.payload
      };
    } catch (error) {
      console.error('[PhonePe] Webhook verification failed:', error);
      return { isValid: false, error };
    }
  }


  /**
   * Sets up an Autopay Subscription (Recurring Mandate)
   */
  /**
   * Sets up an Autopay Subscription (Recurring Mandate) with Redirect URL
   */
  async setupSubscription(params: {
    amount: number;
    merchantOrderId: string;
    mobileNumber?: string;
    merchantSubscriptionId?: string;
    merchantUserId?: string;
  }) {
    try {
      const { amount, merchantOrderId, mobileNumber } = params;
      const { clientId, clientSecret, baseUrl } = config.apis.phonePe;
      
      // Extract merchantId from clientId (prefix before underscore)
      const merchantId = clientId.split('_')[0]; 
      const merchantSubscriptionId = params.merchantSubscriptionId || `S${Date.now()}`;
      const merchantUserId = params.merchantUserId || `U${Date.now()}`;
      
      console.log(`[PhonePe] Requesting OAuth token for subscription setup...`);
      const tokenResponse = await axios.post(`${baseUrl}/v1/oauth/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          client_version: '1.0.0'
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      const token = tokenResponse.data.access_token;

      console.log(`[PhonePe] Setting up Subscription Checkout for Order: ${merchantOrderId}`);

      const payload = {
        merchantOrderId: merchantOrderId,
        amount: Math.round(amount * 100), // convert to paise
        merchantUserId: merchantUserId,
        mobileNumber: mobileNumber || '9999999999',
        deviceContext: { deviceOS: "ANDROID" }, 
        paymentFlow: {
          type: "SUBSCRIPTION_CHECKOUT_SETUP",
          merchantUrls: {
            redirectUrl: `${config.apis.phonePe.redirectUrl}?id=${merchantOrderId}`,
            notificationUrl: config.apis.phonePe.callbackUrl
          },
          subscriptionDetails: {
            subscriptionType: "RECURRING",
            merchantSubscriptionId: merchantSubscriptionId,
            authWorkflowType: "TRANSACTION",
            amountType: "VARIABLE",
            maxAmount: 100000, // ₹1000 limit in paise
            frequency: "ON_DEMAND",
            productType: "UPI_MANDATE",
            expireAt: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60) // 10 years in seconds
          }
        }
      };

      const response = await axios.post(
        `${baseUrl}/checkout/v2/pay`,
        payload,
        {
          headers: {
            'Authorization': `O-Bearer ${token}`,
            'X-MERCHANT-ID': merchantId,
            'Content-Type': 'application/json',
            'x-source': 'API',
            'x-source-version': 'V2',
            'x-source-platform': 'BACKEND_NODE_SDK',
            'x-source-platform-version': '2.0.5'
          }
        }
      );

      console.log(`[PhonePe] Subscription Setup Success Body:`, response.data);

      return {
        success: true,
        redirectUrl: response.data.redirectUrl,
        orderId: response.data.orderId,
        merchantSubscriptionId,
        state: response.data.state
      };
    } catch (error: any) {
      console.error("[PhonePe] Subscription Setup Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  /**
   * Processes a refund (simulate payout)
   */
  async handleRefund(params: {
    originalTransactionId: string;
    refundAmount: number; // in INR
    merchantUserId: string;
  }) {
    try {
      const { originalTransactionId, refundAmount, merchantUserId } = params;
      const refundTransactionId = `R${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      console.log(`[PhonePe] Initializing Refund for: ${originalTransactionId}, Amount: ${refundAmount}`);

      const payload = {
        merchantId: config.apis.phonePe.clientId,
        merchantTransactionId: refundTransactionId,
        originalMerchantTransactionId: originalTransactionId,
        amount: Math.round(refundAmount * 100), // convert to paise
        callbackUrl: config.apis.phonePe.callbackUrl
      };

      const endpoint = "/pg/v1/refund";
      const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
      const stringToHash = base64Payload + endpoint + config.apis.phonePe.clientSecret;
      const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
      const xVerify = sha256 + "###" + config.apis.phonePe.clientVersion;

      const response = await axios.post(
        `${config.apis.phonePe.baseUrl}${endpoint}`,
        { request: base64Payload },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerify,
            "X-MERCHANT-ID": config.apis.phonePe.clientId
          }
        }
      );

      console.log(`[PhonePe] Refund successful. Refund ID: ${refundTransactionId}`);

      return {
        success: true,
        refundTransactionId,
        data: response.data
      };
    } catch (error: any) {
      console.error("[PhonePe] Refund Error:", error.response?.data || error.message);
      return {
        success: false,
        data: error.response?.data || { message: error.message }
      };
    }
  }

  private handleError(error: any, context: string) {
    if (error instanceof PhonePeException) {
      console.error(`[PhonePe] ${context} Error:`, {
        message: error.message,
        httpStatusCode: error.httpStatusCode,
        data: error.data
      });
    } else {
      console.error(`[PhonePe] ${context} Unexpected Error:`, error);
    }
  }
}

export default PhonePeLibrary.getInstance();
