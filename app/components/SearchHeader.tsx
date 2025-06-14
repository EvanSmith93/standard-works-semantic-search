import { FaGithub } from "react-icons/fa";

export function SearchHeader() {
  return (
    <>
      <a
        href="https://github.com/EvanSmith93/standard-works-semantic-search"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 right-6 text-gray-500 text-3xl"
        aria-label="GitHub Repository"
      >
        <FaGithub />
      </a>

      <div className="max-w-2xl mx-auto text-center mt-24">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#005175] to-[#01B6D1] bg-clip-text text-transparent leading-tight">
          Gospel Library
          <br />
          Semantic Search
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Search the entire Latter-day Saint standard works using natural
          language. Great for studying the scriptures by theme or idea, or just
          finding that one verse you forget the reference to.
        </p>
      </div>
    </>
  );
}
