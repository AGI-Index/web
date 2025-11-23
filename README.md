# AGI Index

**A community-driven platform to define, track, and measure the arrival of Artificial General Intelligence.**

![AGI Index](public/logo.png)

## 🎯 Mission

The definition of AGI (Artificial General Intelligence) is often vague and shifting. Instead of relying on a single definition, the AGI Index aggregates collective intelligence to track specific, concrete milestones. By crowdsourcing questions and verifying their achievement, we provide a transparent and granular view of AI progress.

## ✨ Features

### 🔐 Authentication
- **Email/Password Authentication** with email confirmation
- **OAuth Providers**: Google, GitHub, Facebook, Apple
- Secure session management with Supabase Auth

### 📊 Question System
- **Index Questions**: Validated AGI milestones with community consensus
- **Candidate Questions**: Proposed milestones under review
- Category-based organization (Linguistic, Multimodal)
- Real-time voting with optimistic updates

### 🗳️ Voting Mechanism
- Vote on question suitability
- Track achievement status (Achieved/Not Yet)
- Weight important questions (1-3 scale)
- Provide unsuitable reasons with custom feedback

### 👤 User Features
- Personal voting history
- Track authored questions
- Edit previous votes
- Filter unvoted questions

### 🎨 User Experience
- Responsive design with mobile-first approach
- Loading skeletons for smooth transitions
- Optimistic UI updates (no page reloads)
- Dark mode support

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agiindex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the SQL files in order in your Supabase SQL Editor:
   ```bash
   # 1. Create schema (tables, types, RLS policies)
   database/01_schema.sql
   
   # 2. Seed initial questions (optional)
   database/02_seed_questions.sql
   
   # 3. Migration for approval system (optional, future feature)
   database/03_migration_approval_system.sql
   ```

5. **Configure OAuth providers** (optional)
   
   Follow the [Supabase OAuth documentation](https://supabase.com/docs/guides/auth/social-login) to set up:
   - Google OAuth
   - GitHub OAuth
   - Facebook OAuth
   - Apple OAuth

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
agiindex/
├── app/                      # Next.js App Router pages
│   ├── auth/                 # OAuth callback handler
│   ├── login/                # Login page
│   ├── manifesto/            # Manifesto page
│   ├── profile/              # User profile
│   ├── questions/            # Browse questions
│   ├── suggest/              # Suggest new questions
│   └── page.tsx              # Landing page
├── components/
│   ├── feature/              # Feature-specific components
│   │   └── question-card.tsx # Question voting card
│   ├── layout/               # Layout components
│   │   └── navbar.tsx        # Navigation bar
│   └── ui/                   # Reusable UI components
├── database/                 # SQL schema and migrations
│   ├── 01_schema.sql         # Database schema
│   ├── 02_seed_questions.sql # Sample data
│   └── 03_migration_*.sql    # Database migrations
├── lib/
│   ├── auth-context.tsx      # Authentication context
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Utility functions
└── types/
    └── database.ts           # TypeScript types for database
```

## 🗄️ Database Schema

### Tables

- **`profiles`**: User profile information
- **`questions`**: AGI milestone questions
  - `is_indexed`: Whether the question is validated as an Index Question
  - `category`: Question category (linguistic, multimodal)
  - `vote_count`, `achieved_count`: Aggregated vote statistics
- **`votes`**: User votes on questions
  - `is_suitable`: Whether the question is a good AGI metric
  - `is_achieved`: Whether AI has achieved this milestone
  - `weight`: Importance rating (1-3)
  - `unsuitable_reason`: Reason if marked unsuitable

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- Public read access for approved content
- Authenticated users can vote and submit questions
- Users can only modify their own data

## 🎨 Design Philosophy

The AGI Index is designed to be:
- **Inclusive**: Anyone can participate, regardless of technical background
- **Transparent**: All votes and questions are public
- **Democratic**: Community consensus determines what qualifies as AGI
- **Granular**: Track specific capabilities rather than a binary "AGI achieved" metric

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Built with ❤️ for the AI community**
