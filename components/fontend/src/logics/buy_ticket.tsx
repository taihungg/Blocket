import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import styles from "./buy_ticket.module.scss";
import classNames from "classnames/bind";
import { PACKAGE_ID} from "../App";

const cx = classNames.bind(styles);
interface Props {
    workshop_id: string,
}
const packageId = PACKAGE_ID;
export default function BuyTicketButton(props: Props) {
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currAccount = useCurrentAccount();
    const client = useSuiClient();
    const [tokenId, setTokenId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // const [packageId, setPackageId] = useState('');
    const workshop_id = props.workshop_id;

    // useEffect(() => {
    //     const get_package_id = async () => {
    //         const data_res = await axios.get('http://localhost:3000/get_package_id');
    //         if (data_res.status === 200) {
    //             setPackageId(data_res.data.package_id)
    //         }
    //     }
    //     get_package_id();
    // }, []);
    useEffect(() => {
        const fetchUserObject = async () => {
            if (!currAccount) return;
            try {
                const ownedObjects = await client.getOwnedObjects({
                    owner: currAccount.address,
                    options: { showType: true, showContent: true },
                });

                const userObject = ownedObjects.data.find(
                    (obj) => obj.data?.type === `0x2::coin::Coin<${packageId}::tick::TICK>`
                );
                if (userObject && userObject.data?.objectId) {
                    setTokenId(userObject.data.objectId);
                } else {
                    console.error("Address doesn't have any TICK token. Mint first!");
                    alert("Please mint TICK token first!");
                }
            } catch (error) {
                console.error("Error fetching TICK token:", error);
                alert("Error fetching TICK token. Please try again.");
            }
        };
        fetchUserObject();
    }, [currAccount, client])

    const handleBuyTicket = async () => {
        if (!currAccount) {
            alert("Vui lòng kết nối ví Sui trước!");
            return;
        }

        if (!tokenId) {
            alert("Vui lòng mint token TICK trước!");
            return;
        }

        setIsLoading(true);
        try {
            const tx = new Transaction();
            tx.setGasBudget(30000000);

            tx.moveCall({
                target: `${packageId}::workshop::buy_ticket`,
                arguments: [
                    tx.object(tokenId),
                    tx.object(workshop_id),
                ],
            });
            signAndExecuteTransaction({
                transaction: tx,
                account: currAccount,
                chain: 'sui:testnet'
            }, {
                onSuccess: (result) => {
                    console.log("Transaction successful:", result);
                },
                onError: (error) => {
                    console.error("Transaction failed:", error);
                },
            })
        } catch (error) {
            console.error("Error during transaction:", error);
            alert(`Đã có lỗi xảy ra khi mua vé: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cx("wrapper")}>
            <button
                className={cx("buy-ticket")}
                onClick={handleBuyTicket}
                disabled={!currAccount || !tokenId || isLoading}
            >
                {isLoading ? "Processing..." : "Buy Ticket"}
            </button>
        </div>
    );
}