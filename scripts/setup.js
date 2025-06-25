const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Setting up CrankSmith 4.0 database...');

  // Sample data for testing
  const sampleCassettes = [
    {
      manufacturer: 'SRAM',
      series: 'GX Eagle',
      model: 'PG-1230',
      year: 2022,
      weight: 461,
      bikeType: 'mtb',
      msrp: 7900, // $79.00
      speeds: 12,
      cogs: '10-12-14-16-18-21-24-28-32-36-42-50',
      freehubStandard: 'SRAM XD',
      chainCompatibility: 'SRAM Eagle'
    },
    {
      manufacturer: 'Shimano',
      series: 'Deore XT',
      model: 'CS-M8100',
      year: 2023,
      weight: 470,
      bikeType: 'mtb',
      msrp: 16500, // $165.00
      speeds: 12,
      cogs: '10-12-14-16-18-21-24-28-33-39-45-51',
      freehubStandard: 'Shimano Microspline',
      chainCompatibility: 'Shimano HG+'
    },
    {
      manufacturer: 'SRAM',
      series: 'NX Eagle',
      model: 'PG-1230',
      year: 2022,
      weight: 615,
      bikeType: 'mtb',
      msrp: 5900, // $59.00
      speeds: 12,
      cogs: '11-13-15-17-19-21-24-28-32-36-42-50',
      freehubStandard: 'Shimano HG',
      chainCompatibility: 'SRAM Eagle'
    }
  ];

  const sampleChains = [
    {
      manufacturer: 'SRAM',
      series: 'GX Eagle',
      model: 'PC-GX Eagle',
      year: 2022,
      weight: 268,
      bikeType: 'mtb',
      msrp: 4900, // $49.00
      speeds: 12,
      chainStandard: 'Eagle',
      links: 126,
      masterLink: 'PowerLock'
    },
    {
      manufacturer: 'Shimano',
      series: 'Deore XT',
      model: 'CN-M8100',
      year: 2023,
      weight: 259,
      bikeType: 'mtb',
      msrp: 6500, // $65.00
      speeds: 12,
      chainStandard: 'HG+',
      links: 126,
      masterLink: 'Quick-Link'
    }
  ];

  const sampleDerailleurs = [
    {
      manufacturer: 'SRAM',
      series: 'GX Eagle',
      model: 'GX Eagle',
      year: 2022,
      weight: 299,
      bikeType: 'mtb',
      msrp: 13900, // $139.00
      speeds: 12,
      cageLength: 'long',
      maxCogSize: 52,
      minCogSize: 10,
      totalCapacity: 42,
      shiftingStandard: 'SRAM',
      pullRatio: '1:1',
      jockeyWheelSize: 12,
      clutch: true
    },
    {
      manufacturer: 'Shimano',
      series: 'Deore XT',
      model: 'RD-M8100',
      year: 2023,
      weight: 284,
      bikeType: 'mtb',
      msrp: 16900, // $169.00
      speeds: 12,
      cageLength: 'long',
      maxCogSize: 51,
      minCogSize: 11,
      totalCapacity: 40,
      shiftingStandard: 'Shimano',
      pullRatio: '1.1:1',
      jockeyWheelSize: 13,
      clutch: true
    }
  ];

  const sampleCranksets = [
    {
      manufacturer: 'SRAM',
      series: 'GX Eagle',
      model: 'GX Eagle DUB',
      year: 2022,
      weight: 665,
      bikeType: 'mtb',
      msrp: 17900, // $179.00
      chainrings: '32',
      bbStandard: 'BSA',
      crankLength: 175,
      chainline: 52,
      qFactor: 164,
      bcd: '104mm'
    },
    {
      manufacturer: 'Shimano',
      series: 'Deore XT',
      model: 'FC-M8100',
      year: 2023,
      weight: 632,
      bikeType: 'mtb',
      msrp: 19900, // $199.00
      chainrings: '32',
      bbStandard: 'BSA',
      crankLength: 175,
      chainline: 52,
      qFactor: 162,
      bcd: '96mm'
    }
  ];

  try {
    // Create sample cassettes
    console.log('📦 Creating sample cassettes...');
    for (const cassette of sampleCassettes) {
      await prisma.cassette.create({ data: cassette });
    }

    // Create sample chains
    console.log('🔗 Creating sample chains...');
    for (const chain of sampleChains) {
      await prisma.chain.create({ data: chain });
    }

    // Create sample derailleurs
    console.log('⚙️ Creating sample derailleurs...');
    for (const derailleur of sampleDerailleurs) {
      await prisma.rearDerailleur.create({ data: derailleur });
    }

    // Create sample cranksets
    console.log('🔄 Creating sample cranksets...');
    for (const crankset of sampleCranksets) {
      await prisma.crankset.create({ data: crankset });
    }

    console.log('✅ Database setup complete!');
    console.log('📊 Sample data:');
    console.log(`   - ${sampleCassettes.length} cassettes`);
    console.log(`   - ${sampleChains.length} chains`);
    console.log(`   - ${sampleDerailleurs.length} derailleurs`);
    console.log(`   - ${sampleCranksets.length} cranksets`);

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });