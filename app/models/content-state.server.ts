// Internals
import { prisma } from "~/utils/db.server";

export async function getContentState() {
  return prisma.contentState.findUnique({
    select: {
      sha: true,
      timestamp: true,
    },
    where: { key: "content" },
  });
}

export async function setContentSHA(sha: string) {
  return prisma.contentState.upsert({
    create: { sha, key: "content" },
    update: { sha },
    where: { key: "content" },
  });
}
