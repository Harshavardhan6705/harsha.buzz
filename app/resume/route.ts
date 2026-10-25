import { framerPageResponse } from "@/lib/framerPage";

export const dynamic = "force-static";

export function GET() {
  return framerPageResponse("resume/index.html");
}
