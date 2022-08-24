pragma solidity =0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IInterestRate {
    function calculatePaymentAmount(
        IERC20 token,
        uint256 amount,
        uint256 numberOfDays
    ) external returns (uint256, uint256);
}
