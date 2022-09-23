// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PucCoin is Context, ERC20, Ownable {
    constructor() ERC20("Popular User Coin", "PUC") {
        _mint(_msgSender(), 1000 * (10**uint256(decimals())));
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
