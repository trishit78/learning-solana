import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {  useEffect, useState } from "react";


export const BalanceDisplay = () => {
  const [balance, setBalance] = useState(0);
  

  

const { publicKey, sendTransaction } = useWallet();
const { connection } = useConnection();

const sendSol = async (event:any) => {
  event.preventDefault();

  if (!publicKey) {
    console.error("Wallet not connected");
    return;
  }

  try {
    const recipientPubKey = new PublicKey(event.currentTarget.recipient.value);

    const transaction = new Transaction();
    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: 0.1 * LAMPORTS_PER_SOL,
    });

    transaction.add(sendSolInstruction);

    const signature = await sendTransaction(transaction, connection);
    console.log(`Transaction signature: ${signature}`);
  } catch (error) {
    console.error("Transaction failed", error);
  }
};

  useEffect(() => {
    const updateBalance = async () => {
      if (!connection || !publicKey) {
        setBalance(0)
        console.error("Wallet not connected or connection unavailable");
        return;
      }

      try {

const updatedBalance = async ()=>{

    
    const accountInfo = await connection.getAccountInfo(publicKey!);
    
    if (accountInfo) {
        setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
    } else {
        throw new Error("Account info not found");
    }
}


updatedBalance()


        connection.onAccountChange(
          publicKey!,
          (updatedAccountInfo) => {
            setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
          },
          "confirmed",
        );

       
      } catch (error) {
        console.error("Failed to retrieve account info:", error);
      }
    };

    updateBalance();
  }, [connection, publicKey]);

  return (
    <div>
      <p>{publicKey ? `Balance: ${balance} SOL` : ""}</p>
      <p> {
                publicKey ?
                    <form onSubmit={sendSol} >
                        <label htmlFor="amount">Amount (in SOL) to send:</label>
                        <input id="amount" type="text"  placeholder="e.g. 0.1" required />
                        <br />
                        <label htmlFor="recipient">Send SOL to:</label>
                        <input id="recipient" type="text"  placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                        <button type="submit" >Send</button>
                    </form> :
                    <span>Connect Your Wallet</span>
            }</p>
    </div>
  );
};