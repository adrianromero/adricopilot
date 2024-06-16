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

import { JSX } from "react";
import Markdown from "react-markdown";
import { Avatar, Box, Chip, Paper, Rating, Typography } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import CalculateIcon from "@mui/icons-material/Calculate";
import StarIcon from "@mui/icons-material/Star";
import CodeIcon from "@mui/icons-material/Code";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import type { ChatMessage, Mode } from "../features/llm/llmSlice";
import DotsPulse from "./DotsPulse";

import generation from "./Generation.module.css";
import "katex/dist/katex.min.css";
import "./highlight.css";
import "./github.css";
import "./latex.css";

interface GenerationChatProps {
  chatMessage: ChatMessage;
}

const AVATARS: Record<Mode, JSX.Element> = {
  general: (
    <Avatar sx={{ mb: 0.5, bgcolor: "darkcyan", width: 24, height: 24 }}>
      <FaceIcon fontSize="small" />
    </Avatar>
  ),
  physics: (
    <Avatar sx={{ mb: 0.5, bgcolor: "red", width: 24, height: 24 }}>
      <CalculateIcon fontSize="small" />
    </Avatar>
  ),
  javascript: (
    <Avatar sx={{ mb: 0.5, bgcolor: "blue", width: 24, height: 24 }}>
      <CodeIcon fontSize="small" />
    </Avatar>
  ),
  grader: (
    <Avatar sx={{ mb: 0.5, bgcolor: "darkyellow", width: 24, height: 24 }}>
      <StarIcon fontSize="small" />
    </Avatar>
  ),
};

const MarkdownRender = (props: GenerationChatProps) => {
  const { text } = props.chatMessage;
  if (!text) {
    return null;
  }
  if (!text.trim()) {
    return (
      <Typography variant="caption" display="block">
        Empty generation...
      </Typography>
    );
  }
  return (
    <Markdown
      className="markdown-body"
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
    >
      {text}
    </Markdown>
  );
};

const RENDERS: Record<
  Mode,
  (props: GenerationChatProps) => JSX.Element | null
> = {
  general: MarkdownRender,
  physics: MarkdownRender,
  javascript: MarkdownRender,
  grader: (props: GenerationChatProps) => {
    const { text } = props.chatMessage;
    const { result } = props.chatMessage.info;
    if (result === "GENERATING") {
      return (
        <>
          <Rating value={0} precision={0.5} disabled />
          Calculating...
        </>
      );
    }
    try {
      return (
        <Rating
          value={(JSON.parse(text).score as number) / 2}
          precision={0.5}
          readOnly
        />
      );
    } catch (e) {
      return (
        <>
          <Rating value={0} precision={0.5} disabled />
          Error...
        </>
      );
    }
  },
};

export default function GenerationChat({
  chatMessage,
}: GenerationChatProps): JSX.Element {
  // Question component
  const question = chatMessage.question;
  let questioncomponent = null;
  if (question.trim()) {
    questioncomponent = <Markdown>{question}</Markdown>;
  }

  let footerdate = null;
  if (
    chatMessage.info.result === "SUCCESS" ||
    chatMessage.info.result === "ERROR"
  ) {
    footerdate = (
      <Typography variant="caption">
        {new Date(chatMessage.created).toLocaleString() +
          " - " +
          new Date(chatMessage.info.completed).toLocaleString()}
      </Typography>
    );
  } else {
    footerdate = (
      <>
        <Typography variant="caption">
          {new Date(chatMessage.created).toLocaleString() + " - "}
        </Typography>
        <DotsPulse />
      </>
    );
  }

  let footer = null;
  if (chatMessage.info.result === "ERROR") {
    footer = (
      <Chip
        label={chatMessage.info.description}
        color="error"
        size="small"
        variant="outlined"
      />
    );
  } else if (chatMessage.info.result === "SUCCESS") {
    footer = (
      <>
        {chatMessage.info.description && (
          <Chip
            label={chatMessage.info.description}
            color="success"
            size="small"
            variant="outlined"
          />
        )}
      </>
    );
  }

  const TextComponent = RENDERS[chatMessage.mode];

  return (
    <Box display="flex" flexDirection="column">
      <Paper
        sx={{
          p: 1,
          backgroundColor: "background.paper",
          flexGrow: 1,
          alignSelf: "stretch",
        }}
        variant="outlined"
        className={generation.message}
      >
        <Box display="flex" gap={1} alignItems="center">
          {AVATARS[chatMessage.mode]}
          <Box sx={{ flexGrow: 1 }}> {questioncomponent}</Box>
        </Box>
        <TextComponent chatMessage={chatMessage} />
        <div style={{ position: "relative", height: "10px" }}>
          <div style={{ position: "absolute", bottom: 0, right: 0 }}>
            {footer}
          </div>
        </div>
      </Paper>
      <Box
        display="flex"
        gap={1}
        sx={{
          alignSelf: "end",
        }}
      >
        {footerdate}
      </Box>
    </Box>
  );
}
