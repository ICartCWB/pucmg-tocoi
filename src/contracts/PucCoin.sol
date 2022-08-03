pragma solidity ^0.5.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PucCoin is Context, ERC20, Ownable {
    constructor() public ERC20("Popular User Coin", "PUC") {
        _mint(_msgSender(), 10000 * (10**uint256(decimals())));
    }
}
