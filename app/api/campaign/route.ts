import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export const POST = async (request: Request) => {
  const { name, password } = (await request.json()) as {
    name: string;
    password: string;
  };

  const shopId = request.headers.get('X-Atelier-Merchant') as string;
  const normalizedName = name.toLowerCase().trim().replace(' ', '-');

  console.log({ name, password, normalizedName, shopId });

  if (!shopId)
    return new NextResponse(JSON.stringify({ success: false, error: { message: 'Invalid request.' } }), {
      status: 400,
    });

  const merchant = await prisma.merchant.findUnique({
    where: { shopId },
    include: {
      campaigns: {
        include: {
          theme: true,
        },
      },
    },
  });

  if (!merchant)
    return new NextResponse(JSON.stringify({ success: false, error: { message: 'Unrecognized merchant' } }), {
      status: 412,
    });

  const campaignMatch = merchant.campaigns.find((campaign) => campaign.name === name);

  const updatedCampaign = !campaignMatch
    ? await prisma.merchant.update({
        where: { id: merchant.id },
        data: {
          campaigns: {
            create: {
              name: normalizedName,
              password,
              theme: {
                create: {
                  primaryColor: '#000000',
                },
              },
            },
          },
        },
      })
    : await prisma.campaign.update({
        where: { id: campaignMatch.id },
        data: {
          name: normalizedName,
          password,
        },
      });

  return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
};
