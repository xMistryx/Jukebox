import db from "#db/client";
import { faker } from "@faker-js/faker";

async function seed() {
  // TODO
  const playlistsArr = [];
  const tracksArr = [];
  for (let i = 0; i < 10; i++) {
    const name = faker.color.human();
    const description = faker.lorem.paragraph({ min: 1, max: 3 });
    const playlistsSQL = `
      INSERT INTO playlists (name, description)
      VALUES($1, $2)
      RETURNING *
    `;
    const {rows} = await db.query(playlistsSQL, [name, description]);
    playlistsArr.push(rows[0]);
  }
  for (let j = 0; j < 20; j++) {
    const name = faker.music.album();
    const duration_ms = faker.number.int({min: 30, max: 50});
    const tracksSQL = `
      INSERT INTO tracks (name, duration_ms)
      VALUES($1, $2)
      RETURNING *
    `;
    const {rows} = await db.query(tracksSQL, [name, duration_ms]);
    tracksArr.push(rows[0]);
  }
  for (let k = 0; k < 15; k++) {
    const playlist = playlistsArr[Math.floor(Math.random() * playlistsArr.length)];
    const track = tracksArr[Math.floor(Math.random() * tracksArr.length)];
    const playlists_tracksSQL = `
      INSERT INTO playlists_tracks (playlist_id, track_id)
      VALUES($1, $2)
      RETURNING *
    `;
    await db.query(playlists_tracksSQL, [playlist.id, track.id])
  }
}

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");
