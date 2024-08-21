"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ConnectionProvider,
  useConnection,
} from "./providers/ConnectionProvider";
import { useState } from "react";
import { Network } from "./providers/ConnectionProvider/types";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [network, setNetwork] = useState("mainnet");
  return (
    <html lang="en" style={{ fontFamily: "monospace" }}>
      <ConnectionProvider network={network as any}>
        <body>
          <NetworkSelect
            value={network as any}
            onChange={(network) => setNetwork(network)}
          />
          {children}
        </body>
      </ConnectionProvider>
    </html>
  );
}

const NetworkSelect = ({
  value,
  onChange,
}: {
  value: Network;
  onChange: (network: Network) => void;
}) => {
  const { disconnect } = useConnection();
  return (
    <select
      name="network"
      value={value}
      onChange={(e) => {
        disconnect?.();
        onChange(e.target.value as Network);
      }}
    >
      <option value="mainnet">mainnet</option>
      <option value="ghostnet">ghostnet</option>
    </select>
  );
};
