import axios from 'axios';

import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const MORALIS_API_URL = 'https://deep-index.moralis.io/api/v2.2';

export const getNftMetadata = async (
  chain: string,
  collectionAddress: string,
  tokenId: number,
): Promise<Record<string, any>> => {
  const url = `${MORALIS_API_URL}/nft/${collectionAddress}/${tokenId}`;
  const { data } = await axios.get(url, {
    params: {
      chain,
    },
    headers: {
      accept: 'application/json',
      'X-API-Key': configService.get<string>('MORALIS_API_KEY'),
    },
  });
  if (data.token_uri && !data.metadata) {
    const res = await axios.get(data.token_uri);
    data.metadata = res.data;
  }

  return data;
};
