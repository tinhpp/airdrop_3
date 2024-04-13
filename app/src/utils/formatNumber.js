import { ethers } from 'ethers';

export const formatNumber = (value, digits = 2) => {
  return Math.floor(value * 10 ** digits) / 10 ** digits;
};

export const formatERC20 = (value, decimals = 18) => {
  return Number(ethers.utils.formatUnits(value, decimals)).toFixed(2);
};
