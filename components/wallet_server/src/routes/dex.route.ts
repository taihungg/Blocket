import express from 'express';
import { DexObjectModel } from '../models';
const router = express.Router();

router.post('/get_all_user_dex', async (req, res) => {
    const owner = req.body.owner;
    try {
        const userDexObjects = await DexObjectModel.find({
            owner,
        });
        console.log(userDexObjects)
        res.status(200).json(userDexObjects)
    } catch (error) {
        res.status(500).send(`Error while get all user dex object: ${error}`)
    }

})
router.post('/add_user_dex', (req, res) => {
    const owner: string = req.body.owner;
    const dex_id: string = req.body.dex_id;
    const newDexObjectModel = new DexObjectModel({
        owner,
        dex_id
    });
    newDexObjectModel.save()
        .then(() => res.status(201).send('DEX created successfully'))
        .catch((err) => res.status(500).send(`Error creating DEX: ${err.message}`));
})

router.post('/delete_user_dex', async (req, res) => {
    const dex_id = req.body.dex_id;
    try {
        await DexObjectModel.findOneAndDelete({
            dex_id,
        });
        res.status(200).send('your dex has been deleted');
    } catch (error) {
        res.status(400).send('got error while delete DEX - Check your request');
    }

})

export default router;