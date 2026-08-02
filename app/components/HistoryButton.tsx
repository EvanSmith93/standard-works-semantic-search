import { Link } from "@remix-run/react";
import { MdHistory } from "react-icons/md";

interface HistoryButtonProps {
  className?: string;
}

export function HistoryButton({ className = "" }: HistoryButtonProps) {
  return (
    <Link
      to="/history"
      className={`text-gray-500 text-3xl ${className}`}
      aria-label="Search History"
    >
      <MdHistory />
    </Link>
  );
}
