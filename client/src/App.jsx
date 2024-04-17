import { EthProvider } from "./contexts/EthContext";
import Demo from "./components/Demo";
import TransactionHistory from "./components/Transactions";
import useEth from "./contexts/EthContext/useEth";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container" style={{ marginTop: "20px" }}>
          {/* <Intro /> */}
          <h1>Event Triggers / Item Management</h1>
          {/* <hr />
          <Setup /> */}
          <hr />
          <Demo />
          <hr />
          <TransactionHistory />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
