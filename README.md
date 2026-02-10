# Apex - Mobile Shop Inventory Management

A Next.js-based mobile shop inventory management application with Vercel Speed Insights enabled for performance monitoring.

## Features

- ✅ **Vercel Speed Insights** - Real-time performance monitoring
- ⚡ Built with Next.js 14 (App Router)
- 🎨 Styled with Tailwind CSS
- 📊 Performance metrics tracking out of the box

## Speed Insights Integration

This project includes Vercel Speed Insights, which provides:
- Real User Monitoring (RUM) data
- Core Web Vitals tracking (LCP, FID, CLS, TTFB, FCP)
- Performance score based on user experience
- Route-level performance insights

### How It Works

The `SpeedInsights` component is integrated in `app/layout.tsx`:

```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anumwaseem1416-dotcom/Apex.git
cd Apex
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel deploy
```

### Deploy via Git Integration

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy"

### Enable Speed Insights in Vercel Dashboard

After deployment:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to the **Speed Insights** tab
4. Click **Enable**
5. After the next deployment, Speed Insights routes will be available at `/_vercel/speed-insights/*`

### Viewing Speed Insights Data

Once enabled and deployed:
1. Visit your deployed site to generate traffic
2. Return to the Speed Insights tab in your Vercel dashboard
3. After a few visitors, you'll see metrics including:
   - Real User Monitoring data
   - Core Web Vitals scores
   - Performance trends over time
   - Route-level insights

## Project Structure

```
apex/
├── app/
│   ├── layout.tsx          # Root layout with SpeedInsights component
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── README.md              # This file
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Speed Insights Package Reference](https://vercel.com/docs/speed-insights/package)
- [Vercel Analytics](https://vercel.com/analytics)

## License

MIT
