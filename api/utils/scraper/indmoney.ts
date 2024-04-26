var cloudscraper = require("cloudscraper");
var cheerio = require("cheerio");

export default {
  INDMONEY_STOCK_URL: "https://www.indmoney.com/stocks",
  getMarketSummary: async function () {
    const response: string = await cloudscraper.get(this.INDMONEY_STOCK_URL);
    const $ = cheerio.load(response);
    // console.log("$", response);
    const targetElement = $('h2:contains("Indian share markets indices")');
    const parent = targetElement.parent();
    const anchorElements = parent.find("a");
    const data: any = [];
    // Loop through each 'a' element and access its properties
    anchorElements.each((index, element) => {
      const anchorElement = $(element);
      const href = anchorElement.attr("href"); // Get the href attribute (link)
      const title = anchorElement.attr("title"); // Get the title attribute (optional)
      const price = anchorElement
        .find("p.font-medium.text-base")
        ?.text()
        ?.trim();
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
  },
};
