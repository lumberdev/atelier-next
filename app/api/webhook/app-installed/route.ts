import { cryption } from '@lib/cryption';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { payload } = (await request.json()) as { payload: string };

  const session = JSON.parse(cryption.decrypt(payload)) as {
    id: string;
    shop: string;
    state: string;
    isOnline: boolean;
    accessToken: string;
    score: string;
  };

  const { shop, accessToken } = session;

  const newMerchant = await prisma?.merchant.upsert({
    where: { shopId: shop },
    create: {
      shopId: shop,
      accessToken,
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
