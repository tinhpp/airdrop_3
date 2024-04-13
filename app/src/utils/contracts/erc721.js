import { ERC721_ABI } from '@src/abi';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

export const ERC721Contract = (
  contractAddress,
  providerOrSigner = provider,
  ABI = ERC721_ABI
) => {
  return new ethers.Contract(contractAddress, ABI, providerOrSigner);
};

export const checkApproved = async (tokenId, operator, contractAddress) => {
  const contract = ERC721Contract(contractAddress);
  const isApproved = await contract.getApproved(tokenId);
  return isApproved.toLowerCase() == operator.toLowerCase();
};

export const approveERC721 = async (tokenId, operator, contractAddress) => {
  const signer = provider.getSigner();
  const contract = ERC721Contract(contractAddress, signer);
  return contract.approve(operator, tokenId);
};

export const mintERC721 = async (contractAddress, address, amount) => {
  console.log(contractAddress, address, amount)
  const signer = provider.getSigner();
  const contract = ERC721Contract(contractAddress, signer);
  return contract.mint(address, amount);
};

export const isERC721Contract = async (contractAddress) => {
  try {
    const contract = ERC721Contract(contractAddress);
    await contract.name();
    return true;
  } catch (error) {
    return false;
  }
};
