const { run } = require("hardhat");
const contracts = require("../deployed/bsc_testnet.json");

async function main() {
    // const accounts = await ethers.getSigners();

    // const BASE_URI = "https://chonksociety.s3.us-east-2.amazonaws.com/metadata/";

    // const Chonk = await ethers.getContractFactory("ChonkSociety");
    // const chonk = await Chonk.deploy(BASE_URI);
    // console.log("chonk                        deployed to:>>", chonk.address);
    // await chonk.deployed();

    const jobs = [
        run("verify:verify", {
            address: "0x41ecdc55d620434056c8d94b84b6e4d655893517",
            constructorArguments: ["0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54", 250],
        }),
        // run("verify:verify", {
        //     address: "0x95fcdc7076ca3711241352085f8794e79aa9f2ad",
        //     constructorArguments: [
        //         "0xc8429C05315Ae47FFc0789A201E5F53E93D591D4",
        //         "0x18d1b265ad688b09a593ce795b2e51cef8f41906",
        //         "0xf05cdcfd4a032991bd93a7e9c15c03c063ec87f7",
        //         "0x43e73cd24fa3bedd8b62d50890cefb921c57887c",
        //         ["0xefa11f1dc4ef87aca3027cb458b64bf8c0344e1c"],
        //     ],
        // }),
    ];

    await Promise.all(jobs.map((job) => job.catch(console.log)));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
