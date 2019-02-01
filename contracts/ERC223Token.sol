pragma solidity >=0.4.23 <0.6.0;

import 'contracts/ERC223Interface.sol';
import 'contracts/SafeMath.sol';
import 'contracts/ERC223ReceivingContract.sol';

contract ERC223Token is ERC223Interface {
    using SafeMath for uint;

    mapping(address => uint) balances;

    function balanceOf(address who) public view returns (uint) {
        return balances[who];
    }

    function transfer(address to, uint value) public {
       bytes memory emptyBytes;
       uint codeLength;
       assembly {
           codeLength := extcodesize(to)
       }

       balances[msg.sender] = balances[msg.sender].sub(value);
       balances[to] = balances[to].add(value);

       if(codeLength > 0) {
           ERC223ReceivingContract receiver = ERC223ReceivingContract(to);
           receiver.tokenFallback(msg.sender, value, emptyBytes);
       }
       emit Transfer(msg.sender, to, value, emptyBytes);
    }

    function transfer(address to, uint value, bytes memory data) public {
        
        uint codeLength;
        assembly {
            codeLength := extcodesize(to)
        }

        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);
        if(codeLength>0) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(to);
            receiver.tokenFallback(msg.sender, value, data);
        }
        emit Transfer(msg.sender, to, value, data);
    }
}