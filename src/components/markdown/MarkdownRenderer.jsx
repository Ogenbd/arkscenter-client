import React from "react";
import ReactMarkdown from "react-markdown";
import YouTube from "react-youtube";
import breaks from "remark-breaks";
import shortcodes from "remark-shortcodes";
import s from "./MarkdownRenderer.module.scss";

const ShortcodeRenderer = ({ identifier, attributes }) => {
  switch (identifier) {
    case "youtube":
      return <YouTube className={s.youtubeContainer} videoId={attributes.id} />;
    default:
      return null;
  }
};

const MarkdownRenderer = ({ source }) => (
  <div className={s.markdown}>
    <ReactMarkdown
      source={source}
      plugins={[
        [shortcodes, {}],
        [breaks, {}],
      ]}
      renderers={{ shortcode: ShortcodeRenderer }}
    />
  </div>
);

export default MarkdownRenderer;
