import { SuiEvent } from "@mysten/sui/dist/cjs/client";

export function handleEscrowObjects(event: SuiEvent[], type: string){

}
export function handleLockObjects(event: SuiEvent[], type: string){
    //xoá ở own 1 object
    //thêm một lock object
    //đẩy về address (public) về đối tượng trao đổi
    event.forEach(e => {
        console.log(`package id ${e.packageId} has object ${e.parsedJson}`);
    });
}
