pragma solidity >= 0.4.23 <0.6.0;

import { IERC721Receiver } from './IERC721Receiver.sol';

contract ERC721Receiver is IERC721Receiver {
    bytes4 private constant _ERCReceivingContractCode = 0x150b7a02; //bytes4(keccak("onERC721Received(address,address,uint256,bytes)"))

    event Receive(address operator, address from, address to, uint256 tokenId, bytes data);
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data) public returns (bytes4) {
        emit Receive(operator, from, address(this), tokenId, data);
        return _ERCReceivingContractCode;
    }
}