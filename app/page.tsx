export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-lg font-primary">
      <h1 className="text-4xl font-bold text-primary mb-xs">MBCLAB Portal</h1>

      <div className="flex gap-md border border-grey-200 p-md rounded-lg shadow-sm">
        <button className="bg-primary text-white px-md py-xs rounded hover:bg-secondary transition-colors font-secondary">
          Primary Action
        </button>
        <button className="bg-warning text-white px-md py-xs rounded hover:opacity-90 transition-colors font-secondary">
          Warning Alert
        </button>
        <button className="bg-error text-white px-md py-xs rounded hover:opacity-90 transition-colors font-secondary">
          Error Button
        </button>
      </div>
    </div>
  );
}
