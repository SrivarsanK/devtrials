import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const config = {
  clientId: process.env.PHONEPE_CLIENT_ID,
  clientSecret: process.env.PHONEPE_CLIENT_SECRET,
  baseUrl: process.env.PHONEPE_BASE_URL,
  clientVersion: process.env.PHONEPE_CLIENT_VERSION || '1'
};

async function testRefund() {
  const originalId = "SUB_1776404248901"; // from our previous DB check
  const refundId = "TEST_R" + Date.now();
  const endpoint = "/pg/v1/refund";
  
  const payload = {
    merchantId: config.clientId,
    merchantTransactionId: refundId,
    originalMerchantTransactionId: originalId,
    amount: 100, // 1 INR in paise
    callbackUrl: "http://localhost:5678/callback"
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const stringToHash = base64Payload + endpoint + config.clientSecret;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const xVerify = sha256 + "###" + config.clientVersion;

  console.log("Testing Refund with Payload:", payload);
  console.log("X-VERIFY:", xVerify);

  try {
    const response = await axios.post(
      `${config.baseUrl}${endpoint}`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": config.clientId
        }
      }
    );
    console.log("RESPONSE SUCCESS:", JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error("RESPONSE ERROR:", error.response?.data || error.message);
  }
}

testRefund();
