import db from "#db/client";

export async function getTracks() {
    const sql = `
        SELECT *
        FROM tracks
    `;
    const {rows: tracks} = await db.query(sql);
    return tracks;
}

export async function getTrack(id) {
    const sql = `
        SELECT *
        FROM tracks
        WHERE id = $1
    `;
    const {rows} = await db.query(sql, [id]);
    return rows[0];
}

export async function getTrackByPlaylistId(id) {
    const sql = `
        SELECT DISTINCT tracks.*
        FROM 
            playlists_tracks
            JOIN tracks ON playlists_tracks.track_id = tracks.id
            JOIN playlists ON playlists_tracks.playlist_id = playlists.id
        WHERE playlists.id = $1
    `;
    const {rows: tracks} = await db.query(sql, [id]);
    return tracks;
}

export async function createTrack(name, duration_ms) {
    const sql = `
        INSERT INTO tracks (name, duration_ms)
        VALUES ($1, $2)
        RETURNING *
    `;
    const {rows} = await db.query(sql [name, duration_ms]);
    return rows[0];
}