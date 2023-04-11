import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit" // abbellire le cose con web3ui (richiamo in _app.js)

// per mettere codice javascript in html bisogna usare le parentesi graffe

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0") // hook, serve a attivare un re-render
    const [numPlayers, setNumPlayers] = useState("0") // hook, serve a attivare un re-render
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        // serve a otternere la funzione enterRaffle dal contratto
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        // serve a ottenere l'entranceFee dal contratto Raffle
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        // serve a ottenere l'ultimo vincitore dal contratto Raffle
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        // serve a ottenere il numero di giocatori dal contratto Raffle
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        // serve a tenere in memoria l'entrancefee, i numPlayers e il recentwinner quando re-rendera
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        // handleSuccess richiamato dalla funzione enterRaffle fatta sotto. questa funzione attiva la funzione sotto che fa cose di abbellimento con web3ui
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI() // quando la tranzazione ha successo, la pagina re-rendera anche l'entrancefee, i numPlayers e il recentwinner contenuti nella funzione updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transazione completata",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        //(ethers.utils.formatUnits(xxxxxx, "ether")) serve a trasformare il numero in eth
        <div className="p-5">
            {raffleAddress ? ( //in caso il contratto esista (quindi solo in hardhat localhost e sepolia), crea bottone con funzione enterRaffle()
                <div>
                    <button
                        className=" bg-blue-500 hover:bg-blue-700 text-white text-6xl font-bold py-10 px-40 rounded"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                            })
                        }}
                        disabled={isLoading || isFetching} // impedisce al bottone di essere premuto quando sta caricando
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-80 w-80 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Partecipa alla lotteria</div>
                        )}
                    </button>
                    <br></br>
                    <p className="italic text-gray-500 text-4xl">
                        Per partecipare sono necessari{" "}
                        {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    </p>
                    <br></br>
                    <p className="italic text-gray-500 text-4xl">Numero giocatori: {numPlayers}</p>
                    <br></br>
                    <p className="italic text-gray-500 text-4xl">
                        Ultimo vincitore: {recentWinner}
                    </p>
                </div>
            ) : (
                <div>Nessun contratto Lotteria trovato</div>
            )}
        </div>
    )
}

//--------------------------------------------------------copia rep
// import { contractAddresses, abi } from "../constants"
// // dont export from moralis when using react
// import { useMoralis, useWeb3Contract } from "react-moralis"
// import { useEffect, useState } from "react"
// import { useNotification } from "web3uikit"
// import { ethers } from "ethers"

// export default function LotteryEntrance() {
//     const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
//     // These get re-rendered every time due to our connect button!
//     const chainId = parseInt(chainIdHex)
//     // console.log(`ChainId is ${chainId}`)
//     const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

//     // State hooks
//     // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
//     const [entranceFee, setEntranceFee] = useState("0")
//     const [numberOfPlayers, setNumberOfPlayers] = useState("0")
//     const [recentWinner, setRecentWinner] = useState("0")

//     const dispatch = useNotification()

//     const {
//         runContractFunction: enterRaffle,
//         data: enterTxResponse,
//         isLoading,
//         isFetching,
//     } = useWeb3Contract({
//         abi: abi,
//         contractAddress: raffleAddress,
//         functionName: "enterRaffle",
//         msgValue: entranceFee,
//         params: {},
//     })

//     /* View Functions */

//     const { runContractFunction: getEntranceFee } = useWeb3Contract({
//         abi: abi,
//         contractAddress: raffleAddress, // specify the networkId
//         functionName: "getEntranceFee",
//         params: {},
//     })

//     const { runContractFunction: getPlayersNumber } = useWeb3Contract({
//         abi: abi,
//         contractAddress: raffleAddress,
//         functionName: "getNumberOfPlayers",
//         params: {},
//     })

//     const { runContractFunction: getRecentWinner } = useWeb3Contract({
//         abi: abi,
//         contractAddress: raffleAddress,
//         functionName: "getRecentWinner",
//         params: {},
//     })

//     async function updateUIValues() {
//         // Another way we could make a contract call:
//         // const options = { abi, contractAddress: raffleAddress }
//         // const fee = await Moralis.executeFunction({
//         //     functionName: "getEntranceFee",
//         //     ...options,
//         // })
//         const entranceFeeFromCall = (await getEntranceFee()).toString()
//         const numPlayersFromCall = (await getPlayersNumber()).toString()
//         const recentWinnerFromCall = await getRecentWinner()
//         setEntranceFee(entranceFeeFromCall)
//         setNumberOfPlayers(numPlayersFromCall)
//         setRecentWinner(recentWinnerFromCall)
//     }

//     useEffect(() => {
//         if (isWeb3Enabled) {
//             updateUIValues()
//         }
//     }, [isWeb3Enabled])
//     // no list means it'll update everytime anything changes or happens
//     // empty list means it'll run once after the initial rendering
//     // and dependencies mean it'll run whenever those things in the list change

//     // An example filter for listening for events, we will learn more on this next Front end lesson
//     // const filter = {
//     //     address: raffleAddress,
//     //     topics: [
//     //         // the name of the event, parnetheses containing the data type of each event, no spaces
//     //         utils.id("RaffleEnter(address)"),
//     //     ],
//     // }

//     const handleNewNotification = () => {
//         dispatch({
//             type: "info",
//             message: "Transaction Complete!",
//             title: "Transaction Notification",
//             position: "topR",
//             icon: "bell",
//         })
//     }

//     const handleSuccess = async (tx) => {
//         try {
//             await tx.wait(1)
//             updateUIValues()
//             handleNewNotification(tx)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     return (
//         <div className="p-5">
//             <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
//             {raffleAddress ? (
//                 <>
//                     <button
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
//                         onClick={async () =>
//                             await enterRaffle({
//                                 // onComplete:
//                                 // onError:
//                                 onSuccess: handleSuccess,
//                                 onError: (error) => console.log(error),
//                             })
//                         }
//                         disabled={isLoading || isFetching}
//                     >
//                         {isLoading || isFetching ? (
//                             <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
//                         ) : (
//                             "Enter Raffle"
//                         )}
//                     </button>
//                     <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
//                     <div>The current number of players is: {numberOfPlayers}</div>
//                     <div>The most previous winner was: {recentWinner}</div>
//                 </>
//             ) : (
//                 <div>Please connect to a supported chain </div>
//             )}
//         </div>
//     )
// }
