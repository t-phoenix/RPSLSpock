/**
 *Submitted for verification at Etherscan.io on 2024-01-26
 */

/**
 *  @title RPS Registry
 *  @author Abhinil Agarwal
 */

/* This program is free software. It comes without any warranty, to
the extent permitted by applicable law. You can redistribute it
and/or modify it under the terms of the Do What The Fuck You Want
To Public License, Version 2, as published by Sam Hocevar. See
http://www.wtfpl.net/ for more details. */

pragma solidity ^0.4.26;

contract RPSRegistry {
    address[] public games; //list of RPS games

    event GameAdded(address indexed user, address newGame); //Emits event whenever a game is added to Registry

    /** @dev To be called by RPS game creator to enlist the game in App Registry
     * @param _newGame Address og the game contract
     */
    function addGame(address _newGame) public {
        require(
            !isAddressInList(_newGame),
            "Address already exists in the list"
        );
        games.push(_newGame);
        emit GameAdded(msg.sender, _newGame);
    }

    /** @dev To be called by the App Home to enlist all the RPS Games Contract
     */
    function getGames() public view returns (address[] memory) {
        return games;
    }

    // Function to check if an address is already in the list
    function isAddressInList(
        address _targetAddress
    ) public view returns (bool) {
        for (uint i = 0; i < games.length; i++) {
            if (games[i] == _targetAddress) {
                return true;
            }
        }
        return false;
    }
}
