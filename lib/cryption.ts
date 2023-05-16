import Cryptr from 'cryptr';

export const cryption = new Cryptr(process.env.WEBHOOK_ENCRYPTION_KEY || '');
