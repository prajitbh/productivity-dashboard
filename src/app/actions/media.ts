"use server";

import { db } from "@/db";
import { mediaEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const TMDB_BASE = "https://api.themoviedb.org/3";

async function tmdbGenreMap(mediaType: "movie" | "tv"): Promise<Record<number, string>> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return {};
  const res = await fetch(`${TMDB_BASE}/genre/${mediaType}/list?api_key=${key}`);
  if (!res.ok) return {};
  const data = await res.json();
  const map: Record<number, string> = {};
  for (const g of data.genres ?? []) map[g.id] = g.name;
  return map;
}

/**
 * Looks up a title on TMDB and returns the best-match poster, release date,
 * and genre names. Returns null fields if TMDB_API_KEY isn't configured —
 * the entry still gets created with no artwork in that case.
 */
async function lookupTmdb(title: string, mediaType: "movie" | "tv") {
  const key = process.env.TMDB_API_KEY;
  if (!key) return { posterUrl: null, releaseDate: null, genres: "", tmdbId: null };

  const endpoint = mediaType === "movie" ? "search/movie" : "search/tv";
  const res = await fetch(`${TMDB_BASE}/${endpoint}?api_key=${key}&query=${encodeURIComponent(title)}`);
  if (!res.ok) return { posterUrl: null, releaseDate: null, genres: "", tmdbId: null };

  const data = await res.json();
  const top = data.results?.[0];
  if (!top) return { posterUrl: null, releaseDate: null, genres: "", tmdbId: null };

  const genreMap = await tmdbGenreMap(mediaType);
  const genreNames = (top.genre_ids ?? []).map((id: number) => genreMap[id]).filter(Boolean);

  return {
    posterUrl: top.poster_path ? `https://image.tmdb.org/t/p/w342${top.poster_path}` : null,
    releaseDate: (top.release_date || top.first_air_date || "").slice(0, 10) || null,
    genres: genreNames.join(", "),
    tmdbId: top.id ?? null,
  };
}

export async function createMediaEntry(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  const mediaType = (String(formData.get("mediaType") || "movie") as "movie" | "show");

  const lookup = await lookupTmdb(title, mediaType === "show" ? "tv" : "movie");

  await db.insert(mediaEntries).values({
    title,
    mediaType,
    posterUrl: lookup.posterUrl,
    releaseDate: lookup.releaseDate,
    genres: lookup.genres,
    tmdbId: lookup.tmdbId,
  });

  revalidatePath("/habits/tv");
}

export async function updateMediaEntry(id: number, formData: FormData) {
  const status = String(formData.get("status") || "want_to_watch");
  const ratingRaw = String(formData.get("rating") || "").trim();
  const notes = String(formData.get("notes") || "").trim() || null;
  const genres = String(formData.get("genres") || "").trim();

  await db
    .update(mediaEntries)
    .set({
      status,
      rating: ratingRaw ? Number(ratingRaw) : null,
      notes,
      genres,
      updatedAt: new Date(),
    })
    .where(eq(mediaEntries.id, id));

  revalidatePath("/habits/tv");
}

export async function deleteMediaEntry(id: number) {
  await db.delete(mediaEntries).where(eq(mediaEntries.id, id));
  revalidatePath("/habits/tv");
}
