import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async (artifacts) => {
    if (artifacts) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();

      const { abi: main_abi } = artifacts[0];
      // const { abi: sub_abi } = artifacts[1];

      let main_contract_address, main_contract;
      try {
        main_contract_address = artifacts[0].networks[networkID]?.address;

        main_contract = new web3.eth.Contract(main_abi, main_contract_address);
        // sub_contract = new web3.eth.Contract(sub_abi, address);

        // console.log(sub_abi, ": sub_abi");
        console.log(main_contract_address);
      } catch (err) {
        console.error(err);
      }
      dispatch({
        type: actions.init,
        data: {
          artifact: artifacts[0],
          web3,
          accounts,
          networkID,
          contract: main_contract,
        },
      });
    }
  }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const ItemManagerArtifact = require("../../contracts/ItemManager.json");
        const ItemArtifact = require("../../contracts/Item.json");
        const artifacts = [ItemManagerArtifact, ItemArtifact];
        init(artifacts);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
