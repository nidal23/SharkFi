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

  await hre.run("verify:verify", {
    address: dai.address,
    constructorArguments: ["10000000000000000000000000000000000000"],
  });

  await hre.run("verify:verify", {
    address: unERC20.address,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: unERC20Proxy.address,
    constructorArguments: [unERC20.address, "0x"],
  });

  await hre.run("verify:verify", {
    address: dataProvider.address,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: interestRate.address,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: lendersFactory.address,
    constructorArguments: [
      unERC20Proxy.address,
      unERC20.address,
      dataProvider.address,
      interestRate.address,
    ],
  });
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
