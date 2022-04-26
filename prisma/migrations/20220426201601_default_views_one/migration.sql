-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentDirectory" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "frontmatter" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "published" BOOLEAN NOT NULL,
    "requiresUpdate" BOOLEAN DEFAULT false,
    "views" INTEGER DEFAULT 1
);
INSERT INTO "new_Content" ("code", "contentDirectory", "frontmatter", "id", "published", "requiresUpdate", "slug", "timestamp", "title", "updatedAt", "views") SELECT "code", "contentDirectory", "frontmatter", "id", "published", "requiresUpdate", "slug", "timestamp", "title", "updatedAt", "views" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
