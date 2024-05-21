"use client";
import { useConnection } from "./providers/ConnectionProvider";

export default function Home() {
  const { connect, address, disconnect } = useConnection();
  return (
    <main>
      <div>
        {address ? (
          <button onClick={disconnect}>Disconnect {address}</button>
        ) : (
          <>
            <button onClick={connect}>Connect</button>
          </>
        )}
      </div>
    </main>
  );
}
