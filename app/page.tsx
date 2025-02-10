import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Inaba's Chat Room
        </h1>
        <Chat />
      </div>
    </main>
  );
}
