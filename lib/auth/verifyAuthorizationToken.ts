import { getAuthorizationToken } from './getAuhtorizationToken';

export const verifyAuthorizationToken = ({
  token,
  merchantSecret,
  merchantPassword,
}: {
  token: string;
  merchantSecret: string;
  merchantPassword: string;
}) => {
  const hmac = getAuthorizationToken({ merchantSecret, merchantPassword });

  return hmac === token;
};
