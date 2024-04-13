const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");

const ItemStatus = {
    OPENING: 0,
    SOLD: 1,
    CLOSED: 2,
};

const BASE_URI = "https://chonksociety.s3.us-east-2.amazonaws.com/metadata/";

describe("NFTMarketplace", function () {
    let NFT;
    let nft;
    let wBNB;
    let Marketplace;
    let marketplace;
    let deployer;
    let addr1;
    let addr2;
    let addrs;
    let feePercent = 10;

    beforeEach(async function () {
        // Get the ContractFactories and Signers here.
        const Chonk = await ethers.getContractFactory("ChonkSociety");
        Marketplace = await ethers.getContractFactory("Marketplace");
        WBNB = await ethers.getContractFactory("WBNB");
        [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();

        const marketPercent = 100;

        // To deploy our contracts
        nft = await Chonk.deploy(BASE_URI);
        marketplace = await Marketplace.deploy(deployer.address, marketPercent);
        wBNB = await WBNB.deploy();

        await nft.connect(addr1).mint(addr1.address, 2);
        await wBNB.connect(addr2).mint({ value: ethers.utils.parseEther("10") });
    });

    it.only("test", async () => {
        await nft.connect(addr1).approve(marketplace.address, 1);
        await marketplace.connect(addr1).listItem(nft.address, 1, ethers.utils.parseUnits("0.3", 18), wBNB.address, addr1.address);

        await wBNB.connect(addr2).approve(marketplace.address, ethers.utils.parseUnits("0.3", 18));
        await expect(marketplace.connect(addr2).purchaseItem(1)).to.changeTokenBalances(wBNB, [addr2.address], [`-${ethers.utils.parseUnits("0.3", 18)}`]);
    });

    describe("Deployment", function () {
        it("Should track name and symbol of the nft collection", async function () {
            // This test expects the owner variable stored in the contract to be equal
            // to our Signer's owner.
            const nftName = "MockERC721";
            const nftSymbol = "ERC721";
            expect(await nft.name()).to.equal(nftName);
            expect(await nft.symbol()).to.equal(nftSymbol);
        });

        it("Should track feeAccount and feePercent of the marketplace", async function () {
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
            expect(await marketplace.feePercent()).to.equal(feePercent);
        });
    });

    describe("Minting NFTs", function () {
        it("Should track each minted NFT", async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint(addr1.address);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            // addr2 mints an nft
            await nft.connect(addr2).mint(addr2.address);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
        });
    });

    describe("Purchasing marketplace items in cart", function () {
        let price = 1;
        const itemIds = [1, 2, 3, 4, 5];
        const payable = parseEther(price.toString()).mul(itemIds.length);
        const fee = marketFee(payable, feePercent);
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint(addr1.address);
            await nft.connect(addr1).mint(addr1.address);
            await nft.connect(addr1).mint(addr1.address);
            await nft.connect(addr1).mint(addr1.address);
            await nft.connect(addr1).mint(addr1.address);
            // addr1 approves marketplace to spend tokens
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
            // addr1 makes their nft a marketplace item.
            await Promise.all(
                itemIds.map(async (id) => {
                    await marketplace.connect(addr1).makeItem(nft.address, id, parseEther(price.toString()));
                })
            );
        });
        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
            const sellerInitialEthBal = await addr1.getBalance();
            const feeAccountInitialEthBal = await deployer.getBalance();

            // addr 2 purchases item.
            await marketplace.connect(addr2).purchaseItems(itemIds, { value: payable.add(1) });

            const sellerFinalEthBal = await addr1.getBalance();
            const feeAccountFinalEthBal = await deployer.getBalance();
            // Item should be marked as sold
            expect((await marketplace.items(1)).status).to.equal(ItemStatus.SOLD);
            expect((await marketplace.items(2)).status).to.equal(ItemStatus.SOLD);
            expect((await marketplace.items(3)).status).to.equal(ItemStatus.SOLD);
            expect((await marketplace.items(4)).status).to.equal(ItemStatus.SOLD);
            expect((await marketplace.items(5)).status).to.equal(ItemStatus.SOLD);

            // Seller should receive payment for the price of the NFT sold.
            expect(sellerFinalEthBal).to.equal(sellerInitialEthBal.add(payable.sub(fee)));
            // feeAccount should receive fee
            expect(feeAccountFinalEthBal).to.equal(feeAccountInitialEthBal.add(fee).add(1));
            // The buyer should now own the nft
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            expect(await nft.ownerOf(2)).to.equal(addr2.address);
            expect(await nft.ownerOf(3)).to.equal(addr2.address);
            expect(await nft.ownerOf(4)).to.equal(addr2.address);
            expect(await nft.ownerOf(5)).to.equal(addr2.address);
        });

        it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
            // fails for invalid item ids
            await expect(marketplace.connect(addr2).purchaseItems([6], { value: parseEther(price.toString()) })).to.be.revertedWith("item doesn't exist");
            await expect(marketplace.connect(addr2).purchaseItems([0], { value: parseEther(price.toString()) })).to.be.revertedWith("item doesn't exist");
            // Fails when not enough ether is paid with the transaction.
            await expect(marketplace.connect(addr2).purchaseItems(itemIds, { value: payable.sub(1) })).to.be.revertedWith("not enough ether to paid");
            // addr2 purchases item 1
            await marketplace.connect(addr2).purchaseItems(itemIds, { value: payable });
            // addr3 tries purchasing item 1 after its been sold
            const addr3 = addrs[0];
            await expect(marketplace.connect(addr3).purchaseItems(itemIds, { value: payable })).to.be.revertedWith("item already sold");
        });
    });
});

function marketFee(itemPrice, marketPercent) {
    return itemPrice.mul(marketPercent).div(100);
}
