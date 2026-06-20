import { db } from "@/db";
import { mediaEntries } from "@/db/schema";
import { desc } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import SubTabs from "@/components/SubTabs";
import TabNote from "@/components/TabNote";
import { getTabNote } from "@/app/actions/notes";
import MediaSection from "@/components/MediaSection";

export const dynamic = "force-dynamic";

const SUBTABS = [
  { href: "/habits/reading", label: "Reading" },
  { href: "/habits/tv", label: "TV" },
  { href: "/habits/journaling", label: "Journaling" },
];

export default async function TvPage() {
  const [allMedia, tabNote] = await Promise.all([
    db.select().from(mediaEntries).orderBy(desc(mediaEntries.createdAt)),
    getTabNote("habits-tv"),
  ]);

  const movies = allMedia.filter((m) => m.mediaType === "movie");
  const shows = allMedia.filter((m) => m.mediaType === "show");
  const tmdbConfigured = !!process.env.TMDB_API_KEY;

  return (
    <div>
      <PageHeader entry="07" title="Habits" subtitle="TV — movies and shows, posters included." />
      <SubTabs tabs={SUBTABS} />
      <TabNote tabKey="habits-tv" initialHtml={tabNote?.contentHtml ?? ""} />
      <div className="px-6 sm:px-10 py-8 max-w-3xl space-y-8">
        {!tmdbConfigured && (
          <p className="text-xs font-mono text-amber bg-amber-soft/40 border border-amber/30 rounded-md px-3 py-2">
            No TMDB_API_KEY set yet — entries will save with title only, no poster, until you add one
            (see README).
          </p>
        )}
        <MediaSection title="Movies" mediaType="movie" items={movies} />
        <MediaSection title="Shows" mediaType="show" items={shows} />
      </div>
    </div>
  );
}
