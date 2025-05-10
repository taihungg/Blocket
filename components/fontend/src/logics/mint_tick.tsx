import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

const package_id = "0xf213f4285c08f98a0bede9bc4bfb64a0584b978d5a2956a54af14413b2864a59"
const module_name = "tick"
const function_name = "mint_tick"

function MintTickButton() {
    const currAccount = useCurrentAccount();
    const suiclient = useSuiClient();
    const handle_mint_tick = () => {
        if(currAccount){
            const tx = new Transaction();
            tx.moveCall({
                target: `${package_id}::${module_name}::${function_name}`,
                arguments: [
                    
                ]
            })
            
        }
    }
    return ( 
        <button onClick={handle_mint_tick}>
            mint tick
        </button>
     );
}

export default MintTickButton;