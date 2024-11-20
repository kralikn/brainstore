import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";

export default function SignedUrl({ signedUrl }) {

  return (
    <Button asChild>
      <Link href={signedUrl} passHref legacyBehavior>
        <a target="_blank" className="px-4 py-2 rounded border">
          Megtekintés
        </a>
      </Link>
    </Button>
  )
}
