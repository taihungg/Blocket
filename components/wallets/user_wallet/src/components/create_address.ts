import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { DEFAULT_ED25519_DERIVATION_PATH, Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import aes from 'aes-js';

// Hàm tạo khóa 32 byte từ mật khẩu và salt bằng PBKDF2 (Web Crypto API)
async function hashTo32Bytes(password: string, salt: Uint8Array): Promise<Uint8Array | undefined> {
  try {
    const enc = new TextEncoder();
    const passwordBuffer = enc.encode(password);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const key = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt, // Đảm bảo salt là Uint8Array
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      256 // 32 byte
    );

    return new Uint8Array(key);
  } catch (error) {
    console.error('Error hashing password:', error);
    return undefined;
  }
}

// Hàm mã hóa mnemonic bằng mật khẩu
async function encryptMnemonic(password: string, mnemonic: string): Promise<string | undefined> {
  try {
    // Tạo salt ngẫu nhiên
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await hashTo32Bytes(password, salt);
    if (!key) throw new Error('Failed to derive key');

    const mnemonicBytes = aes.utils.utf8.toBytes(mnemonic);
    const aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5));
    const encryptedBytes = aesCtr.encrypt(mnemonicBytes);

    // Ghép salt và dữ liệu mã hóa thành chuỗi hex
    const hexResult = aes.utils.hex.fromBytes(salt) + aes.utils.hex.fromBytes(encryptedBytes);
    return hexResult;
  } catch (error) {
    console.error('Error encrypting mnemonic:', error);
    return undefined;
  }
}

// Hàm giải mã mnemonic bằng mật khẩu
async function decryptMnemonic(password: string, encryptedHex: string): Promise<string | undefined> {
  try {
    // Tách salt và dữ liệu mã hóa
    const saltBytes = aes.utils.hex.toBytes(encryptedHex.slice(0, 32)); // 16 byte salt -> 32 ký tự hex
    const salt = new Uint8Array(saltBytes); // Chuyển đổi thành Uint8Array
    const encryptedBytes = aes.utils.hex.toBytes(encryptedHex.slice(32));

    // Tái tạo khóa từ mật khẩu và salt
    const key = await hashTo32Bytes(password, salt);
    if (!key) throw new Error('Failed to derive key');

    const aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aes.utils.utf8.fromBytes(decryptedBytes);
  } catch (error) {
    console.error('Error decrypting mnemonic:', error);
    return undefined;
  }
}

// Hàm chính để sinh địa chỉ
export default async function generateAddress(password: string): Promise<string | undefined> {
  try {
    let encryptedData = localStorage.getItem('encrypted_mnemonic') || '';

    // Nếu chưa có dữ liệu mã hóa, tạo mnemonic mới và mã hóa
    if (!encryptedData || encryptedData === '') {
      const mnemonic = bip39.generateMnemonic(wordlist);
      const encryptedResult = await encryptMnemonic(password, mnemonic);
      if (!encryptedResult) {
        throw new Error('Failed to encrypt mnemonic');
      }
      encryptedData = encryptedResult;
      localStorage.setItem('encrypted_mnemonic', encryptedData);
    }

    // Giải mã mnemonic
    const mnemonic = await decryptMnemonic(password, encryptedData);
    if (!mnemonic) {
      throw new Error('Failed to decrypt mnemonic');
    }

    // Tạo địa chỉ từ mnemonic
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic, DEFAULT_ED25519_DERIVATION_PATH);
    const publicKey = keypair.getPublicKey();
    const address = publicKey.toSuiAddress();

    return address;
  } catch (error) {
    console.error('Error generating address:', error);
    return undefined;
  }
}

// // Ví dụ sử dụng
// (async () => {
//   try {
//     const password = 'anhdoo';
//     const address = await generateAddress(password);
//     if (address) {
//       console.log('Generated Address:', address);
//     } else {
//       console.log('Failed to generate address');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// })();