pragma solidity 0.5.8;

import "./IDRTCashV1.sol";

contract IDRTCashV2 is IDRTCashV1 {
    mapping (uint => uint) internal minChange;
    mapping (uint => uint) internal lastUsedDenom;

    function makingChange(uint amount) internal returns (uint[] memory, uint) {
        uint[] memory result = new uint[](denominations_length);
        uint remainder = amount;

        if (lastUsedDenom[amount] == 0) { // Skip if it has been calculated before
            for (uint i = 0; i < denominations_length; i++) {
                for (uint curAmount = denominations[i]; curAmount <= amount; curAmount++) {
                    if(lastUsedDenom[curAmount] > 0) { // Skip if it has been calculated before
                        continue;
                    } else if (minChange[curAmount - denominations[i]] + 1 < minChange[curAmount] || minChange[curAmount] == 0) {
                        minChange[curAmount] = minChange[curAmount - denominations[i]] + 1;
                        lastUsedDenom[curAmount] = i + 1; // 0 indicates there's no coin to make change of amount
                    }
                }
            }
        }

        uint curDenom = lastUsedDenom[remainder];
        while (curDenom > 0) {
            result[curDenom - 1]++;
            remainder -= denominations[curDenom - 1];
            curDenom = lastUsedDenom[remainder];
        }

        return (result, remainder);
    }
}