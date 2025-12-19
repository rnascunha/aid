import { ReactNode } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Link from "next/link";
import { SxProps, Typography } from "@mui/material";

export function MarkdownText({
  children,
  pstyle,
}: {
  children: string;
  pstyle?: SxProps;
}) {
  const Paragraph = ({ children }: { children?: ReactNode }) => (
    <Typography
      sx={{
        // margin: 0,
        fontSize: "14px",
        // whiteSpace: "pre-line",
        // wordBreak: "break-word",
        ...pstyle,
      }}
    >
      {children}
    </Typography>
  );
  const LinkRender = ({
    href,
    children,
  }: {
    href?: string;
    children?: ReactNode;
  }) => {
    return (
      <Link href={href ?? ""} target="_blank">
        {children}
      </Link>
    );
  };
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{ p: Paragraph, a: LinkRender }}
    >
      {children}
    </ReactMarkdown>
  );
}
