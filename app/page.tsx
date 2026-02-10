export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Apex - Mobile Shop Inventory
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Mobile shop inventory management application with Vercel Speed Insights enabled.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">✅ Speed Insights Enabled</h2>
          <p className="text-gray-700">
            This application is now tracking performance metrics with Vercel Speed Insights.
            Once deployed to Vercel, you&apos;ll be able to view real-time performance data in your dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Deploy this app to Vercel</li>
            <li>Enable Speed Insights in your Vercel project dashboard</li>
            <li>Visit your site to generate traffic</li>
            <li>View performance metrics in the Speed Insights tab</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
