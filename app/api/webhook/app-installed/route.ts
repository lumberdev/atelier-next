import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { decrypt, encrypt, getRandomKey } from '@lib/utils/crypto';

export const POST = async (request: Request) => {
  const {
    session: { cipher, iv },
  } = (await request.json()) as { session: { cipher: string; iv: string } };

  const sessionPayload = await decrypt(cipher, iv, process.env.WEBHOOK_ENCRYPTION_KEY ?? '');
  const session = JSON.parse(sessionPayload) as {
    id: string;
    shop: string;
    state: string;
    isOnline: boolean;
    accessToken: string;
    score: string;
  };

  const { shop, accessToken } = session;

  const secret = getRandomKey();
  const token = await encrypt(accessToken, process.env.ATELIER_SECRET ?? '');

  const newMerchant = await prisma?.merchant.upsert({
    where: { shopId: shop },
    create: {
      shopId: shop,
      accessToken: `${token.cipher},${token.iv}`,
      secret,
      isActive: true,
    },
    update: {
      accessToken,
      isActive: true,
    },
    include: {
      campaigns: {
        include: {
          theme: true,
        },
      },
    },
  });

  return new NextResponse(JSON.stringify({ success: true }), { status: 201 });
};
