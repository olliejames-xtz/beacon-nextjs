"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { connectBeacon } from "./beacon";

type ConnectionContext = {
  address: string | undefined;
  connect: () => void;
  disconnect: () => void;
};

const ConnectionContext = createContext<ConnectionContext>(null as any);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [disconnectFn, setDisconnectFn] = useState<() => void>(null as any);
  const connect = async () => {
    const res = await connectBeacon();
    setAddress(res.address);
    setDisconnectFn(res.disconnect);
  };

  return (
    <ConnectionContext.Provider
      value={{ connect, address, disconnect: disconnectFn }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  return useContext(ConnectionContext);
};
