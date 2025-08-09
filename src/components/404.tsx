import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

export default function PageUnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <Construction className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Page Under Construction</h1>
      <p className="text-gray-500 max-w-md mb-6">
        We’re working hard to bring you something amazing here. Check back soon
        or explore other pages.
      </p>
      <Button variant="outline" className="text-sm rounded">
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  );
}
