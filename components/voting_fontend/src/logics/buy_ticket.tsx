import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

const package_id = "0x25fc9842c73938a49dc3add1e9eb76e57e37a495ea1de445be3ef41343b1afa8";

interface Props {
    event_name: string;
}

export default function Buy_ticket_button(props: Props) {
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currAccount = useCurrentAccount();
    const client = useSuiClient();

    const handleBuyTicket = () => {
        const tx = new Transaction();
        tx.setGasBudget(30000000);

        tx.moveCall({
            target: `${package_id}::${props.event_name}::buy_ticket`,
            arguments: [
                tx.object("0x1370c1129f4ba0a2d6f5c0d0191a1db0416c4a4c7b1946bd18dea847588609f2"),
                tx.object("0x9f8851cd17fd68c51f81b9f364172a6ccb475bb2cfb06fa179f7dd92da2a8339"),
            ],
        });

        if (currAccount) {
            signAndExecuteTransaction(
                { transaction: tx, account: currAccount, chain: "sui:devnet" }, // Sửa "sui::devnet" thành "sui:devnet"
                {
                    onSuccess: (data, variables, context) => {
                        console.log("Giao dịch thành công:", data, variables, context);
                        alert("Mua vé thành công!");
                    },
                    onError: (e) => {
                        console.log("Lỗi:", e);
                        alert("Đã có lỗi xảy ra khi mua vé.");
                    },
                }
            );
        } else {
            alert("Vui lòng kết nối ví Sui trước!");
        }
    };

    return (
        <button onClick={handleBuyTicket} disabled={!currAccount}>
            Buy Ticket
        </button>
    );
}
