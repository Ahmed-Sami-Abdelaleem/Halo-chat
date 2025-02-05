import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Not Authenticated</h2>
      <p>Could not find requested resource</p>
      <Link href="/login">Return Home</Link>
    </div>
  );
}
