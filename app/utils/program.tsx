import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor';
import { Connection, PublicKey } from "@solana/web3.js";
import type { Lending2 } from "./lending2";  
import IDL from "./lending2.json"; 

import {
    USER_SEED,
    USER_TOKEN_SEED,
    BANK_TOKEN_ACCOUNT_SEED,
    PROGRAM_ID,
} from "./constants";

import { AnchorWallet } from "@solana/wallet-adapter-react";

export const getProgram = (connection: Connection, wallet: AnchorWallet) => {

    const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
    });

    const program = new Program<Lending2>(IDL as Idl, provider);

    return program;
};

export const getUserAddress = (signer: PublicKey): PublicKey => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(USER_SEED),
            signer.toBuffer(),
        ], 
        PROGRAM_ID
    )[0];
};

export const getUserTokenAccountAddress = (payer: PublicKey, mint: PublicKey) : PublicKey => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(USER_TOKEN_SEED),
            payer.toBuffer(),
            mint.toBuffer(), 
        ],
        PROGRAM_ID)[0];
}

export const getBankAccountAddress = (mint: PublicKey) : PublicKey=> {
    return PublicKey.findProgramAddressSync(
        [
            mint.toBuffer(),
        ],
        PROGRAM_ID)[0]
}

export const getBankTokenAccountAddress = (mint: PublicKey) : PublicKey=> {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(BANK_TOKEN_ACCOUNT_SEED),
            mint.toBuffer(),
        ],
        PROGRAM_ID)[0]
}

