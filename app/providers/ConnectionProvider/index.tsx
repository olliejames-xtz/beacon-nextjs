"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { connectBeacon } from "./beacon";
import { EncodeAndRequestSignMessageFn, Network, WalletApi } from "./types";

type ConnectionContext = {
  address: string | undefined;
  connect: () => void;
  disconnect?: () => void;
  encodeAndRequestSignMessage?: EncodeAndRequestSignMessageFn;
};

const ConnectionContext = createContext<ConnectionContext>(null as any);

export const ConnectionProvider = ({
  children,
  network,
}: {
  children: ReactNode;
  network: Network;
}) => {
  const [connection, setConnection] = useState<WalletApi | null>(null);

  const connect = async (attemptToReestablishConnection: boolean) => {
    const res = await connectBeacon(network, {
      attemptToReestablishConnection,
    });
    if (!res) return;
    setConnection(res);
  };

  useEffect(() => {
    connect(true); // on page load we try to reestablish any existing connection
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        connect: () => connect(false),
        address: connection?.address,
        encodeAndRequestSignMessage: connection?.encodeAndRequestSignMessage,
        disconnect: () => {
          connection?.disconnect();
          setConnection(null);
        },
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  return useContext(ConnectionContext);
};
