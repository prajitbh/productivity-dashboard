import { db } from "@/db";
import { clubs } from "@/db/schema";
import { desc } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import SubTabs from "@/components/SubTabs";
import { ClubForm, ClubCard } from "@/components/ClubPieces";

export const dynamic = "force-dynamic";

export default async function ClubsPage() {
  const allClubs = await db.select().from(clubs).orderBy(desc(clubs.createdAt));

  return (
    <div>
      <PageHeader entry="05" title="University" subtitle="Classes and clubs, one ledger entry each." />
      <SubTabs
        tabs={[
          { href: "/university/classes", label: "Classes" },
          { href: "/university/clubs", label: "Clubs" },
        ]}
      />
      <div className="px-6 sm:px-10 py-8 max-w-2xl space-y-4">
        <ClubForm />
        {allClubs.length === 0 ? (
          <p className="text-sm text-ink-faint">No clubs added yet.</p>
        ) : (
          <div className="space-y-3">
            {allClubs.map((c) => (
              <ClubCard key={c.id} item={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
