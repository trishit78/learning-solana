import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useEffect, useState } from "react";

export const WalletPage = () => {
  const [balance, setBalance] = useState(0);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const sendSol = async (event: any) => {
    event.preventDefault();

    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const amount = parseFloat(event.currentTarget.amount.value);
      const recipientPubKey = new PublicKey(event.currentTarget.recipient.value);

      const transaction = new Transaction();
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: amount * LAMPORTS_PER_SOL,
      });

      transaction.add(sendSolInstruction);

      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction signature: ${signature}`);
      alert(`Transaction signature: ${signature}`);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  useEffect(() => {
    const updateBalance = async () => {
      if (!connection || !publicKey) {
        setBalance(0);
        return;
      }

      try {
        const accountInfo = await connection.getAccountInfo(publicKey!);

        if (accountInfo) {
          setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
        } else {
          throw new Error("Account info not found");
        }

        connection.onAccountChange(
          publicKey!,
          (updatedAccountInfo) => {
            setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
          },
          "confirmed"
        );
      } catch (error) {
        console.error("Failed to retrieve account info:", error);
      }
    };

    updateBalance();
  }, [connection, publicKey]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">Solana Wallet</h1>

      <div className="mb-4">
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 px-4 py-2 rounded-lg" />
      </div>

      {publicKey && (
        <p className="mb-6 text-lg">
          Balance:{" "}
          <span className="font-mono text-green-400">{balance} SOL</span>
        </p>
      )}

      {publicKey ? (
        <form
          onSubmit={sendSol}
          className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md"
        >
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount (in SOL) to send
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.0001"
              placeholder="e.g. 0.1"
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="recipient" className="block text-sm font-medium mb-1">
              Recipient Address
            </label>
            <input
              id="recipient"
              name="recipient"
              type="text"
              placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            Send SOL
          </button>
        </form>
      ) : (
        <span className="text-gray-400 mt-4">Connect Your Wallet</span>
      )}
    </div>
  );
};
