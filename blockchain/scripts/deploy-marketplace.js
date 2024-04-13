const { ethers } = require("hardhat");

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();

    //* Loading contract factory */
    const Marketplace = await ethers.getContractFactory("Marketplace");

    // //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");
    const treasury = "0xcCbaead41F6adfA1F0C773dB8A4ae7D088d55c80";
    const marketPercent = 250;
    const marketplace = await Marketplace.deploy(treasury, marketPercent);
    console.log("Marketplace                        deployed to:>>", marketplace.address.toLowerCase());
    await marketplace.deployed();

    console.log("==========================================================================");
    console.log("VERIFY");
    console.log("==========================================================================");

    await run("verify:verify", {
        address: marketplace.address,
        constructorArguments: [treasury, marketPercent],
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
