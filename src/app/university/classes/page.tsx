import { db } from "@/db";
import { classes } from "@/db/schema";
import { desc } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import SubTabs from "@/components/SubTabs";
import TabNote from "@/components/TabNote";
import { getTabNote } from "@/app/actions/notes";
import { ClassForm, ClassCard } from "@/components/ClassPieces";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const [allClasses, tabNote] = await Promise.all([
    db.select().from(classes).orderBy(desc(classes.createdAt)),
    getTabNote("university"),
  ]);

  return (
    <div>
      <PageHeader entry="05" title="University" subtitle="Classes and clubs, one ledger entry each." />
      <SubTabs
        tabs={[
          { href: "/university/classes", label: "Classes" },
          { href: "/university/clubs", label: "Clubs" },
        ]}
      />
      <TabNote tabKey="university" initialHtml={tabNote?.contentHtml ?? ""} />
      <div className="px-6 sm:px-10 py-8 max-w-2xl space-y-4">
        <ClassForm />
        {allClasses.length === 0 ? (
          <p className="text-sm text-ink-faint">No classes added yet.</p>
        ) : (
          <div className="space-y-3">
            {allClasses.map((c) => (
              <ClassCard key={c.id} item={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
