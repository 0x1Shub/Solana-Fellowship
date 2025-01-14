import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// Define constants
const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com"; // Mainnet endpoint
const connection = new Connection(RPC_ENDPOINT, "confirmed");

// Replace with your USDC Mint Address on Solana (Mainnet USDC)
const USDC_MINT_ADDRESS = new PublicKey("ATokenMintAddress");

// Load sender's wallet (replace with your actual private key)
const sender = Keypair.fromSecretKey(
  Uint8Array.from([
    /* your private key here */
  ])
);
const senderPublicKey = sender.publicKey;

// Replace with the recipient's public key
const recipientPublicKey = new PublicKey("RecipientPublicKeyHere");

// Define transfer amount (in smallest units, USDC uses 6 decimals)
const amount = 1 * 10 ** 6; // Transferring 1 USDC

// Transfer USDC Function
const transferUSDC = async () => {
  try {
    // Derive Associated Token Accounts (ATA) for both sender and recipient
    const senderTokenAccount = await getAssociatedTokenAddress(
      USDC_MINT_ADDRESS,
      senderPublicKey
    );
    const recipientTokenAccount = await getAssociatedTokenAddress(
      USDC_MINT_ADDRESS,
      recipientPublicKey
    );

    // Create Transfer Instruction
    const transferInstruction = createTransferInstruction(
      senderTokenAccount, // Sender's USDC token account
      recipientTokenAccount, // Recipient's USDC token account
      senderPublicKey, // Authority (signer)
      amount, // Amount in smallest units
      [], // Multi-signature (if any)
      TOKEN_PROGRAM_ID // SPL Token Program ID
    );

    // Create Transaction and Send
    const transaction = new Transaction().add(transferInstruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      sender,
    ]);

    console.log("Transaction successful! Signature:", signature);
  } catch (error) {
    console.error("Error transferring USDC:", error);
  }
};

// Call the function
transferUSDC();
