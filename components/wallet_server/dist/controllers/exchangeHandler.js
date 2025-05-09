"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEscrowObjects = handleEscrowObjects;
exports.handleLockObjects = handleLockObjects;
function handleEscrowObjects(event, type) {
}
function handleLockObjects(event, type) {
    //xoá ở own 1 object
    //thêm một lock object
    //đẩy về address (public) về đối tượng trao đổi
    event.forEach(e => {
        console.log(`package id ${e.packageId} has object ${e.parsedJson}`);
    });
}
