import OpenAI from "openai";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

export const openaiResponse = async (req: Request, res: Response) => {
  try {
    const { errorComponent, errorCode } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: errorCode },
        {
          role: "user",
          content: `''' ${errorComponent}''' `,
        },
      ],
    }); //find a MD renderor: to present the message , edit the prompt to match the specific requirement of app1
    console.log({ successful: completion.choices[0].message.content });
    console.log(completion.choices);
    res.status(200).json({ message: completion.choices[0].message.content });
    //res.status(200).json({ successful: "test" });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
