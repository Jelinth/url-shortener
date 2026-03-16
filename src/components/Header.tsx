import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-card border-b border-border py-4 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-2xl font-semibold text-primary hover:opacity-80 transition-opacity">
          Easy URL Shortener
        </Link>
      </div>
    </header>
  );
}
