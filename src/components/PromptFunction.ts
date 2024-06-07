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
  startChatMessage,
  successChatMessage,
} from "../features/llm/llmSlice";
import { AppDispatch } from "../app/store";

type GenerateProps = {
  system: string;
  prompt: string;
};

export const generate =
  ({ system, prompt }: GenerateProps) =>
  async (
    dispatch: AppDispatch,
    controller?: AbortController
  ): Promise<ChatSuccess> => {
    const data = {
      model: "llama3",
      system,
      prompt,
      stream: true,
      options: {
        // num_predict: 25,
      },
    };

    const response = await fetch("http://localhost:11434/api/generate", {
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

    const body = response.body;
    if (body === null) {
      throw new Error("Error!!!");
    }

    const reader = body.getReader();
    const decoder = new TextDecoder();
    let info: ChatSuccess = {
      result: "SUCCESS",
      description: "Unknown generation information",
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
        const chunk = JSON.parse(decoder.decode(value)); // a risk of exception
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
            description = "No generation";
          } else {
            description = "Unknown done reason";
          }

          info = {
            result: "SUCCESS",
            description,
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
      if (done) {
        break;
      }
    } while (true);
    return info;
  };

export const generateLangCompare = ({ prompt }: { prompt: string }) =>
  generate({
    system:
      'You are a developer expert in programming languages. Format all language comparisons as formatted lists with two sections: "1st language features" and  "2nd language features".',
    prompt,
  });

export type Generate = (
  dispatch: AppDispatch,
  controller?: AbortController
) => Promise<ChatSuccess>;

export const executor =
  (dispatch: AppDispatch, controller?: AbortController) =>
  async (g: Generate) => {
    dispatch(startChatMessage());
    try {
      const info = await g(dispatch, controller);
      dispatch(successChatMessage(info));
    } catch (error) {
      let description;
      if (error instanceof Error) {
        if (error.message === "BodyStreamBuffer was aborted") {
          description = "Generation was aborted";
        } else if (error.message === "network error") {
          description = "Generation communication error";
        } else if (error.message === "Failed to fetch") {
          description = "Generation cannot be connected";
        } else {
          description = "Unknown generation error";
        }
      } else {
        description = "Unexpected generation error";
      }
      dispatch(
        failureChatMessage({
          result: "ERROR",
          description,
        })
      );
    }
  };

//executor(dispatch)(generate());
