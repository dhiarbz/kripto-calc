import { GoogleGenAI } from "@google/genai";
import { max } from "date-fns";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request){
    try{
        const { message } = await request.json();

        if(!message){
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }
        const systemPrompt = `Anda adalah asisten analis pasar kuantitatif untuk website kalkulator trading KriptoCalc. Berdasarkan data pasar real-time, jawab pertanyaan pengguna berikut: ${message}. Formulasikan jawaban Anda dalam satu paragraf ringkas tanpa markdown, yang mencakup: (1) Analisis singkat kondisi pasar saat ini (misal: bullish, bearish, volatil), (2) Strategi trading yang dapat ditindaklanjuti yang secara spesifik mendorong penggunaan salah satu alat kami (misal: 'Gunakan kalkulator DCA kami untuk akumulasi bertahap' atau 'Tentukan risiko Anda dengan kalkulator ukuran posisi'), dan (3) Kategori koin yang relevan untuk dipertimbangkan (misal: aset blue-chip atau altcoin lapis pertama), tanpa memberikan nasihat keuangan langsung.`
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: systemPrompt,
            config: {
                maxOutputTokens: 100,
                temperature: 0.7,
            },
        });

        return NextResponse.json(
            {
                summary: response.text,
                message: "Success generate content",
            },
            { status: 200 }
        );
    } catch (error){
        if(error instanceof Error){
            return NextResponse.json({error: error.message}, {status: 500});
        }
    }
}