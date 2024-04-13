import { getParsedEthersError } from '@enzoferey/ethers-error-parser';

export const convertArrayToObject = (array, key = 'id') => {
  return array.reduce((pre, cur) => {
    return { ...pre, [cur[key]]: cur };
  }, {});
};

export const parseMetamaskError = (error) => {
  if (error?.response?.status) {
    const context = error?.response?.data?.message || error?.response?.statusText;
    return { context };
  } else {
    const txError = getParsedEthersError(error);
    if (!txError.context) {
      txError.context = 'An error has occurred!';
    } else if (txError.errorCode === 'REJECTED_TRANSACTION' || txError.context === 'ACTION_REJECTED') {
      txError.context = 'User rejected to sign transaction!';
    }
    return txError;
  }
};

export const convertSecondsToRFC3339Time = (seconds) => {
  const date = new Date(seconds * 1000);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
};
