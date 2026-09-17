import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-20 min-h-screen px-6 py-8 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
