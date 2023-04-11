import { ConnectButton } from "web3uikit"

export default function Header() {
    // queste 9 righe fanno esattamente quello fatto nel metodo raw sotto
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-bold text-8xl">La lotteria del ludopatico</h1>

            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}

//--------------------------metodo raw
// import { useMoralis } from "react-moralis"
// import { useEffect } from "react"

// export default function Header() {
//     const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
//         useMoralis() // hook: la pagina web cambia quando succedono cose. enableWeb3 serve a connetterti a metamask (solo metamask)

//     useEffect(() => {
//         if (isWeb3Enabled) return
//         if (typeof window !== "undefined") {
//             if (window.localStorage.getItem("connected")) {
//                 enableWeb3()
//             }
//         }
//         // enableWeb3()
//     }, [isWeb3Enabled]) // se cambia solo il contenuto nelle parentesi, re-rendera
//     // se non si mettono le quadre: re-render quando succede qualsiasi cosa

//     useEffect(() => {
//         Moralis.onAccountChanged((account) => {
//             console.log(`Account changed to ${account}`)
//             if (account == null) {
//                 window.localStorage.removeItem("connected")
//                 deactivateWeb3()
//                 console.log("Null account found")
//             }
//         })
//     }, [])

//     return (
//         <div>
//             {account ? (
//                 <div>
//                     Connected to {account.slice(0, 6)}...
//                     {account.slice(account.length - 4)}
//                 </div>
//             ) : (
//                 <button
//                     onClick={async () => {
//                         await enableWeb3()
//                         if (typeof window !== "undefined") {
//                             window.localStorage.setItem("connected", "injected")
//                         }
//                     }}
//                     disabled={isWeb3EnableLoading}
//                 >
//                     Connect
//                 </button>
//             )}
//         </div>
//     )
// }

//------------------------------ copia originale
// import { ConnectButton } from "web3uikit"

// export default function Header() {
//     return (
//         <nav className="p-5 border-b-2 flex flex-row">
//             <h1 className="py-4 px-4 font-bold text-3xl"> Decentralized Lottery</h1>
//             <div className="ml-auto py-2 px-4">
//                 <ConnectButton moralisAuth={false}/>
//             </div>
//         </nav>
//     )
// }
