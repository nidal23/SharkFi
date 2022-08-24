import hre from "hardhat";

async function main() {
  const contract = await hre.ethers.getContractAt(
    "LendersFactory",
    "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
  );

  const issueLoanFilter = contract.filters.IssueLoan();
  const logs = await contract.queryFilter(issueLoanFilter);

  console.log(logs);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
