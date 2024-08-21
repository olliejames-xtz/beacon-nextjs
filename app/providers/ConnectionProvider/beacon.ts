import { PermissionScope, SigningType } from "@airgap/beacon-types";
import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito";
import { EncodeAndRequestSignMessageFn, Network, WalletApi } from "./types";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { messageToHexExpr } from "./tools";

const createBeaconWallet = async (network: Network) => {
  const BeaconWallet = (await import("@taquito/beacon-wallet")).BeaconWallet;

  return new BeaconWallet({
    name: "My Dapp",
    appUrl: "mydapp.com",
    iconUrl: "/img.png",
    network: { type: network as any },
    walletConnectOptions: {
      projectId: "97f804b46f0db632c52af0556586a5f3",
      relayUrl: "wss://relay.walletconnect.com",
    },
    featuredWallets: ["kukai", "trust", "temple", "umami"],
  });
};

export const getTezosToolkit = (network: Network) => {
  const url =
    network === "mainnet"
      ? "https://mainnet.ecadinfra.com/"
      : "https://rpc.ghostnet.teztnets.xyz/";

  const tezosToolkit = new TezosToolkit(url);
  tezosToolkit.setPackerProvider(new MichelCodecPacker());
  return tezosToolkit;
};

export const connectBeacon = async (
  network: Network,
  {
    attemptToReestablishConnection,
  }: { attemptToReestablishConnection: boolean }
): Promise<WalletApi | null> => {
  const tezosToolkit = getTezosToolkit(network);
  const beaconWallet = await createBeaconWallet(network);
  tezosToolkit.setWalletProvider(beaconWallet);

  if (attemptToReestablishConnection) {
    const existingAccount = await beaconWallet.client.getActiveAccount();
    if (!existingAccount) return null;
    return {
      address: existingAccount.address,
      encodeAndRequestSignMessage: encodeAndRequestSignMessageFn(beaconWallet),
      disconnect: async () => {
        await beaconWallet.client.disconnect();
      },
    };
  }

  const response = await beaconWallet.client.requestPermissions({
    network: {
      type: network as any,
    },
    scopes: [PermissionScope.OPERATION_REQUEST, PermissionScope.SIGN],
  });

  return {
    address: response.address,
    disconnect: async () => {
      await beaconWallet.client.disconnect();
    },
    encodeAndRequestSignMessage: encodeAndRequestSignMessageFn(beaconWallet),
  };
};

const encodeAndRequestSignMessageFn: (
  wallet: BeaconWallet
) => EncodeAndRequestSignMessageFn = (wallet) => async (body) => {
  const hexExpr = messageToHexExpr(body);
  const { signature } = await wallet.client.requestSignPayload({
    signingType: SigningType.MICHELINE,
    payload: hexExpr,
    sourceAddress: wallet.account?.address,
  });
  if (!wallet.account?.publicKey) {
    throw new Error("No public key");
  }
  return {
    signature,
    encodedMessage: hexExpr,
    publicKey: wallet.account?.publicKey,
  };
};
