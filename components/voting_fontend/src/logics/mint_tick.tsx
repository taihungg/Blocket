import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

const package_id = "0xf213f4285c08f98a0bede9bc4bfb64a0584b978d5a2956a54af14413b2864a59"
const module_name = "tick"
const function_name = "mint_tick"
const cap = "0x156bb1cc388347bfae7560249d3198da9d295b81702949b0ad80c3495722339d"

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