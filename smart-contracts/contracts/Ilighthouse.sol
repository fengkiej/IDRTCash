pragma solidity 0.5.8;

interface ILighthouse {

    function peekData() external view returns (uint128 v,bool b);

    function peekUpdated()  external view returns (uint32 v,bool b);

    function peekLastNonce() external view returns (uint32 v,bool b);

    function peek() external view returns (bytes32 v ,bool ok);

    function read() external view returns (bytes32 x);
}