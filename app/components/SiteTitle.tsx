import { Link } from "@remix-run/react";

export function SiteTitle() {
  return (
    <div className="text-center px-12">
      <Link to="/">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#005175] to-[#01B6D1] bg-clip-text text-transparent leading-tight">
          Gospel Library Semantic Search
        </h1>
      </Link>
    </div>
  );
}
