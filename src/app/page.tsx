import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SCREENS = [
  { href: "/conversation", title: "Conversation", description: "Fil de conversation agent — thinking process, artefacts, question inline." },
  { href: "/delegation", title: "Delegation & Tasks", description: "Déléguer une tâche et suivre les tâches planifiées." },
  { href: "/audit", title: "Audit & History", description: "Historique des actions agent/utilisateur, avec les erreurs mises en avant." },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-24">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium tracking-wide text-muted-foreground">
          AGENT UX DESIGN SYSTEM — PREVIEW
        </span>
        <h1 className="text-4xl font-bold tracking-tight">Douglas</h1>
        <p className="text-lg text-muted-foreground">
          Placeholder de test — pas encore l&apos;écran d&apos;accueil final de Douglas. Toggle le
          panneau de thème en bas à droite pour changer de couleur de base shadcn.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {SCREENS.map((screen) => (
          <Link key={screen.href} href={screen.href}>
            <Card className="transition-colors hover:bg-accent/50">
              <CardHeader>
                <CardTitle>{screen.title}</CardTitle>
                <CardDescription>{screen.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approve export to CRM</CardTitle>
          <CardDescription>The agent wants to sync 340 contacts to Salesforce.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Badge>Confidence: High</Badge>
          <div className="flex gap-2">
            <Button variant="outline">Reject</Button>
            <Button>Approve</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
