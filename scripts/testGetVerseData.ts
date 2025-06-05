import { getFullName, getUrl, queryVerseData } from "../utils/db.server";

async function main() {
  const data = await queryVerseData(32000);

  const url = getUrl(data);
  const name = getFullName(data);

  console.log(url, name);
}

main();
