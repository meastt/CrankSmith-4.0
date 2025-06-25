# CrankSmith-4.0
# CrankSmith 4.0

> Never buy incompatible bike parts again.

The most comprehensive cycling component compatibility platform ever built. Check compatibility, analyze gear ratios, and build the perfect drivetrain with our database of 10,000+ verified components.

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/meastt/CrankSmith-4.0.git
cd CrankSmith-4.0
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma db push

# Seed with sample data
node scripts/setup.js
```

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see CrankSmith 4.0 in action!

## 🛠 Tech Stack

- **Framework**: Next.js 14 + TypeScript
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📊 Database Schema

### Core Components
- **Cassettes**: 12-speed MTB focus, freehub compatibility tracking
- **Chains**: HG, HG+, Eagle, Flat Top standards
- **Rear Derailleurs**: Cage length, capacity, shifting standards
- **Cranksets**: BB standards, chainline, BCD specs

### Smart Features
- **Real Compatibility Engine**: Catches issues like SRAM Eagle PG-1230 needing XD driver
- **Gear Ratio Analysis**: Performance optimization and gap analysis
- **Build Tracking**: Save and compare complete drivetrains

## 🎯 Current Status

### ✅ Phase 1 Complete
- [x] Project structure and TypeScript setup
- [x] Database schema with Prisma
- [x] Compatibility engine foundation
- [x] Component type definitions
- [x] Sample data and setup scripts

### 🚧 Next Steps
- [ ] Quick Compatibility Check tool
- [ ] Component search and filtering
- [ ] Build creation wizard
- [ ] Advanced gear analysis
- [ ] API endpoints

## 🧪 Sample Data

The setup script includes real components for testing:

**MTB 12-Speed Focus:**
- SRAM GX Eagle PG-1230 (XD freehub)
- Shimano XT CS-M8100 (Microspline)
- SRAM NX Eagle PG-1230 (HG freehub) 
- Compatible chains and derailleurs

**Test Scenarios:**
- ✅ SRAM GX Eagle complete groupset
- ✅ Shimano XT complete groupset  
- ❌ SRAM Eagle cassette + Shimano derailleur (incompatible)
- ⚠️ SRAM NX Eagle cassette + GX chain (works but suboptimal)

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
├── lib/                # Core utilities
│   ├── db.ts          # Database client
│   └── compatibility.ts # Compatibility engine
└── types/              # TypeScript definitions
    └── components.ts   # Component interfaces

prisma/
├── schema.prisma       # Database schema
└── dev.db             # SQLite database (created after setup)

scripts/
└── setup.js           # Database seeding script
```

## 🎨 Design System

**Brand Colors:**
- Primary Blue: `#2563eb` (CrankSmith brand)
- Tool Orange: `#f97316` (Mechanical accent)
- Success Green: `#22c55e` (Compatible)
- Error Red: `#ef4444` (Incompatible)

**Typography:** Inter font family for clean, modern readability

## 🔄 Development Workflow

1. **Database Changes**: Update `prisma/schema.prisma` → `npx prisma db push`
2. **Type Updates**: Modify `src/types/components.ts` to match schema
3. **Feature Development**: Build in `src/app/` with TypeScript
4. **Testing**: Use sample data for compatibility scenarios

## 📈 Roadmap

### Phase 2: Core Features (Next 2 weeks)
- Quick compatibility check tool
- Component database search
- Basic gear ratio analysis

### Phase 3: Advanced Features (Month 2)
- Build creation wizard
- Performance optimization
- Mobile-responsive design

### Phase 4: Data Expansion (Month 3)
- Road and gravel components
- Historical component database
- Community contributions

---

**Built for cyclists, by cyclists** 🚴‍♂️
