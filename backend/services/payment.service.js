const axios = require('axios');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const { MESOMB_CONFIG } = require('../config/payment');
const { TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../utils/constants');

const MESOMB_HOST = 'https://mesomb.hachther.com';
const MESOMB_API = '/api/v1.1';
const MESOMB_ALGORITHM = 'HMAC-SHA1';

function generateNonce(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) result += chars[bytes[i] % chars.length];
  return result;
}

function buildSignature({ method, url, date, nonce, service, body, secretKey, accessKey }) {
  const parsed = new URL(url);
  const ts = date.getTime();
  const headers = { host: `${parsed.protocol}//${parsed.host}`, 'x-mesomb-date': String(ts), 'x-mesomb-nonce': nonce };
  const keys = Object.keys(headers).sort();
  const canonicalHeaders = keys.map((k) => `${k}:${headers[k]}`).join('\n');
  const signedHeaders = keys.join(';');
  const scope = `${date.getFullYear()}${date.getMonth()}${date.getDate()}/${service}/mesomb_request`;
  const bodyHash = crypto.createHash('sha1').update(body ? JSON.stringify(body) : '{}').digest('hex');
  const canonicalReq = `${method}\n${encodeURI(parsed.pathname)}\n${parsed.search ? parsed.search.substring(1) : ''}\n${canonicalHeaders}\n${signedHeaders}\n${bodyHash}`;
  const canonicalHash = crypto.createHash('sha1').update(canonicalReq).digest('hex');
  const stringToSign = `${MESOMB_ALGORITHM}\n${ts}\n${scope}\n${canonicalHash}`;
  const signature = crypto.createHmac('sha1', secretKey).update(stringToSign).digest('hex');
  return `${MESOMB_ALGORITHM} Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

const initiateMeSombPayment = async ({ amount, phoneNumber, service, customerEmail, customerName, transactionId }) => {
  try {
    const nonce = generateNonce(16);
    const date = new Date();
    const url = `${MESOMB_HOST}${MESOMB_API}/payment/collect/`;

    const body = {
      amount,
      payer: phoneNumber,
      service,
      country: 'CM',
      currency: 'XAF',
      fees: true,
      mode: 'synchronous',
      customer: {
        email: customerEmail,
        first_name: customerName.split(' ')[0] || customerName,
        last_name: customerName.split(' ').slice(1).join(' ') || '',
        country: 'CM',
      },
      products: [{ name: 'Course Enrollment', category: 'Education', quantity: 1, amount }],
      trxID: transactionId,
    };

    const signature = buildSignature({
      method: 'POST', url, date, nonce, service, body,
      secretKey: MESOMB_CONFIG.secretKey,
      accessKey: MESOMB_CONFIG.accessKey,
    });

    const response = await axios.post(url, body, {
      headers: {
        'X-MeSomb-Application': MESOMB_CONFIG.applicationKey,
        'X-MeSomb-Access': MESOMB_CONFIG.accessKey,
        'X-MeSomb-Date': String(date.getTime()),
        'X-MeSomb-Nonce': nonce,
        'X-MeSomb-Signature': signature,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    return {
      success: response.data.success,
      status: response.data.status,
      reference: response.data.transaction?.reference || response.data.reference || '',
      transaction: response.data.transaction,
    };
  } catch (error) {
    console.error('MeSomb payment error:', error.response?.data || error.message);
    throw new Error('Payment initiation failed');
  }
};

const calculateRevenueSplit = (amount, commissionPercent) => {
  const platformShare = Math.round((amount * commissionPercent) / 100);
  const teacherShare = amount - platformShare;
  return { platformShare, teacherShare };
};

const createPayoutTransaction = async ({ teacherId, amount, courseId, description }) => {
  const transaction = await Transaction.create({
    type: TRANSACTION_TYPES.TEACHER_PAYOUT,
    amount,
    toUser: teacherId,
    course: courseId,
    status: TRANSACTION_STATUS.PENDING,
    metadata: { description },
  });
  return transaction;
};

module.exports = {
  initiateMeSombPayment,
  calculateRevenueSplit,
  createPayoutTransaction,
};
