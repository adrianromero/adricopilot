/*
ADRICOPILOT
Copyright (C) 2024 Adrián Romero
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import {
  addChatMessage,
  ChatSuccess,
  failureChatMessage,
  Mode,
  startChatMessage,
  successChatMessage,
} from "../features/llm/llmSlice";
import { AppDispatch } from "../app/store";
import { OllamaSettings } from "../features/settings/settingsSlice";

export type Generate = (
  dispatch: AppDispatch,
  controller?: AbortController
) => Promise<ChatSuccess>;

export type GenerateProps = {
  mode: Mode;
  system: string;
  prompt: string;
  format?: "json";
};
export type OllamaGenerate = (
  ollama: OllamaSettings,
  { question }: { question: string }
) => Generate;

class PromptError extends Error {}

const generate =
  (
    ollama: OllamaSettings,
    { mode, system, prompt, format }: GenerateProps,
    question: string
  ) =>
  async (
    dispatch: AppDispatch,
    controller?: AbortController
  ): Promise<ChatSuccess> => {
    const { ollamaurl, model, seed, temperature } = ollama;
    const data = {
      model,
      system,
      prompt,
      format,
      stream: true,
      options: {
        seed,
        temperature,
        // num_predict: 25,
      },
    };

    dispatch(startChatMessage({ mode, question }));
    const response = await fetch(ollamaurl + "generate", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "error",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
      signal: controller?.signal,
    });

    const status = response.status;
    if (status < 200) {
      throw new PromptError(
        "Unexpected server generation information response"
      );
    }
    if (status >= 500) {
      throw new PromptError("Generation server response error");
    }
    if (status >= 400) {
      throw new PromptError("Generation client request error");
    }
    if (status >= 300) {
      throw new PromptError(
        "Unexpected server generation redirection response"
      );
    }

    const body = response.body;
    if (body === null) {
      throw new PromptError("Generation response is empty");
    }

    const reader = body.getReader();
    const decoder = new TextDecoder();
    let info: ChatSuccess = {
      result: "SUCCESS",
      description: "Unknown generation information",
      completed: new Date().getTime(),
      done_reason: "unknown",
      total_duration: 0,
      load_duration: 0,
      prompt_eval_count: 0,
      prompt_eval_duration: 0,
      eval_count: 0,
      eval_duration: 0,
    };
    do {
      const { done, value } = await reader.read();
      if (value) {
        const strvalue = decoder.decode(value).split(/\r?\n/);
        for (let i = 0; i < strvalue.length; i += 1) {
          const line = strvalue[i].trim();
          if (line) {
            const chunk = JSON.parse(line); // Can throw exception if not JSON
            const result = chunk.response as string;
            dispatch(addChatMessage(result));
            if (chunk.done as boolean) {
              const done_reason = chunk.done_reason as string;
              let description;
              if (done_reason === "stop") {
                description = "";
              } else if (done_reason === "length") {
                description = "Max tokens generated";
              } else if (done_reason === "load") {
                description = "Nothing generated";
              } else {
                description = "Unknown done reason";
              }

              info = {
                result: "SUCCESS",
                description,
                completed: new Date().getTime(),
                done_reason,
                total_duration: chunk.done_duration as number,
                load_duration: chunk.load_duration as number,
                prompt_eval_count: chunk.prompt_eval_count as number,
                prompt_eval_duration: chunk.prompt_eval_duration as number,
                eval_count: chunk.eval_count as number,
                eval_duration: chunk.eval_duration as number,
              };
            }
          }
        }
      }

      if (done) {
        break;
      }
    } while (true);
    return info;
  };

export const generateLangCompare: OllamaGenerate = (
  ollama: OllamaSettings,
  { question }: { question: string }
) =>
  generate(
    ollama,
    {
      system:
        'You are a developer expert in programming languages. Format all language comparisons as formatted lists with two sections: "1st language features" and  "2nd language features".',
      prompt: question,
      mode: "general",
    },
    question
  );

export const generateGeneral: OllamaGenerate = (
  ollama: OllamaSettings,
  { question }: { question: string }
) =>
  generate(
    ollama,
    {
      system: "",
      prompt: question,
      mode: "general",
    },
    question
  );

export const generatePhysics: OllamaGenerate = (
  ollama: OllamaSettings,
  { question }: { question: string }
) =>
  generate(
    ollama,
    {
      system:
        "You are a tutor expert in physics and maths. Format all equations, formulas in latex when possible",
      prompt: question,
      mode: "physics",
    },
    question
  );

export const generateJavascript: OllamaGenerate = (
  ollama: OllamaSettings,
  { question }: { question: string }
) =>
  generate(
    ollama,
    {
      mode: "javascript",
      system:
        "You are a developer expert in the javascript programing language. Write code examples when required",
      prompt: question,
    },
    question
  );

export const generateGrader: OllamaGenerate = (
  ollama: OllamaSettings,
  { question }: { question: string }
) =>
  generate(
    ollama,
    {
      mode: "grader",
      system:
        'You are a grader assessing the customer satisfation based on customer comments. Give a numeric score between 0 and 10 to indicate the customer satisfaction. Respond following this JSON format: { "score": number }',
      //       system: `You are a grader assessing the customer satisfation based on customer comments. Give a numeric score between 0 and 10 to indicate the customer satisfaction.
      // Respond with the following JSON schema: {
      // "$schema": "http://json-schema.org/draft-04/schema#",
      // "type": "object",
      // "properties": {
      // "score": {
      // "type": "integer"
      // }
      // },
      // "required": [
      // "score"
      // ]
      // }`,
      prompt: `Here is the customer comment: ${question}`,
      format: "json",
    },
    question
  );

export const executor =
  (dispatch: AppDispatch, controller?: AbortController) =>
  async (g: Generate) => {
    try {
      const info = await g(dispatch, controller);
      dispatch(successChatMessage(info));
    } catch (error) {
      let description;
      if (error instanceof PromptError) {
        description = error.message;
      } else if (error instanceof Error) {
        if (error.message === "BodyStreamBuffer was aborted") {
          description = "Generation was aborted";
        } else if (error.message === "network error") {
          description = "Generation communication error";
        } else if (error.message === "Failed to fetch") {
          description = "Generation connection error";
        } else if (error.message === "signal is aborted without reason") {
          description = "Generation was aborted before starting";
        } else if (error.message.includes("Failed to parse URL")) {
          description = "Generation URL server is wrong";
        } else {
          description = "Unknown generation error";
          console.warn(error);
        }
      } else {
        description = "Unexpected generation error";
      }
      dispatch(
        failureChatMessage({
          result: "ERROR",
          description,
          completed: new Date().getTime(),
        })
      );
    }
  };
