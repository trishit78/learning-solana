import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  airdropIfRequired,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";

import "dotenv/config";

const suppliedToPubkey = process.argv[2] || null;
if (!suppliedToPubkey) {
  console.log(`Please provide a public key to send to`);
  process.exit(1);
}

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(suppliedToPubkey);

const toPubkey = new PublicKey(suppliedToPubkey);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const LAMPORTS_TO_SEND = 5000;

console.log("done");

const main = async () => {
  try {
    await airdropIfRequired(
      connection,
      senderKeypair.publicKey,
      1 * LAMPORTS_PER_SOL, // Amount to airdrop if needed
      0.5 * LAMPORTS_PER_SOL // Minimum balance threshold
    );
    console.log("airdrop done");

    const transaction = new Transaction();

    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey,
      lamports: LAMPORTS_TO_SEND,
    });

    transaction.add(sendSolInstruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderKeypair,
    ]);

    console.log("transfer successful");
    console.log(`transaction signature is ${signature}`);

    console.log(
      `Finished | sent ${LAMPORTS_TO_SEND} to the address  ${toPubkey}`
    );
  } catch (error) {
    console.log(error);
  }
};
main();
