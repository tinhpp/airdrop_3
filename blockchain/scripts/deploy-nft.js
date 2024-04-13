const { ethers } = require("hardhat");

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();

    //* Loading contract factory */
    const ChonkSociety = await ethers.getContractFactory("ChonkSociety");

    // //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");
    const chonk = await ChonkSociety.deploy("https://ipfs.io/ipfs/QmWXJXRdExse2YHRY21Wvh4pjRxNRQcWVhcKw4DLVnqGqs/");
    console.log("chonk                        deployed to:>>", chonk.address.toLowerCase());
    await chonk.deployed();

    await chonk.connect(accounts[0]).mint(accounts[0].address, 13);

    console.log("==========================================================================");
    console.log("VERIFY");
    console.log("==========================================================================");

    await run("verify:verify", {
        address: chonk.address,
        constructorArguments: ["https://ipfs.io/ipfs/QmWXJXRdExse2YHRY21Wvh4pjRxNRQcWVhcKw4DLVnqGqs/"],
    });

    console.log("==========================================================================");
    console.log("VERIFY SUCCESS");
    console.log("==========================================================================");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
