import hre from "hardhat";

async function main() {
  const accounts = await hre.ethers.getSigners();

  // Mock ERC20
  const daiFactory = await hre.ethers.getContractFactory("Dai");
  const dai = await daiFactory.deploy("10000000000000000000000000000000000000");
  await dai.deployTransaction.wait();

  console.log(`Dai deployed at ${dai.address}`);

  const unERC20Factory = await hre.ethers.getContractFactory("UNERC20");
  const unERC20 = await unERC20Factory.deploy();
  await unERC20.deployTransaction.wait();

  console.log(`UNERC20 deployed at ${unERC20.address}`);

  const unERC20Initialize = await unERC20.initialize(
    dai.address,
    "Dai",
    "DAI",
    accounts[0].address
  );
  await unERC20Initialize.wait();

  const unERC20ProxyFactory = await hre.ethers.getContractFactory(
    "UnERC20Proxy"
  );
  const unERC20Proxy = await unERC20ProxyFactory.deploy(unERC20.address, "0x");
  await unERC20Proxy.deployTransaction.wait();

  console.log(`UnERC20Proxy deployed at ${unERC20Proxy.address}`);

  const dataProviderFactory = await hre.ethers.getContractFactory(
    "DataProvider"
  );
  const dataProvider = await dataProviderFactory.deploy();
  await dataProvider.deployTransaction.wait();

  console.log(`DataProvider deployed at ${dataProvider.address}`);

  const interestRateFactory = await hre.ethers.getContractFactory(
    "InterestRateStatergy"
  );
  const interestRate = await interestRateFactory.deploy();
  await interestRate.deployTransaction.wait();

  console.log(`InterestRateStatergy deployed at ${interestRate.address}`);

  const interestRateInitialize = await interestRate.initialize(
    dataProvider.address,
    5
  );
  await interestRateInitialize.wait();

  const lendersFactoryFactory = await hre.ethers.getContractFactory(
    "LendersFactory"
  );
  const lendersFactory = await lendersFactoryFactory.deploy(
    unERC20Proxy.address,
    unERC20.address,
    dataProvider.address,
    interestRate.address
  );
  await lendersFactory.deployTransaction.wait();

  console.log(`LendersFactory deployed at ${lendersFactory.address}`);

  const dataProviderInitialize = await dataProvider.initialize(
    10,
    5,
    lendersFactory.address
  );
  await dataProviderInitialize.wait();

  // const createLiquidityContractTxn =
  //   await lendersFactory.createLiquidityContract(dai.address, "Dai", "DAI");
  // await createLiquidityContractTxn.wait();

  // const approveTxn = await dai.approve(lendersFactory.address, 2n ** 256n - 1n);
  // await approveTxn.wait();

  // const addLiquidityTxn = await lendersFactory.addLiquidity(
  //   "1000000000000",
  //   dai.address
  // );
  // await addLiquidityTxn.wait();

  // const paymentAmount = await interestRate.calculatePaymentAmount(
  //   dai.address,
  //   "100000",
  //   5
  // );
  // const payInterestTxn = await lendersFactory.payInterest(
  //   dai.address,
  //   "100000",
  //   5,
  //   {
  //     value: paymentAmount[0].add(paymentAmount[1]),
  //   }
  // );
  // await payInterestTxn.wait();

  // const issueLoanTxn = await lendersFactory.issueLoan(dai.address, 5, "100000");
  // const issueLoanReceipt = await issueLoanTxn.wait();
  // console.log(issueLoanReceipt.events);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
