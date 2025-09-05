import express from "express";
import {getTracks, getTrack} from "#db/queries/tracks";

const router = express.Router();

router
.route("/")
.get(async (req, res) => {
    const tracks = await getTracks();
    res.send(tracks);
});

router
.route("/:id")
.get(async (req, res) => {
    try {
        const {id} = req.params;
        const track = await getTrack(id);
        if (!track) {
        return res.status(404).send("track not found");
    }
        return res.send(track);
    } catch (error) {
        return res.status(400).send(error.message);
    }
})

export default router;