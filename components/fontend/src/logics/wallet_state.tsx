import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { ObjectCache } from "@mysten/sui/transactions";


function WalletState() {
    const client = useSuiClient();
    const res = useSuiClientQuery('getOwnedObjects', {
        owner: "0xf2b8341fc93d683292ba428dccf83ba443c15ee19b9f0719bdd0a7f75218c926",
        options: {
            showType: true
        }
    });
    console.log(res);
    return (
        <>
           {res.data?.data.filter(obj => {
            if (obj.data && obj.data.type) {
                obj.data.type = '0x2::sui::SUI';
            }
           })}  
        </>
    );
}

export default WalletState;