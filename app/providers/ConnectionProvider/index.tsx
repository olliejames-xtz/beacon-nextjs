"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { connectBeacon } from "./beacon";

type ConnectionContext = {
  address: string | undefined;
  connect: () => void;
  disconnect?: () => void;
};

const ConnectionContext = createContext<ConnectionContext>(null as any);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [connection, setConnection] = useState<{
    address: string;
    disconnect: () => void;
  } | null>(null);
  const connect = async () => {
    const res = await connectBeacon();

    setConnection({ address: res.address, disconnect: res.disconnect });
  };

  return (
    <ConnectionContext.Provider
      value={{
        connect,
        address: connection?.address,
        disconnect: () => {
          connection?.disconnect();
          setConnection(null as any);
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
