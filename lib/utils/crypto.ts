export const getRandomKey = () => {
  // base64-encoded encryption key
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64');
};

export const encrypt = async (data: string, key: string) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encodedData = new TextEncoder().encode(data);

  const secretKey = await crypto.subtle.importKey(
    'raw',
    Buffer.from(key, 'base64'),
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, secretKey, encodedData);

  return { cipher: Buffer.from(cipher).toString('base64'), iv: Buffer.from(iv).toString('base64') };
};

export const decrypt = async (cipher: string, iv: string, key: string) => {
  const secretKey = await crypto.subtle.importKey(
    'raw',
    Buffer.from(key, 'base64'),
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  const data = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: Buffer.from(iv, 'base64'),
    },
    secretKey,
    Buffer.from(cipher, 'base64')
  );

  return new TextDecoder().decode(data);
};
