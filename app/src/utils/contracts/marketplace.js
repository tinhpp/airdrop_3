import { MARKETPLACE_ABI } from '@src/abi/marketplace';
import { MARKETPLACE_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
const signer = provider.getSigner();

export const marketPlaceContract = (signerOrProvider = provider) => {
  return new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signerOrProvider);
};

export const write = (functionName, args, value = 0) => {
  const contract = marketPlaceContract(signer);
  return contract[functionName](...args, {
    value,
  });
};
