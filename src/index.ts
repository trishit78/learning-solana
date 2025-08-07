
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import "dotenv/config"

// const keypair = Keypair.generate()

// console.log(`The public key is `, keypair.publicKey.toBase58())
// console.log(`The private Key is `, keypair.secretKey)

// const keypair = getKeypairFromEnvironment("SECRET_KEY");
// console.log(keypair.publicKey.toBase58())
// console.log(keypair.secretKey)
//  console.log("loaded from env")
//console.log(keypair)


const main = async()=>{

//  const keypair = Keypair.generate()

//  console.log(`The public key is `, keypair.publicKey.toBase58())

//const address = new PublicKey("CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN")
//  const balance  = await connection.getBalance(address)
    const publicKey = new PublicKey("GUXp3FVs9zBD91PKYCEKA7QfcvF1NPmk9v2VfbrovM2n")
    const connection  = new Connection("https://api.devnet.solana.com","confirmed");
    console.log("connected")
    const balanceInLamports = await connection.getBalance(publicKey)
  
    const balanceInSol = balanceInLamports/LAMPORTS_PER_SOL
    
    console.log(`The balance of the account at address ${publicKey} is ${balanceInSol} lamports`);
    console.log('finished')
}
main()