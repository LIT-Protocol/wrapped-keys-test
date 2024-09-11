"use client";
import { generateWrappedKey } from "../lit/generateWrappedKey";
import { signMessageWithWrappedKey } from "../lit/signMessageWithWrappedKey";
// import { signTransactionWithWrappedKey } from "../lit/signTransactionWithWrappedKey";
import { GeneratePrivateKeyResult } from "@lit-protocol/wrapped-keys-bc";
import { LIT_RPC } from "@lit-protocol/constants";
import { mintPkp } from "../lit/utils";
import * as ethers from "ethers";

export default function Home() {
    const ETHEREUM_PRIVATE_KEY: string | undefined =
        process.env.NEXT_PUBLIC_ETHEREUM_PRIVATE_KEY;

    async function handleGenerateWrappedKeyEvm() {
        console.log(
            "should generate an Ethereum Wrapped Key and attach it to a new PKP"
        );

        if (!ETHEREUM_PRIVATE_KEY) {
            throw new Error(
                "Ethereum private key is not defined in environment variables"
            );
        }

        const ethersSigner = new ethers.Wallet(
            ETHEREUM_PRIVATE_KEY,
            new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
        );
        const mintedPkp = await mintPkp(ethersSigner);

        const generateWrappedKeyResponse = (await generateWrappedKey(
            mintedPkp!.publicKey,
            "evm",
            "This is a Dev Guide code example testing Ethereum key"
        )) as GeneratePrivateKeyResult;

        console.log(generateWrappedKeyResponse);

        console.log("Signing a tx");

        const sanitizedPublicKey =
            generateWrappedKeyResponse.generatedPublicKey.slice(
                generateWrappedKeyResponse.generatedPublicKey.startsWith("0x04")
                    ? 4
                    : 2
            );
        const addressHash = ethers.utils.keccak256(`0x${sanitizedPublicKey}`);

        console.log(addressHash);

        const messageToSign = ethers.utils.toUtf8Bytes(
            "The answer to the universe is 42"
        );

        const signedMessage = (await signMessageWithWrappedKey(
            mintedPkp!.publicKey,
            "evm",
            generateWrappedKeyResponse.id,
            messageToSign
        )) as string;

        console.log(signedMessage);
    }

    async function handleGenerateWrappedKeySol() {
        console.log("Generating a Solana Wrapped Key using generatePrivateKey");

        if (!ETHEREUM_PRIVATE_KEY) {
            throw new Error(
                "Ethereum private key is not defined in environment variables"
            );
        }

        const ethersSigner = new ethers.Wallet(
            ETHEREUM_PRIVATE_KEY,
            new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
        );
        const mintedPkp = await mintPkp(ethersSigner);

        const response = (await generateWrappedKey(
            mintedPkp!.publicKey,
            "solana",
            "This is a Dev Guide code example testing Solana key"
        )) as GeneratePrivateKeyResult;

        console.log(response);
    }

    return (
<div className="flex flex-col items-center justify-start min-h-screen py-10">
    <div className="space-y-4 mb-8 text-center">
        <h1 className="text-2xl font-semibold text-white-800">EVM Wrapped Key Tests</h1>
        <button
            className="bg-gray-600 text-white px-5 py-3 rounded-md hover:bg-blue-800 transition duration-300"
            onClick={handleGenerateWrappedKeyEvm}
        >
            Run Tests on Datil Dev
        </button>
    </div>

    <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-white-800">Solana Wrapped Keys Tests</h1>
        <button
            className="bg-gray-600 text-white px-5 py-3 rounded-md hover:bg-green-800 transition duration-300"
            onClick={handleGenerateWrappedKeySol}
        >
            Run Tests on Datil Dev
        </button>
    </div>
</div>
    );
}
