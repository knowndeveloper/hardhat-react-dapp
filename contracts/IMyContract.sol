// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.6 <0.9.0;
//initialize the interface
interface IMyContract{

	// Functions having only
	// declaration not definition
	function getStr() external view returns(string memory);

	function setValue(uint _num1, uint _num2) external;

	function add() external view returns(uint);
}