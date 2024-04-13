// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

enum ItemStatus {
    PENDING,
    OPENING,
    SOLD,
    CLOSED
}

struct MarketItem {
    uint256 itemId;
    address nft;
    uint256 tokenId;
    uint256 price;
    uint256 timeSaleStart;
    uint256 timeSaleEnd;
    uint256 salePrice;
    address seller;
    address feeReceiver;
    address buyer;
    uint256 timePurchased;
    ItemStatus status;
}

struct MarketItemParams {
    address nft;
    uint256 tokenId;
    uint256 price;
    uint256 timeSaleStart;
    uint256 timeSaleEnd;
    uint256 salePrice;
    address feeReceiver;
}

struct AuctionItem {
    uint256 itemId;
    address nft;
    uint256 tokenId;
    uint256 initPrice;
    uint256 timeStart;
    uint256 timeEnd;
    address seller;
    address feeReceiver;
    ItemStatus status;
}

struct AuctionItemParams {
    address nft;
    uint256 tokenId;
    uint256 initPrice;
    uint256 timeStart;
    uint256 timeEnd;
    address feeReceiver;
}

struct Bidder {
    uint256 auctionItem;
    address bidder;
    uint256 amount;
}

interface IMarketplace {
    function listItem(MarketItemParams memory maketItemParams) external;

    function purchaseItems(uint256[] memory _itemIds) external payable;

    function closeItem(uint256 _itemId) external;

    function updateItem(uint256 _itemId, uint256 _price, uint256 _timeStart, uint256 _timeEnd, uint256 _salePrice) external;

    function listAuctionItem(AuctionItemParams memory _auctionItemParams) external;

    function bidItem(uint256 _itemId) external payable;

    function distributeAuctionItem(uint256 _itemId) external;

    function closeAuctionItem(uint256 _itemId) external;

    function setTreasury(address _treasury) external;

    function setRoyaltyPercent(uint256 _royaltyPercent) external;
}
