import express from "express";
import {getPlaylists, getPlaylist, createPlaylist} from "#db/queries/playlists";
import {getTrackByPlaylistId} from "#db/queries/tracks";
import {createPlaylistTrack} from "#db/queries/playlists_tracks";

const router = express.Router();

router
.route("/")
.get(async (req, res) => {
    const playlists = await getPlaylists();
    res.send(playlists);
})
.post(async (req, res) => {
    if (!req.body) {
        return res.status(400).send({message: "missing body"});
    }
    const {name, description} = req.body;
    if (!name || !description) {
        return res.status(400).send({message: "missing name and/or description"})
    }
    const playlist = await createPlaylist(name, description);
    return res.status(201).send(playlist);
});

router
.param("id", async (req, res, next, id) => {
    if (isNaN(id)) {
        return res.status(400).send({message: "id is not a number"});
    }
    const playlist = await getPlaylist(id);
    if (!playlist) {
        return res.status(404).send({message: "playlist not found"});
    }
    req.playlist = playlist;
    next();
});

router
.route("/:id")
.get(async (req, res) => {
    res.send(req.playlist);
});

router
.route("/:id/tracks")
.get(async (req, res) => {
    const tracks = await getTrackByPlaylistId(req.playlist.id);
    res.send(tracks); 
})
.post(async (req, res) => {
    if (!req.body) {
        return res.status(400).send({message: "missing body"});
    }
    const {track_id} = req.body;
    if (!track_id) {
        return res.status(400).send({message: "missing track_id"})
    }
    const playlistTrack = await createPlaylistTrack(req.playlist.id, track_id);
    return res.status(201).send(playlistTrack);
});


export default router;