import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI, { ClientOptions } from "openai";

import type {
  ChatCompletionMessageParam,
  ChatCompletionCreateParamsNonStreaming,
} from "openai/resources/index";

@Injectable()
export class GptService {
  private readonly client: OpenAI;

  constructor(private readonly config: ConfigService) {
    const opts: ClientOptions = {
      apiKey: this.config.get<string>("OPENAI_API_KEY"),
      organization: this.config.get<string>("OPENAI_ORG_ID"),
    };

    this.client = new OpenAI(opts);
  }

  async chat(
    messages: ChatCompletionMessageParam[],
    options: Partial<ChatCompletionCreateParamsNonStreaming> = {},
  ): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: options.model ?? this.config.get("OPENAI_MODEL", "gpt-4.1"),
        messages,
        temperature: 0.7,
        ...options,
      });

      return completion.choices[0].message.content ?? "";
    } catch (err) {
      throw new HttpException(
        `OpenAI error: ${(err as Error).message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
