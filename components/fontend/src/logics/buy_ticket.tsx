import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import styles from "./buy_ticket.module.scss";
import classNames from "classnames/bind";
import axios from 'axios';

const cx = classNames.bind(styles);

// const packageId = "0xecc735d2613a74d2314a0797585beff45df7c3ddb626323b167fc03d994d38e7";
// const workshop_id = "0x8a222a6f157cc438355afe0285c1149a32d0763b331252632cd73e8d381a7e21";

interface Props {
    workshop_id:string,
}

export default function BuyTicketButton(props: Props) {
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currAccount = useCurrentAccount();
    const client = useSuiClient();
    const [tokenId, setTokenId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [packageId, setPackageId] = useState('');
    const workshop_id = props.workshop_id;

    useEffect(() => {
        let pack='';
        const get_package_id = async () => {
            const data_res = await axios.get('http://localhost:3000/get_package_id');
            if (data_res.status === 200) {
                setPackageId(data_res.data.package_id)
                pack=data_res.data.package_id;
            }
        }
        get_package_id();
        const fetchUserObject = async () => {
            if (!currAccount) return;
            try {
                const ownedObjects = await client.getOwnedObjects({
                    owner: currAccount.address,
                    options: { showType: true, showContent: true },
                });

                const userObject = ownedObjects.data.find(
                    (obj) => obj.data?.type === `0x2::coin::Coin<${pack}::tick::TICK>`
                );

                if (userObject && userObject.data?.objectId) {
                    setTokenId(userObject.data.objectId);
                } else {
                    console.log(pack)
                    console.error("Address doesn't have any TICK token. Mint first!");
                    alert("Please mint TICK token first!");
                }
            } catch (error) {
                console.error("Error fetching TICK token:", error);
                alert("Error fetching TICK token. Please try again.");
            }
        };
        fetchUserObject();
    }, [currAccount, client]);

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