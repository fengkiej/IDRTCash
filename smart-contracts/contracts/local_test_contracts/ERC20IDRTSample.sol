/* For development/local testing only */
pragma solidity 0.5.8;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract ERC20IDRTSample is Context, ERC20, ERC20Detailed {
    constructor() public ERC20Detailed("ERC20IDRTCashSample", "IDRTCS", 2) {
        _mint(_msgSender(), 100000000000 * (10 ** uint256(decimals())));
    }
}