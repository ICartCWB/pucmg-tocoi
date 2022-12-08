// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Tocoi.sol";

contract TocoiMarket {
    Tocoi public token;

    string public name;
    uint public area;
    uint public precoTotal;
    address public administradora;
    uint public comprasCount=0;
    CotasCompradas[] public cotasCompradas;
    uint public taxaInversa; // Taxa da compra de cotas pela administradora: 1/x

    struct CotasCompradas {
        uint id;
        uint precoPago;
        uint qtde;
        address owner;
        bool devolvida;
    }

    event AlteraPreco (
        uint price
    );

    event CompraCota (
        uint id,
        uint price,
        address owner
    );

    event DevolveCota (
        uint id,
        uint taxaPaga
    );

    constructor(Tocoi _token) {
        name = "Tocoi Market";
        area = 10000; // 10000,00 m²
        precoTotal = 200; // 200 ETH
        administradora = 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1;
        taxaInversa = 5; // 20% de taxa
        token = _token;
        token.mintaTokens(2000); // 2000 Tocoi
    }

    
    function alteraPreco(uint _price) public {
        require(msg.sender==administradora, unicode"Função exclusiva da administradora!");
        precoTotal = _price;
        emit AlteraPreco(precoTotal);
    }

    function compraCota(uint _qtde) public payable { // _qtde deve vir multiplicado por 100

        // Checa o preço da cota
        uint _quantiaPagaPorCotaX100 = (msg.value*10000/(_qtde));
        uint _quantiaNecessariaPorCotaX100 = precoTotal*10000/token.totalSupply();
        require(_quantiaPagaPorCotaX100  >= _quantiaNecessariaPorCotaX100, unicode"Transfira a quantia correta");

        address payable _seller = payable(administradora);

        address payable buyer = payable(msg.sender);

        // Require para checar se há tokens o suficiente para realizar a transação
        uint balance = token.balanceOf(address(this));
        require(balance >= _qtde, unicode"A quantidade inserida é maior que a quantidade de tokens da administradora");
        // Require para a administradora não estar comprando
        require(buyer != _seller, unicode"Administradora não pode comprar do próprio contrato");

        // Transfere o valor à administradora
        _seller.transfer(msg.value);
        // Transfere token ao cotista
        token.transfer(buyer, _qtde);

        // Adiciona o cotasCompradas
        cotasCompradas.push(CotasCompradas(comprasCount, msg.value,_qtde, msg.sender, false));
        // Increment CotasCompradas
        comprasCount = cotasCompradas.length;

        emit CompraCota(comprasCount, msg.value, buyer);
    }

    function devolveCota(uint _id) public payable {
        CotasCompradas memory cotaComp = cotasCompradas[_id];
        // Require para checar se é realmente o dono
        require(cotaComp.id >= 0 && cotaComp.owner == msg.sender, unicode"Id ou proprietário inválido");

        address payable _seller = payable(msg.sender);

        address payable buyer = payable(administradora);

        // Require para checar se o valor passado corresponde ao que será devolvido
        require(msg.value*10000 >= (precoTotal*10000/token.totalSupply())/taxaInversa, unicode"Transfira a quantia correta para a taxa de devolução");

        // Require para checar se há tokens o suficiente para realizar a transação
        uint balance = token.balanceOf(_seller);
        require(balance >= cotaComp.qtde, unicode"A quantidade de Tocoi da conta é menor que a referida cota comprada");

        // Transfere o valor da taxa à administradora
        buyer.transfer(msg.value);
        // Devolve os token ao contrato
        token.transfer(buyer, cotaComp.qtde);

        // Atualiza o array das cotas compradas
        cotaComp.devolvida = true;
        cotasCompradas[_id] = cotaComp;

        emit DevolveCota(_id, msg.value);
    }
}