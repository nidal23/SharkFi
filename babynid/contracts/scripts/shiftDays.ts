import hre from "hardhat"

async function main() {
    const block = await hre.ethers.provider.getBlock("latest");
    const currentTime = block.timestamp;
    const shiftTime = currentTime + (2 * 24 * 60 * 60);
    
    await hre.ethers.provider.send("evm_setNextBlockTimestamp", [shiftTime]);
}

main()