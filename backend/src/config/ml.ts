export const ML_CONFIG = {
  GATEWAY_URL: process.env.ML_GATEWAY_URL || 'http://localhost:9000',
  ENDPOINTS: {
    PRICING: '/api/pricing',
    FRAUD: '/api/fraud',
    RESERVE: '/api/reserve'
  }
};
