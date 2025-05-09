import mongoose from 'mongoose';

const MONGODB_URI=`mongodb+srv://anhdoo:qbkRWE54bmkOuMY0@cluster0.wn3mscg.mongodb.net/blocket?retryWrites=true&w=majority&appName=Cluster0`;

async function connect(){
    try {
      //  await mongoose.connect('mongodb://localhost:27017/block_ticket')
       await mongoose.connect(MONGODB_URI)
       .then(() => {
        console.log("connect successfully !!") 
       })
    } catch (error) {
       console.log('connect failure: ', error);
    }
}
export default {connect};