export type Network = "ghostnet" | "mainnet";

export type EncodeAndRequestSignMessageFn = (
  message: string
) => Promise<{ signature: string; encodedMessage: string; publicKey: string }>;

export interface WalletApi {
  address: string;
  disconnect: () => Promise<void>;
  encodeAndRequestSignMessage: EncodeAndRequestSignMessageFn;
}
