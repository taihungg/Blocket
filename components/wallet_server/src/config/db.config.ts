import mongoose from 'mongoose';
async function connect(){
    try {
       await mongoose.connect('mongodb://localhost:27017/block_ticket')
       .then(() => {
        console.log("connect successfully !!") 
       })
    } catch (error) {
       console.log('connect failure: ', error);
    }
}
export default {connect};