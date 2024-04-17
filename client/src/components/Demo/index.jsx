import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const {
    state: { artifact, accounts, contract },
  } = useEth();
  const [value, setValue] = useState({
    cost: 0,
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const dataObj = { cost: parseInt(value.cost), name: value.name };
    const tx = await contract.methods
      .createItem(dataObj.name, dataObj.cost)
      .send({ from: accounts[0] });

    if (tx) {
      setLoading(false);
      alert(
        "Send " +
          dataObj.cost +
          "wei to " +
          tx.events.SupplyChainStep.returnValues._address
      );
    }

    console.log(tx, ": tx");
  };

  const demo = (
    <>
      <div
        style={{
          height: "250px",
          backgroundColor: "rgba(0,0,0,0.033)",
          padding: 20,
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          name="cost"
          value={value.cost}
          placeholder="Amount in wei"
          onChange={handleChange}
          style={{
            width: "80%",
            height: "50px",
            borderRadius: "10px",
            fontSize: "1.75rem",
            borderWidth: 0.5,
            paddingLeft: "10px",
            outline: "none",
          }}
        />
        <input
          type="text"
          name="name"
          value={value.name}
          placeholder="Enter item..."
          onChange={handleChange}
          style={{
            width: "80%",
            height: "50px",
            borderRadius: "10px",
            fontSize: "1.75rem",
            borderWidth: 0.5,
            paddingLeft: "10px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            width: "80%",
            height: "50px",
            borderRadius: "10px",
            fontSize: "1.55rem",
            backgroundColor: "#002053",
            color: "white",
            outline: "none",
            cursor: "pointer",
            border: "none",
          }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Item"}
        </button>
      </div>
    </>
  );

  return (
    <div className="demo">
      {!artifact ? (
        <NoticeNoArtifact />
      ) : !contract ? (
        <NoticeWrongNetwork />
      ) : (
        demo
      )}
    </div>
  );
}

export default Demo;
