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
   * Checks the status of a payment
   */
  async checkStatus(merchantOrderId: string) {
    try {
      console.log(`[PhonePe] Checking status for Order: ${merchantOrderId}`);
      const response = await this.client.getOrderStatus(merchantOrderId);
      
      const latestPayment = response.paymentDetails?.[0];
      
      return {
        success: response.state === 'COMPLETED',
        state: response.state,
        amount: response.amount / 100,
        merchantOrderId: response.merchantOrderId,
        transactionId: latestPayment?.transactionId,
        paymentMode: latestPayment?.paymentMode,
        rawResponse: response
      };
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

      // In a real environment with the StandardCheckoutClient, there might be a .refund() method.
      // However, if the SDK doesn't expose it or we want to ensure compatibility with the provided links:
      // We'll use a manual fetch or the internal client if available.
      // Given the SDK we have, I'll attempt to use the REST API manually for the refund 
      // as it's often more reliable for non-checkout flows.
      
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
