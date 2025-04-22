import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { DEFAULT_ED25519_DERIVATION_PATH, Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64, toBase64 } from '@mysten/sui/utils'
import aes from 'aes-js';
// import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
// import { Signer } from '@mysten/sui/cryptography';
// import {Transaction} from '@mysten/sui/transactions';
function encrypt_password(pass: string, mnemonic: string) {
    const mnemonic_bytes = aes.utils.utf8.toBytes(mnemonic);
    const pass_bytes = aes.utils.utf8.toBytes(pass);

    const aesCtr = new aes.ModeOfOperation.ctr(pass_bytes, new aes.Counter(5));
    const encrypt_result = aesCtr.encrypt(mnemonic_bytes);

    return aes.utils.hex.fromBytes(encrypt_result);
}
function decrypt_password(pass: string, encrypted_hex: string) {
    // const encrypted_hex = localStorage.getItem("pass");
    const pass_bytes = aes.utils.utf8.toBytes(pass);

    if (encrypted_hex) {
        const encrypted_bytes = aes.utils.hex.toBytes(encrypted_hex)
        const aesCtr = new aes.ModeOfOperation.ctr(pass_bytes, new aes.Counter(5));
        const decryptBytes = aesCtr.decrypt(encrypted_bytes);
        return aes.utils.utf8.fromBytes(decryptBytes);
    }
    else {
        console.error('not pass encrypt store in localStorage')

    }

}
export default function genAddress(password: string) {
    let mnemonic = localStorage.getItem('pass');

    if (!mnemonic || mnemonic === '') {
        let mnemonic = bip39.generateMnemonic(wordlist)
        localStorage.setItem("pass", encrypt_password(password, mnemonic));
    }

    if (mnemonic && mnemonic !== '') {
        decrypt_password(password, mnemonic || encrypt_password(password, mnemonic));
        const keypair = Ed25519Keypair.deriveKeypair(mnemonic, DEFAULT_ED25519_DERIVATION_PATH);

        /* Lấy keypair từ private key
        const privatekey = Uint8Array.from(Buffer.from(secretkey.slice(2), "hex"));
        const keypair = Ed25519Keypair.fromSecretKey(privatekey);
        */

        const publickey = keypair.getPublicKey();
        const secretkey = keypair.getSecretKey();
        const address = publickey.toSuiAddress();

        // const client = new SuiClient({url: getFullnodeUrl('devnet')});
        // const provider = "https://prover-dev.mystenlabs.com/v1";
    }
    else{
        console.error('some thing wrong when generate address by password');
    }
}





