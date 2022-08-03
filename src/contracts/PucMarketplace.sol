pragma solidity ^0.5.0;

contract Marketplace {
  string public name;
  PucCoin private _token;
  uint public productCount=0;
  mapping(uint => Product) public products;

struct Product {
  uint id;
  string name;
  uint price;
  address payable owner;
  bool purchased;
}

event ProductCreated (
  uint id,
  string name,
  uint price,
  address payable owner,
  bool purchased
);

event ProductPurchased (
  uint id,
  string name,
  uint price,
  address payable owner,
  bool purchased
);

  constructor(PucCoin token) public {
    name = "PUCMG Marketplace";
    _token = token;
  }

  function createProduct(string memory _name, uint _price) public {
    //Require a name
    require(bytes(_name).length > 0, "Enter a valid name");
    //Requiere a valid price
    require(_price > 0, "Enter a valid price");
    //Increment product count
    productCount++;
    //Create the product
    products[productCount] = Product(productCount, _name, _price, msg.sender, false);
    //Trigger an event
    emit ProductCreated(productCount, _name, _price, msg.sender, false);
  }


  function purchaseProduct(uint _id) public {
    //Fetch the product and make a copy of it
    Product memory _product = products[_id];
    //Fetch the owner
    address payable _seller = _product.owner;
    //Make sure the product has valid id
    require(_product.id > 0 && _product.id <= productCount, "Enter valid id");

    //Require that there is enough PUCAs to confirm the transaction
    uint balance = _token.balanceOf(msg.sender);
    require(balance >= _product.price, "Transfer the correct amount");

    //Require that the product has not been purchased already
    require(!_product.purchased, "Product has been purchased");
    //Require that the buyer is not the seller
    require(msg.sender != _seller, "Buyer cannot be seller");

    //Transfer ownership to the buyer
    _product.owner = msg.sender;
    //Mark as purchased
    _product.purchased = true;
    //Update the product
    products[_id] = _product;

    //Pay the seller by sending them PUCAs
    _token.transferFrom(buyer, _seller, _product.price);

    //Trigger an event
    emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
  }
}