import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// Define constants
const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com"; // Mainnet endpoint
const connection = new Connection(RPC_ENDPOINT, "confirmed");

// Replace with your USDC Mint Address on Solana (Mainnet USDC Mint Address)
const USDC_MINT_ADDRESS = new PublicKey("ATokenMintAddress");

// Load sender's wallet (replace with your actual private key)
const sender = Keypair.fromSecretKey(
  Uint8Array.from([
    /* your private key here */
  ])
);
const senderPublicKey = sender.publicKey;

// Create ATA Function
const createATA = async () => {
  try {
    // Derive Associated Token Account Address (ATA) for sender's wallet
    const ata = await getAssociatedTokenAddress(
      USDC_MINT_ADDRESS, // USDC mint address
      senderPublicKey // Sender's public key
    );

    // Check if the ATA already exists
    const ataExists = await connection.getAccountInfo(ata);
    if (ataExists) {
      console.log("ATA already exists for this token.");
      return;
    }

    // Create Associated Token Account Instruction
    const createATAInstruction = createAssociatedTokenAccount(
      senderPublicKey, // Payer (signer)
      senderPublicKey, // Owner (associated token account owner)
      USDC_MINT_ADDRESS, // Token mint (USDC)
      senderPublicKey, // Owner's public key
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID
    );

    // Create and send the transaction
    const transaction = new Transaction().add(createATAInstruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      sender,
    ]);

    console.log("ATA created successfully! Transaction signature:", signature);
  } catch (error) {
    console.error("Error creating ATA:", error);
  }
};

// Call the function
createATA();
