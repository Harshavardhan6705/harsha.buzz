import { framerPageResponse } from "@/lib/framerPage";

export const dynamic = "force-static";

export function GET() {
  return framerPageResponse("textile/index.html");
}
