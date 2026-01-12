import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="inline-block group">
      <div className="relative">
        <Image
          src="/deluzex-logo.jpeg"
          alt="de luzex logo"
          width={120}
          height={40}
          className="h-8 sm:h-10 w-auto object-contain"
          priority
        />
      </div>
    </Link>
  );
}
