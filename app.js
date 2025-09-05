import express from "express";
import playlists from "#api/playlists"
import tracks from "#api/tracks"

const app = express();

app.use(express.json());

app.use("/playlists", playlists);
app.use("/tracks", tracks);

app.use((err, req, res, next) => {
  console.error(err);
  switch (err.code) {
    case "23505":
      return res.status(400).send({message: "there is a duplicate"});
    case "23503":
      return res.status(400).send({message: "foreign key violation"});
    case "23502":
      return res.status(400).send({message: "missing required field"});
    default:
      return res.status(500).send({message: "server error"});
  }
});


export default app;
