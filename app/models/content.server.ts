// Internals
import { prisma } from "~/utils/db.server";
import { getQueue } from "~/utils/p-queue.server";

export async function getMdxCount(contentDirectory: string) {
  const count = await prisma.content.aggregate({
    _count: {
      _all: true,
    },
    where: { contentDirectory, published: true },
  });

  return count._count._all;
}

export async function requiresUpdate(contentDirectory: string) {
  const requiresUpdateCount = await prisma.content.aggregate({
    _count: { requiresUpdate: true },
    where: { contentDirectory, published: true },
  });

  if (requiresUpdateCount._count.requiresUpdate === 0) {
    return null;
  }

  const requiresUpdate = await prisma.content.findMany({
    where: { requiresUpdate: true },
  });

  return requiresUpdate;
}

export async function getContentList(contentDirectory = "blog/en") {
  const contents = await prisma.content.findMany({
    orderBy: { timestamp: "desc" },
    select: {
      frontmatter: true,
      slug: true,
      timestamp: true,
      title: true,
    },
    where: { contentDirectory, published: true },
  });

  return contents;
}

export async function getContent(slug: string) {
  const rows = await prisma.content.findMany({
    select: {
      code: true,
      contentDirectory: true,
      frontmatter: true,
      requiresUpdate: true,
      slug: true,
      timestamp: true,
      title: true,
      views: true,
    },
    where: { slug, published: true },
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  if (rows.length > 1) {
    throw new Error(`Something is very wrong for the slug ${slug}`);
  }

  const content = rows[0];

  return {
    ...content,
    frontmatter: JSON.parse(content.frontmatter) as Record<string, unknown>,
  };
}

async function setRequiresUpdateImpl({ slug, contentDirectory }: { slug: string; contentDirectory: string }) {
  await prisma.content.upsert({
    create: {
      code: "",
      contentDirectory,
      frontmatter: "",
      published: true,
      requiresUpdate: true,
      slug,
      title: "",
    },
    update: {
      requiresUpdate: true,
    },
    where: { slug },
  });
}

export async function setRequiresUpdate(...params: Parameters<typeof setRequiresUpdateImpl>) {
  const queue = await getQueue();
  const result = await queue.add(() => setRequiresUpdateImpl(...params));

  return result;
}

async function upsertContentImpl({
  code,
  contentDirectory,
  frontmatter,
  published,
  slug,
  timestamp,
  title,
}: {
  code: string;
  contentDirectory: string;
  frontmatter: Record<string, unknown>;
  published: boolean;
  slug: string;
  timestamp: Date;
  title: string;
}) {
  await prisma.content.upsert({
    where: { slug },
    update: {
      code,
      frontmatter: JSON.stringify(frontmatter),
      published,
      requiresUpdate: false,
      title,
    },
    create: {
      code,
      contentDirectory,
      frontmatter: JSON.stringify(frontmatter),
      published,
      slug,
      timestamp,
      title,
    },
  });
}

export async function deleteSlug(slug: string) {
  return prisma.content.delete({ where: { slug } });
}

export async function refreshAllContent() {
  return prisma.content.updateMany({ data: { requiresUpdate: true } });
}

export async function upsertContent(...params: Parameters<typeof upsertContentImpl>) {
  const queue = await getQueue();
  const result = await queue.add(() => upsertContentImpl(...params));

  return result;
}

export async function deleteContent(slug: string) {
  const queue = await getQueue();
  const result = await queue.add(() => deleteSlug(slug));

  return result;
}

export async function upsertViews(slug: string) {
  const queue = await getQueue();
  const result = await queue.add(() => prisma.content.update({ where: { slug }, data: { views: { increment: 1 } } }));

  return result.views ?? 0;
}
