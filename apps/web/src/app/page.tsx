
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">🚀 MagajiCo</h1>
        <p className="text-2xl mb-8">Fresh Start - Clean Architecture</p>
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">✅ ML Service Active</h2>
            <p className="text-sm opacity-90">Running at port 8000</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">🎯 Ready to Build</h2>
            <p className="text-sm opacity-90">Clean slate for new features</p>
          </div>
        </div>
      </div>
    </main>
  )
}
