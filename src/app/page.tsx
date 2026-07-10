import { readFileSync } from "node:fs";
import { join } from "node:path";
import HomeInteractions from "./home-interactions";

function getHomeMarkup() {
  const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];

  if (!body) {
    throw new Error("Could not find <body> content in index.html");
  }

  return body
    .replace(/<script>[\s\S]*?<\/script>/gi, "")
    .replaceAll('src="logo-cropped.png"', 'src="/logo-cropped.png"');
}

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: getHomeMarkup() }} />
      <HomeInteractions />
    </>
  );
}
