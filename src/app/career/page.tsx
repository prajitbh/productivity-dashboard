import { db } from "@/db";
import { contacts } from "@/db/schema";
import { desc } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import TabNote from "@/components/TabNote";
import { getTabNote } from "@/app/actions/notes";
import ContactForm from "@/components/ContactForm";
import ContactsBoard from "@/components/ContactsBoard";

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const [allContacts, tabNote] = await Promise.all([
    db.select().from(contacts).orderBy(desc(contacts.createdAt)),
    getTabNote("career"),
  ]);

  return (
    <div>
      <PageHeader
        entry="04"
        title="Career"
        subtitle="Your professional network, in one place — paste a LinkedIn, add the context."
      />
      <TabNote tabKey="career" initialHtml={tabNote?.contentHtml ?? ""} />
      <div className="px-6 sm:px-10 py-8 max-w-3xl space-y-6">
        <ContactForm />
        <ContactsBoard contacts={allContacts} />
      </div>
    </div>
  );
}
