import { Button } from "@/components/ui/button";
import { Brain, BrainCircuit, BrainCircuitIcon } from "lucide-react";
import { socialAuth } from "@/utils/actions"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* <header className="border-b border-b-foreground/10 h-16">
        <div className="flex items-center w-4/5 mx-auto h-full space-x-1">

          <h1 className="flex items-center font-bold text-2xl">brAInstor<BrainCircuit size={22} /></h1>
        </div>
      </header> */}
      <main className="flex-1 flex justify-center items-center w-4/5 mx-auto">
        <Card className="flex flex-col justify-between border-none p-4 h-[calc(40%)]">
          <CardHeader className="flex flex-col gap-1 mb-8">
            <CardTitle className="flex flex-row items-center gap-1 text-6xl">
              <span>brainst</span>
              <span className="-ml-0.5 -mr-1.5 mb-1"><Brain size={54} className="animate-pulse" /></span>
              <span>re</span>
            </CardTitle>
            <CardDescription className="text-base">dokumentum alapú tudástár</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={socialAuth} className="text-md">belépés Google-fiókkal</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
