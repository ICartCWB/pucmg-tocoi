// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tocoi is Context, ERC20, Ownable {
    bool public primeiroMint;

    constructor() ERC20("Token de Cotas Imobiliarias", "TOCOI") {
        primeiroMint = false;
    }

    function mintaTokens(uint qtdeMint) public {
        require(primeiroMint==false,unicode"Mint já exeutado");
        _mint(_msgSender(), qtdeMint * (10**uint256(decimals())));
        primeiroMint = true;
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}
