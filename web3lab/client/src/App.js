import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import Lottery from "./contracts/Lottery.json";
import "./App.css";
import Manager from "./components/manager";
import Players from "./components/players";
import { Route,Link } from "react-router-dom";
import Intro from "./components/intro";

const App = () => {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [address, setAddress] = useState(null);
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();

        const deployedNetwork = Lottery.networks[networkId];
        console.log("Contract Address:", deployedNetwork.address);
        const instance = new web3.eth.Contract(
          Lottery.abi,
          deployedNetwork && deployedNetwork.address
        );
        setAddress(deployedNetwork.address);
        setState({ web3, contract: instance });
      } catch (error) {
        alert("Falied to load web3 or contract.");
        console.log(error);
      }
    };
    init();
  }, []);
  console.log(state.contract)
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link navtext" aria-current="page">
                Lottery System
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/manager"
                className="nav-link navtext"
                aria-current="page"
              >
                Manager
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/player" className="nav-link navtext">
                Player
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <Route exact path="/">
      <Intro></Intro>
    </Route>
    <Route path="/manager">
      <Manager state={state} />
    </Route>
    <Route path="/player">
      <Players address={address} state={state} />
    </Route>
  </>
  );
};
export default App;
