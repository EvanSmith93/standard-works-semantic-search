import type { MetaFunction } from "@remix-run/node";
import { SearchHeader } from "~/components/SearchHeader";
import { SearchBar } from "~/components/SearchBar";
import { Footer } from "~/components/Footer";

/*
Other name ideas:
* Scripturally
* Agape AI
* An hundredth part
* iNephi
* LiahonAI
*/

export const meta: MetaFunction = () => {
  return [{ title: "Gospel Library Semantic Search" }];
};

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6">
      <main>
        <SearchHeader />

        <div className="max-w-2xl mx-auto text-center mt-12">
          <SearchBar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
