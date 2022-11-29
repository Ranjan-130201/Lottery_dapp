import React,{useState,useEffect} from "react";
import "./manager.css";

const Manager=({state})=>{
    const [account,setAccount]=useState(null);
    const [balance,setBalance]=useState(null);
    const [winner,setWinner]=useState("No winner yet");

  const setAccountListner= (provider)=>{
    provider.on("accountsChanged",(accounts)=>{
      setAccount(accounts[0])
    })
  }

    useEffect(()=>{
        const loadAccount=async()=>{
            const {web3}=state;
            const accounts=await web3.eth.getAccounts();
            setAccountListner(web3.givenProvider);
            setAccount(accounts[0]);
        }
        state.web3 && loadAccount();
    }, [state.web3,state]);

    const contractBalance = async()=>{
        const {contract}=state;
        try{
        const balance= await contract.methods.getbalance().call({from:account});
        setBalance(balance);
        }catch(e){
          if(e.message.includes("only manager has access")){
            setBalance("only manager has access");
          }else{
          setBalance('unknown error')
        }
        }
    
    }
    const Lwinner =async()=>{
        const {contract}=state;
       try{ 
        await contract.methods.pickWinner().send({from:account});
        await contract.methods.winner().call().then(res=>setWinner(res));
        }catch(e){
            if(e.message.includes("only manager has access")){
                setWinner("only manager has access");
            }else if(e.message.includes("players are less then 3")){
                setWinner("Players are less than 3");
            }else{
              setWinner('unknown error')
            }
        }
        // console.log(contract.methods.winner().call())
    }
return(
    <ul className="list-group" id="list">
    <div className="center">
      <li className="list-group-item" aria-disabled="true">
        <b>Connected account :</b> {account}
      </li>
      <li className="list-group-item">
        <b> Winner : </b>
        {winner}
        <button className="button1" onClick={Lwinner}>
          Click For Winner
        </button>
      </li>
      <li className="list-group-item">
        <b>Balnace : </b> {balance} ETH
        <button className="button1" onClick={contractBalance}>
          Click For Balance
        </button>
      </li>
    </div>
  </ul>
)
}
export default Manager