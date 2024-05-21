import { BeaconWallet } from "@taquito/beacon-wallet";
import { PermissionScope } from "@airgap/beacon-types";

import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito";

const createBeaconWallet = () =>
  typeof window === "undefined"
    ? undefined
    : new BeaconWallet({
        name: "My Dapp",
        appUrl: "mydapp.com",
        iconUrl: "/img.png",
        network: "ghostnet",
        walletConnectOptions: {
          projectId: "97f804b46f0db632c52af0556586a5f3",
          relayUrl: "wss://relay.walletconnect.com",
        },
        featuredWallets: ["kukai", "trust", "temple", "umami"],
      } as any);

export const getTezosToolkit = () => {
  const url = "https://rpc.ghostnet.teztnets.xyz/";
  const tezosToolkit = new TezosToolkit(url);
  tezosToolkit.setPackerProvider(new MichelCodecPacker());
  return tezosToolkit;
};

export const connectBeacon = async () => {
  const network = "ghostnet";
  const tezosToolkit = getTezosToolkit();

  const beaconWallet = createBeaconWallet();
  tezosToolkit.setWalletProvider(beaconWallet);

  if (!beaconWallet) {
    throw new Error("Tried to connect on the server");
  }
  const response = await beaconWallet.client.requestPermissions({
    network: {
      type: network as any,
    },
    scopes: [PermissionScope.OPERATION_REQUEST],
  });

  return {
    address: response.address,
    connection: {
      network,
      imageUrl: undefined,
    },
    disconnect: async () => {
      await beaconWallet.client.disconnect();
    },
  };
};
