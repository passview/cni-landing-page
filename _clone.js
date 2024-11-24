import scrape from "website-scraper";
import PuppeteerPlugin from "website-scraper-puppeteer";
import path from "path";
import { dirname } from "dirname-filename-esm";
import { CookieJar } from "tough-cookie";
import * as fs from "node:fs/promises";

const rawJson = await fs.readFile(
  path.resolve(dirname(import.meta), "designmodo.com.cookies.json"),
  "utf-8"
);
const cookies = JSON.parse(rawJson);

const _cookies = cookies.reduce((acc, { name, value }) => {
  acc[name] = value;
  return acc;
}, {});

console.log(JSON.stringify(_cookies, null, 2));
// const cookieJar = new CookieJar();
// for (const { name, value } of cookies) {
//   await cookieJar.setCookie(`${name}=${value}`, "https://designmodo.com");
// }

async function main() {
  await scrape({
    urls: [
      "https://designmodo.com/startup/app/preview.php?id=30746",
      "https://designmodo.com/startup/app/preview.php?id=30764"
    ],
    directory: path.resolve(dirname(import.meta), "cloned"),
    request: {
      // cookieJar,
      // cookies: _cookies,
    },
    plugins: [
      new PuppeteerPlugin({
        launchOptions: {
          headless: false,
          executablePath:
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          args: [
            `--user-data-dir=${path.resolve(
              dirname(import.meta),
              "chrome-user-data"
            )}`,
          ],
        } /* optional */,
        scrollToBottom: { timeout: 10000, viewportN: 10 } /* optional */,
        blockNavigation: true /* optional */,
      }),
    ],
  });
}

main();
