export const MarketItemStatus = {
  PENDING: '0',
  OPENING: '1',
  SOLD: '2',
  CLOSED: '3',
};

export const MarketItemStatusToText = {
  [MarketItemStatus.PENDING]: 'List',
  [MarketItemStatus.OPENING]: 'List',
  [MarketItemStatus.SOLD]: 'Sale',
  [MarketItemStatus.CLOSED]: 'Close',
};
