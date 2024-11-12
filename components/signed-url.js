import { buttonVariants } from "./ui/button";
import Link from "next/link";

export default function SignedUrl({ signedUrl }) {

  return (

    <Link href={signedUrl} className={buttonVariants({ variant: "default" })} passHref legacyBehavior>
      <a target="_blank" className="pr-6 py-2 rounded">
        Megtekintés
      </a>
    </Link>
  )
}
