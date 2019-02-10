pragma solidity >= 0.4.23 <0.6.0;

import { ERC721Receiver } from './ERC721Receiver.sol';

contract ERC721ReceiverTestable is ERC721Receiver {
    bool _returnFalseValue;
    constructor(bool returnFalseValue) public {
        _returnFalseValue = returnFalseValue;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data) public returns (bytes4) {
        bytes4 result =  super.onERC721Received(operator, from, tokenId, data);
        if(_returnFalseValue) {
            return 0xFFFFFFFF;
        } else {
            return result;
        }       
    }
}
