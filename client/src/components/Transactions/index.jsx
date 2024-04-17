import React, { useState, useEffect, useCallback } from "react";
import useEth from "../../contexts/EthContext/useEth";

const TransactionHistory = () => {
  const [data, setData] = useState(null);

  const {
    state: { contract, accounts, artifact },
  } = useEth();

  const listenToEvents = async () => {
    await contract?.events?.SupplyChainStep().on("data", async (event) => {
      // console.log(event, ": event");
      const itemObj = await contract.methods
        .items(event.returnValues._itemIndex)
        .call();
      alert(`Item ${itemObj._identifier} was paid for. Deliver it now!`);
    });

    // console.log(events);
  };

  const getAllTransactions = useCallback(async () => {
    const events = await contract.getPastEvents("allEvents", {
      fromBlock: 0,
      toBlock: "latest",
    });
    let data = [];

    events.forEach((event) => {
      const { id, blockNumber, transactionHash, ...rest } = event;
      // console.log(id, blockNumber, transactionHash, rest, ": event");
      data.push({
        id,
        blockNumber,
        transactionHash,
      });
    });

    setData(data);
  }, [listenToEvents]);

  useEffect(() => {
    listenToEvents();
  }, [artifact, contract, accounts]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong
          style={{
            fontSize: "2rem",
            marginBottom: "20px",
          }}
        >
          Transactions
        </strong>
        <button
          onClick={getAllTransactions}
          style={{
            display: "block",
            fontSize: "1.25rem",
            height: "50px",
            width: "100px",
            borderRadius: "10px",
            backgroundColor: "green",
            cursor: "pointer",
            border: "none",
            color: "white",
          }}
        >
          Read Transactions
        </button>
      </div>
      <hr />
      <div>
        {data &&
          data.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <strong>Event ID: {item.id}</strong>
              <br />
              <strong>Block Number: {item.blockNumber}</strong>
              <br />
              <strong>Transaction Hash: {item.transactionHash}</strong>
              <hr />
            </div>
          ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
