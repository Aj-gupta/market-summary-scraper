import type { VercelRequest, VercelResponse } from "@vercel/node";
import INDMoneyService from "../../utils/scraper/indmoney";
import { allowCors } from "../../utils/cors";

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const data: any = await INDMoneyService.getMarketSummary();
    return res.json({
      data,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({
      message: error.message || "server error",
    });
  }
}

export default allowCors(handler);
