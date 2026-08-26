import Link from "next/link";

export default function Home() {
  return (
      <main>
        <h1>TicketTracker</h1>

        <p>Welcome to TicketTracker.</p>

        <div>
          <Link href="/login">Login</Link>
          {" | "}
          <Link href="/register">Register</Link>
        </div>
      </main>
  );
}