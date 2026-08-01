import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import { queryPineconeIndex } from "utils/pinecone.server";
import { getFullName, getUrl, queryVerseData } from "utils/db.server";
import { VOLUMES } from "utils/helpers";
import { SearchBar } from "~/components/SearchBar";
import { SearchResults } from "~/components/SearchResults";
import { Footer } from "~/components/Footer";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.search
        ? `${data.search} - Gospel Library Semantic Search`
        : "Gospel Library Semantic Search",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("q")?.trim() ?? "";
  const volumesParam = url.searchParams.get("volumes");

  const allVolumes = VOLUMES.map((volume) => volume.volume_lds_url);
  const volumes = volumesParam
    ? volumesParam.split(",").filter((v) => allVolumes.includes(v))
    : allVolumes;

  if (search === "" || volumes.length === 0) {
    throw redirect("/");
  }

  const bestVerseIds = await queryPineconeIndex(search, volumes, 5);

  const results = await Promise.all(
    bestVerseIds.map(async (verse) => {
      const data = await queryVerseData(Number(verse.id));

      const url = getUrl(data);
      const name = getFullName(data);

      return {
        text: verse.text,
        name,
        url,
      };
    })
  );

  return { results, search, volumes };
}

export default function Search() {
  const { results, search, volumes } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  return (
    <div className="min-h-screen flex flex-col justify-between p-6">
      <main>
        <div className="max-w-2xl mx-auto text-center">
          <Link to="/">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#005175] to-[#01B6D1] bg-clip-text text-transparent leading-tight">
              Gospel Library Semantic Search
            </h1>
          </Link>

          <SearchBar
            key={`${search}-${volumes.join(",")}`}
            initialSearch={search}
            initialVolumes={volumes}
          />
        </div>

        <SearchResults results={results} isLoading={isLoading} />
      </main>

      <Footer />
    </div>
  );
}
