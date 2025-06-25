-- CreateTable
CREATE TABLE "cassettes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "series" TEXT,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "weight" INTEGER,
    "bikeType" TEXT NOT NULL,
    "msrp" INTEGER,
    "imageUrl" TEXT,
    "speeds" INTEGER NOT NULL,
    "cogs" TEXT NOT NULL,
    "freehubStandard" TEXT NOT NULL,
    "chainCompatibility" TEXT NOT NULL,
    "cogMaterial" TEXT,
    "spiderMaterial" TEXT,
    "spacing" REAL
);

-- CreateTable
CREATE TABLE "chains" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "series" TEXT,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "weight" INTEGER,
    "bikeType" TEXT NOT NULL,
    "msrp" INTEGER,
    "imageUrl" TEXT,
    "speeds" INTEGER NOT NULL,
    "chainStandard" TEXT NOT NULL,
    "links" INTEGER,
    "masterLink" TEXT,
    "innerWidth" REAL,
    "outerWidth" REAL,
    "coating" TEXT
);

-- CreateTable
CREATE TABLE "rear_derailleurs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "series" TEXT,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "weight" INTEGER,
    "bikeType" TEXT NOT NULL,
    "msrp" INTEGER,
    "imageUrl" TEXT,
    "speeds" INTEGER NOT NULL,
    "cageLength" TEXT NOT NULL,
    "maxCogSize" INTEGER NOT NULL,
    "minCogSize" INTEGER,
    "totalCapacity" INTEGER,
    "shiftingStandard" TEXT NOT NULL,
    "pullRatio" TEXT,
    "jockeyWheelSize" INTEGER,
    "clutch" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "cranksets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "series" TEXT,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "weight" INTEGER,
    "bikeType" TEXT NOT NULL,
    "msrp" INTEGER,
    "imageUrl" TEXT,
    "chainrings" TEXT NOT NULL,
    "bbStandard" TEXT NOT NULL,
    "crankLength" INTEGER NOT NULL,
    "chainline" REAL,
    "qFactor" REAL,
    "bcd" TEXT
);

-- CreateTable
CREATE TABLE "builds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT,
    "bikeType" TEXT NOT NULL,
    "cassetteId" TEXT,
    "chainId" TEXT,
    "rearDerailleurId" TEXT,
    "cranksetId" TEXT,
    "compatibilityScore" INTEGER,
    "gearRatioMin" REAL,
    "gearRatioMax" REAL,
    "gearRatioRange" REAL,
    CONSTRAINT "builds_cassetteId_fkey" FOREIGN KEY ("cassetteId") REFERENCES "cassettes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "builds_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "chains" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "builds_rearDerailleurId_fkey" FOREIGN KEY ("rearDerailleurId") REFERENCES "rear_derailleurs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "builds_cranksetId_fkey" FOREIGN KEY ("cranksetId") REFERENCES "cranksets" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "compatibility_checks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cassetteId" TEXT,
    "chainId" TEXT,
    "rearDerailleurId" TEXT,
    "cranksetId" TEXT,
    "isCompatible" BOOLEAN NOT NULL,
    "warnings" TEXT,
    "issues" TEXT,
    CONSTRAINT "compatibility_checks_cassetteId_fkey" FOREIGN KEY ("cassetteId") REFERENCES "cassettes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "compatibility_checks_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "chains" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "compatibility_checks_rearDerailleurId_fkey" FOREIGN KEY ("rearDerailleurId") REFERENCES "rear_derailleurs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "compatibility_checks_cranksetId_fkey" FOREIGN KEY ("cranksetId") REFERENCES "cranksets" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
