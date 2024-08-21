"use client";
import { useState } from "react";
import { useConnection } from "./providers/ConnectionProvider";

export default function Home() {
  const { address, connect, disconnect, encodeAndRequestSignMessage } =
    useConnection();

  const [signMessageResponse, setSignMessageResponse] = useState<any>();
  return (
    <main>
      <div style={{ maxWidth: "500px" }}>
        <h2>useConnection</h2>
        <div style={{ marginLeft: "20px" }}>
          <div style={{ whiteSpace: "pre", marginBottom: "20px" }}>
            {`const {connect, address, disconnect, encodeAndRequestSignMessage} = useConnection();`}
          </div>
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "rgba(1,1,1,0.1)",
              borderRadius: "8px",
              width: "fit-content",
              padding: "10px",
              margin: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ whiteSpace: "pre" }}>
              address: {address ?? "undefined"}
            </div>
            {address ? (
              <>
                <button onClick={disconnect}>disconnect</button>
                <button
                  onClick={() =>
                    encodeAndRequestSignMessage?.("hello world!").then(
                      setSignMessageResponse
                    )
                  }
                >{`encodeAndRequestSignMessage("hello world!")`}</button>
                {signMessageResponse && (
                  <>
                    response:
                    <pre
                      style={{
                        maxWidth: "100%",
                        overflow: "scroll",
                        marginTop: "-8px",
                      }}
                    >
                      {JSON.stringify(signMessageResponse, null, 2)}
                    </pre>
                  </>
                )}
              </>
            ) : (
              <button onClick={connect}>connect</button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
