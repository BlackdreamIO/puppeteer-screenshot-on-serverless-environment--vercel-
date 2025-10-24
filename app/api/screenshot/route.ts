// @/lib/pdf.ts
import chromium from "@sparticuz/chromium-min";
import { NextRequest } from "next/server";
import puppeteerCore from "puppeteer-core";

const CHROMIUM_REMOTE_EXEC_PATH = "https://hq9efw2rtkf0p84m.public.blob.vercel-storage.com/chromium-v121.0.0-pack.tar";

async function getBrowser() {
  const REMOTE_PATH = CHROMIUM_REMOTE_EXEC_PATH;
  const LOCAL_PATH = CHROMIUM_REMOTE_EXEC_PATH;
  if (!REMOTE_PATH && !LOCAL_PATH) {
    throw new Error("Missing a path for chromium executable");
  }

  if (!!REMOTE_PATH) {
    return await puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(
        CHROMIUM_REMOTE_EXEC_PATH,
      ),
      defaultViewport: null,
      headless: true,
    });
  }

  return await puppeteerCore.launch({
    executablePath: LOCAL_PATH,
    defaultViewport: null,
    headless: true,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing 'url' query parameter", { status: 400 });
  }

  try {
    const pdfBuffer = await makePDFFromDomain(url);

      const base64Data = Buffer.from(pdfBuffer).toString("base64");

   return new Response(
    JSON.stringify({ screenshot: base64Data }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  } catch (error) {
    return new Response(`Error generating PDF: ${error}`, { status: 500 });
  }
}

const makePDFFromDomain = async (url: string) => {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.goto(url);

    const title = await page.screenshot({ optimizeForSpeed : true });
    console.log(title)

    await browser.close();

   return title;
  } catch (error) {
    throw error;
  }
};