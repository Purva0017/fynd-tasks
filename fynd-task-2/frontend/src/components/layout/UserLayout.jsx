import { Navbar } from './Navbar';

export function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}
