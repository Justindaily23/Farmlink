import axios from 'axios';
import { getEnvironmentVariable } from '../config/dotenvConfig.js';

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${getEnvironmentVariable('PAYSTACK_SECRET_KEY')}`,
    'Content-Type': 'application/json',
  },
});

export default paystack;
