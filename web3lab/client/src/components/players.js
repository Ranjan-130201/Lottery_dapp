import React,{useState,useEffect} from "react";


const Players=({state,address})=>{
    const [account, setAccount]=useState("No account connected");
    const[players,setplayers]=useState([]);
    const [reload, setReload] = useState(false);
    const reloadEffect = () => {
      setReload(!reload);
    };
const setAccountListner= (provider)=>{
  provider.on("accountsChanged",(accounts)=>{
    setAccount(accounts[0])
  })}
useEffect(()=>{
    const loadAccount=async()=>{
        const {web3}= state;
        const accounts=await web3.eth.getAccounts();
        setAccountListner(web3.givenProvider);
        setAccount(accounts[0]);
        }
       state.web3 && loadAccount();
},[state,state.web3]);

useEffect(()=>{
    const getPlayers=async()=>{
        const {contract}=state;
        const players= await contract.methods.allPlayers().call();
        const regPlayers= await Promise.all(
            players.map((player)=>{
                return player;
            })
        );
        setplayers(regPlayers);
        reloadEffect();
    };
    state.contract && getPlayers();
},[state,state.contract, reload]);

const transfer=()=>{
  const {web3}= state;
  web3.eth.sendTransaction({from:account, to: address,value:web3.utils.toWei("1","finney")})
}

    return(
        <>
        <ul className="list-group" id="list">
          <div className="center">
            <li className="list-group-item" aria-disabled="true">
              <b>Connected account :</b> {account}
            </li>
            <li className="list-group-item">
              <b>Please pay 0.001 ether (1 finney) on this contract address : {address}</b> 
              <button className="button1" onClick={transfer}>
          Transfer
        </button>
            </li>
            <li className="list-group-item">
              <b>Registered Players </b>:
              <br />
              <br />
              {players.length !== 0 &&
                players.map((name) => <p key={name}>{name}</p>)}
            </li>
          </div>
        </ul>
      </>
    )
};
export default Players;