import {useEffect,useState} from 'react'
import Web3 from "web3"
import AdityaToken from "./AdityaToken.json"
import Button from 'react-bootstrap/Button';

import "./App.css"
import Form from 'react-bootstrap/Form';




function App() {
  const [balance, setbalance] = useState(0);
  const [account, setAccount] = useState("");
  const [adityaContract, setContract] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const loadWeb3 = async () => {
      // Connect to Local blockchain network
      window.web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:7545")
      );
      // To Connect to MetaMask
      // window.web3 = new Web3(window.ethereum);
    };

    const loadBlockchainData = async () => {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const adityaContractAddress = "0xa806B56E01F98234F0A4e74697bB2a416BA5D897"; // Contract Address Here
      const adityaTokenContract = new web3.eth.Contract(
        AdityaToken.abi,
        adityaContractAddress
      );
      setContract(adityaTokenContract);
      console.log(accounts);
      setAccounts(accounts);
      setAccountDetails(adityaTokenContract, accounts[0]);
    };
    loadWeb3();
    loadBlockchainData();
  }, []);

  const setAccountDetails = async (adityaContract, accountValue) => {
    const web3 = window.web3;
    setAccount(accountValue);
    const balance = await adityaContract.methods.balanceOf(accountValue).call();
    setbalance(web3.utils.fromWei(balance.toString()));
  };

  const transfer = async (recipient, amount) => {
    console.log(recipient, amount);
    await adityaContract.methods
      .transfer(recipient, amount)
      .send({ from: account });
    await setAccountDetails(adityaContract, account);
  };

  const handleReceipient = (e) => {
    setRecipient(e.target.value);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const onSelectChange = (e) => {
    setAccountDetails(adityaContract, e.target.value);
  };
  return (
    <div className="centered-div">
      <div  style={{ width: "600px" ,textAlign: "center"}}>
          <h3> Select From Account: </h3>
          <Form.Select aria-label="Default select example" onChange={(e) => onSelectChange(e)}>
            {accounts.map((accAddress) => (
                <option value={accAddress} key={accAddress}>
                  {accAddress}
                </option>
              ))}
          </Form.Select>
        <h1 className="mt-3">{balance + " ADI"}</h1>
        <p></p> 
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            const value = window.web3.utils.toWei(amount, "Ether");
            console.log(recipient, value);
            transfer(recipient, value);
          }}
        >
          <h4 className="mt-5"> Sent to </h4>
          <Form.Control type="text" placeholder="Recipient Address" onChange={(e) => handleReceipient(e)} required/>
          <Form.Control type="text" placeholder="Amount" onChange={(e) => handleAmount(e)} required/>
        
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {/* </div> */}
      </div>
    </div>
  );
}


export default App;
