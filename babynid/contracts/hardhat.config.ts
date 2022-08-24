import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan";
import "dotenv/config"

export default {
    solidity: {
        version: "0.8.4"
    },
    networks : {
        mumbai: {
            url: process.env.ALCHEMY_PROVIDER,
            accounts: [process.env.PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: {
            polygon: process.env.ETHERSCAN_KEY,
            polygonMumbai: process.env.ETHERSCAN_KEY
        }
    }
}