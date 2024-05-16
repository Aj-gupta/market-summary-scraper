var cloudscraper = require("cloudscraper");
var cheerio = require("cheerio");

const headers = {
  Accept: "*/*",
  "User-Agent":
    "Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36",
  "Cache-Control": "private",
  Connection: "keep-alive",
  Pragma: "no-cache",
  Referer: "https://www.indmoney.com/",
};

const scraper = cloudscraper.defaults({ headers: headers });

export default {
  INDMONEY_STOCK_URL: "https://www.indmoney.com/stocks",
  getMarketSummary: async function () {
    const response: string = await scraper.get(this.INDMONEY_STOCK_URL);
    const $ = cheerio.load(response);
    // console.log("$", response);
    return {
      indexSummary: await getIndexSummary($),
      stockSummary: await getStockSummary($),
    };
  },
};

const getIndexSummary = async function ($: any) {
  const targetElement = $('h2:contains("Indian share markets indices")');
  const parent = targetElement.parent();
  const anchorElements = parent.find("a");
  const data: any = [];
  // Loop through each 'a' element and access its properties
  anchorElements.each((_: any, element: any) => {
    const anchorElement = $(element);
    const href = anchorElement.attr("href"); // Get the href attribute (link)
    const title = anchorElement.attr("title"); // Get the title attribute (optional)
    const price = anchorElement.find("p.font-medium.text-base")?.text()?.trim();
    const changeElement = anchorElement.find("p.font-normal");
    const changeSpan = changeElement.find("span");
    const changeValue = changeSpan.text().split("(")[0].trim(); // "34.4"
    const changePercentage = changeSpan
      .text()
      .split("(")[1]
      .split(")")[0]
      .trim();
    data.push({
      title,
      link: "https://www.indmoney.com" + href,
      price,
      changeValue,
      changePercentage,
    });
  });
  return data;
};
const getStockSummary = async function ($: any) {
  const element = $(".herolike-wrapper.snap-start.snap-always.pt-4.pb-8");

  // Access the element's content or attributes as needed
  const content = element
    .children("div")
    .children("div")
    .children("section")
    .eq(0)
    .children("div")
    .children("section")
    .children("div")
    .children("ul"); // Get the text content inside the element
  const liElements = content.find("li");
  liElements.each((_: any, li: any) => {
    // Select the 'li' element
    const listItem = $(li);

    // Extract title (from 'li' element attribute)
    const title = listItem.attr("title");

    // Select the 'a' element within the 'li'
    const anchorElement = listItem.find("a");

    // Extract image URL (from 'img' element attribute)
    const imageURL = anchorElement.find("img").attr("src");

    // Select the price and change elements within the nested 'div'
    const priceElement = anchorElement
      .find("div.text-13px.text-medium mt-1.text-center")
      .children("p");
    const changeElement = anchorElement
      .find("div.text-13px.text-medium mt-1.text-center")
      .find("p:nth-child(2)");

    // Extract price (remove leading rupee symbol)
    const price = priceElement.text().trim().slice(1);

    // Extract change percentage (including the ▲ or ▼ symbol)
    const changePercentage = changeElement.text().trim();

    console.log("Title:", title);
    console.log("Price:", price);
    console.log("Image URL:", imageURL);
    console.log("Change:", changePercentage);
  });
};
