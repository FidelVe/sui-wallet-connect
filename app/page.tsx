"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  getWallets,
  ReadonlyWalletAccount,
  type Wallet,
} from "@mysten/wallet-standard";

function findHanaWallet(wallets: readonly Wallet[]) {
  return (wallets.find((aWallet) => aWallet.name.includes("Hana Wallet")) ||
    null) as Wallet | null;
}
function App() {
  const [suiWallet, setSuiWallet] = useState<Wallet | null>(null);
  const [accounts, setAccounts] = useState<ReadonlyWalletAccount[]>([]);
  const [signature, setSignature] = useState<any | null>(null);

  async function onButton1Click() {
    try {
      console.log("onButton1Click");
      if (!suiWallet) {
        console.log("No wallet found");
        return;
      }

      const foo = await suiWallet.features["standard:connect"].connect();
      setAccounts(foo.accounts);
    } catch (err) {
      console.log("Error clicking button 1");
      console.log(err);
    }
  }

  async function onButton2Click() {
    try {
      console.log("onButton2Click");
      if (!suiWallet) {
        console.log("No wallet found");
        return;
      }

      const bar = new TextEncoder().encode("Hello, World!");
      const signature1 = await suiWallet.features[
        "sui:signPersonalMessage"
      ]?.signPersonalMessage({
        account: accounts[0],
        message: bar,
      });

      console.log("Signature");
      console.log(signature1);
      setSignature(signature1);
    } catch (err) {
      console.log("Error clicking button 2");
      console.log(err);
    }
  }

  useEffect(() => {
    const walletsApi = getWallets();
    function updateWallets() {
      setSuiWallet(findHanaWallet(walletsApi.get()));
    }
    const unregister1 = walletsApi.on("register", updateWallets);
    const unregister2 = walletsApi.on("unregister", updateWallets);

    updateWallets();
    return () => {
      unregister1();
      unregister2();
    };
  }, []);
  useEffect(() => {
    if (suiWallet) {
      setAccounts(suiWallet.accounts);
    }
  }, [suiWallet]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <p>Click Button1 to connect, then click Button2 to sign a message</p>
          <button
            onClick={onButton1Click}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Button 1
          </button>
          <button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={onButton2Click}
          >
            Button 2
          </button>
        </div>
        {suiWallet ? (
          <aside className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm">Wallet Name</div>
              <div className="text-lg">{suiWallet.name}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm">Accounts</div>
              <div className="flex flex-col gap-2">
                {accounts.map((account) => (
                  <div
                    key={account.address}
                    className="text-lg break-all whitespace-normal"
                  >
                    {account.address}
                  </div>
                ))}
              </div>
              <div className="text-sm">Signature</div>
              {signature == null ? (
                <div>No signature</div>
              ) : (
                <div>{JSON.stringify(signature)}</div>
              )}
            </div>
          </aside>
        ) : (
          <div className="text-lg">No wallet found</div>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

export default function Home() {
  return <App />;
}
