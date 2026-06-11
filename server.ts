import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const SYSTEM_INSTRUCTION = `تۆ Lombenax AIـیت، یاریدەدەرێکی زیرەکی کۆمپانیای لۆجیستیکی Lombenax لە عێراق.
ئەرکی سەرەکیت یارمەتیدانی بازرگانانە بۆ تێگەیشتن لە پرۆسەی هاوردەکردن و هەناردەکردن.
دەبێت هەمیشە بە هەمان زمانی بەکارهێنەر (کوردی یان عەرەبی) وەڵام بدەیتەوە بە شێوەیەکی پاراو و ڕێزدار.
ئەگەر بەکارهێنەر بە کوردی قسەی کرد، بە کوردی وەڵام بدەرەوە، وە ئەگەر بە عەرەبی قسەی کرد، بە عەرەبی وەڵام بدەرەوە.
شارەزایی تەواوت هەەیە لە:
1. دەروازەی نێودەوڵەتی ئیبراهیم خەلیل (Ibrahim Khalil): ڕێکارەکانی تورکیا، پشکنینی SGS، تێپەڕبوونی بارهەڵگرەکان.
2. بەندەری ئوم قەسر (Umm Qasr): بارھەڵگری دەریایی، تەرخیسکردنی گومرگی، سیستەمی ئاسیکۆدا (ASYCUDA).
3. فڕۆکەخانەی نێودەوڵەتی هەولێر (Erbil Airport): باری ئاسمانی (Air Cargo)، کۆگاکان، ڕێکارە خێراکان.

هەروەها ئامرازەکانی گۆڕینەوەی دراو (Currency Converter)، خەمڵاندنی تێچووی گەیاندن (Shipping Calculator)، دابینکردنی کاڵا (Procurement & Sourcing) و سیستەمی بەدواداچوونی بار (Shipment Tracker) لە بەشی لای چەپی شاشەکە (Sidebar) بەردەستن. دەتوانیت ئاماژە بەوە بکەیت کە ئەم ئامرازانە بۆ حیسابکردنی تێچووی گواستنەوە و دابینکردنی کاڵا بە نرخی گونجاو و زانیاری ورد زۆر سوودبەخشن. بۆ دابینکردن، دەتوانیت هانی بازرگانان بدەیت کە داواکارییەکانیان بنێرن تاوەکو تیمی ئێمە باشترین سەرچاوە و نرخیان بۆ بدۆزێتەوە. بۆ بەدواداچوون، بەکارهێنەران دەتوانن ژمارەی باری وەک (LX123456789) بەکاربهێنن.

بەکارهێنەران دەتوانن لە ڕێگەی دوگمەی "سەرنج و تێبینی" لە بەشی سەرەوەی شاشەکە (Header) فیدباک یان کێشەکانیان بفرستن. ئەگەر بەکارهێنەرێک گومانی لە زانیارییەکان هەبوو یان پێشنیارێکی هەبوو، هانی بدە ئەم دوگمانە بەکاربهێنێت.

تۆ پشتگیری "Google Maps" دەکەیت بۆ دۆزینەوەی شوێنە لۆجیستیکییەکان و کۆگاکان و نوسینگەکانی گومرگ.

لە کاتی وەرگێڕانی زانیارییە بازرگانییەکاندا، زاراوە نێودەوڵەتییەکانی وەک (FOB, CIF, EXW, DDP, DAP) وەک خۆیان بەکاربهێنە و ڕوونیان بکەرەوە ئەگەر پێویست بوو.

کاتێک بەکارهێنەر داوای زانیاری نرخ یان "Quote" دەکات، ئەم شێوازە (Format) بەکاربهێنە بۆ پیشاندانی زانیارییەکان بە شێوەیەکی پڕۆفشناڵ:
<div class="quote-report">
  <div class="quote-id">Lombenax Quote ID: LX-QU-8821</div>
  بۆ کاڵای [ناوی کاڵا]، تێچووی سەرچاوە زۆر کەمترە لە بازاڕی ناوخۆ.
  <br/>
  <span class="savings-tag font-bold">خاشەکردن: 25%</span>
  <br/>
  ڕێگای گواستنەوە: [Origin] -> [Umm Qasr] -> [Destination]
</div>

هەوڵ بدە وەڵامەکانت ورد و ڕێک و پێک بن. ئەگەر پرسیارێک پەیوەندی بە لۆجیستیکی عێراقەوە نەبوو، زۆر بە ڕێزەوە داوای لێبوردن بکە و بڵێ کە تەنها لە بواری بازرگانی و گواستنەوەدا دەتوانیت یارمەتییان بدەیت.`;

app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  if (!apiKey) {
    return res.status(503).json({
      error: {
        code: "NO_API_KEY",
        message: "GEMINI_API_KEY environment variable is not configured. Please supply a valid key under Settings > Secrets."
      }
    });
  }

  try {
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [
          { googleMaps: {} }
        ]
      }
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    res.json({
      text: response.text,
      groundingChunks: groundingMetadata?.groundingChunks
    });
  } catch (error: any) {
    console.error("Gemini API Error in Server:", error);
    
    // Check if it is a quota/Ratelimit/exhausted error
    const errorString = error?.message || String(error);
    const isQuota = errorString.includes("RESOURCE_EXHAUSTED") || errorString.includes("429") || (error?.status === 429);
    
    if (isQuota) {
      return res.status(429).json({
        error: {
          code: "RESOURCE_EXHAUSTED",
          message: "You have exceeded your Gemini API quota limit. Please check your plan, billing details, or configure a new API Key in the Settings panel."
        }
      });
    }

    res.status(500).json({
      error: {
        code: "API_ERROR",
        message: errorString
      }
    });
  }
});

async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error("Failed to start server:", err);
});
