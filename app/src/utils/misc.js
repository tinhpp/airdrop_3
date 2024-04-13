import axios from 'axios';
import moment from 'moment';

export const sliceAddress = (address) => {
  return `${address.slice(0, 5)} ... ${address.slice(-4)}`;
};

export const sliceHeadTail = (input, amount) => {
  return `${input.slice(0, amount)} ... ${input.slice(-amount + 1)}`;
};

export const calculateRealPrice = (price, rate, denominator) => {
  return (price + (price * rate) / denominator).toFixed(7);
};

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomInt = () => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

export function mergeRefs(refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
        // eslint-disable-next-line eqeqeq
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}

export const replaceIPFS = (
  link,
  search = ['ipfs://ipfs/', 'ipfs://', 'https://ipfs.moralis.io:2053/ipfs/'],
  gateway = ''
) => {
  if (link) {
    for (const s of search) {
      if (link.includes(s)) {
        return link.replace(s, gateway);
      }
    }
    return link;
  }
  return '';
};

export const compareString = (str1 = '', str2 = '') =>
  typeof str1 === 'string' && typeof str2 === 'string' && str1.toLowerCase() === str2.toLowerCase();

export const getTimestamp = () => {
  return Math.floor(new Date().getTime() / 1000);
};

export const getBNBPrice = async () => {
  const URL = 'https://www.binance.com/api/v3/ticker/price?symbol=BNBUSDC';
  const { data } = await axios.get(URL);
  return data.price;
};

export const isMarketItemInSale = (marketItem) => {
  if (marketItem.timeSaleStart) {
    const currentTime = new Date().getTime() / 1000;
    return Number(marketItem.timeSaleStart) <= currentTime && currentTime <= marketItem.timeSaleEnd;
  }
  return false;
};

export const isAuctionItemInSale = (marketItem) => {
  if (marketItem.timeStart) {
    const currentTime = new Date().getTime() / 1000;
    return Number(marketItem.timeStart) <= currentTime && currentTime <= marketItem.timeEnd;
  }
  return false;
};

export const calculateDiffTime = (from, to) => {
  const date1 = moment(from);
  const date2 = moment(to);
  const days = date1.diff(date2, 'days');
  date2.add(days, 'days');

  const hours = date1.diff(date2, 'hours');
  date2.add(hours, 'hours');

  const minutes = date1.diff(date2, 'minutes');
  date2.add(minutes, 'minutes');

  const seconds = date1.diff(date2, 'seconds');

  return {
    days: days < 10 ? '0' + days : days,
    hours: hours < 10 ? '0' + hours : hours,
    minutes: minutes < 10 ? '0' + minutes : minutes,
    seconds: seconds < 10 ? '0' + seconds : seconds,
  };
};

export const upperCaseFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
