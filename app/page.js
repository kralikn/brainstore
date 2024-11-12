import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import { socialAuth } from "@/utils/actions"

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-b-foreground/10 h-16">
        <div className="flex items-center w-4/5 mx-auto h-full space-x-1">
          <BrainCircuit />
          <h1 className="font-bold text-2xl">BrainStore</h1>
        </div>
      </header>
      <main className="flex-1 flex justify-center items-center w-4/5 mx-auto">
        <Button onClick={socialAuth}>Belépés Google-fiókkal</Button>
      </main>
    </div>
  );
}
