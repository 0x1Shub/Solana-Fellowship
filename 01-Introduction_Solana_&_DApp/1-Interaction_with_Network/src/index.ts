import { Keypair } from '@solana/web3.js';

async function main(){
    const keypair = Keypair.generate();
    console.log(keypair.publicKey.toBase58());
    console.log(keypair.secretKey);
}

main();