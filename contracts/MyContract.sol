// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.6 <0.9.0;

import "./IMyContract.sol";

contract MyContract is IMyContract{

	uint private num1;
	uint public num2;

	// Function definitions of functions declared inside an interface // Bir arabirim içinde bildirilen işlevlerin işlev tanımları
	function getStr() public view virtual override returns(string memory){
		return "K.HELVACI";
	}
	
	// Function to set the values of the private variables // Özel değişkenlerin değerlerini ayarlayan işlev
	function setValue(uint _num1, uint _num2) public virtual override{			
		num1 = _num1;
		num2 = _num2;
	}
	
	// Function to add 2 numbers // 2 sayı ekleme işlevi
	function add() public view virtual override returns(uint){
		return num1 + num2;
	}
}

contract call{
	
	IMyContract obj;

	constructor(){
		obj = new MyContract();
	}
	
	// Function to print string value and the sum value // Dize değerini ve toplam değeri yazdırma işlevi
	function getValue() public returns(string memory,uint){
		obj.setValue(10, 16);
		return (obj.getStr(),obj.add());
	}
}

// https://www.geeksforgeeks.org/solidity-basics-of-interface/
// https://medium.com/coinmonks/solidity-tutorial-all-about-interfaces-f547d2869499