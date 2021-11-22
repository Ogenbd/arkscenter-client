import React, { useState, useContext } from "react";
import ReactMde, { MarkdownUtil } from "react-mde";
import { getDefaultToolbarCommands } from "react-mde/lib/js/commands/default-commands/defaults";
import { ReactComponent as YoutubeIcon } from "../../assets/images/general/youtube.svg";
import "./MarkdownEditor.scss";

import windowContext from "../../providers/WindowContext";

import MarkdownRenderer from "./MarkdownRenderer";
import { useEffect } from "react";

const commands = getDefaultToolbarCommands();
commands[1].push("video");

const youtubeCommand = {
  buttonProps: { "aria-label": "embed youtube video" },
  icon: () => <YoutubeIcon className="svg-icon" style={{ width: "1.5em" }} />,
  execute: ({ initialState, textApi }) => {
    const newSelectionRange = MarkdownUtil.selectWord({
      text: initialState.text,
      selection: initialState.selection,
    });
    const state1 = textApi.setSelectionRange(newSelectionRange);
    const state2 = textApi.replaceSelection(
      `\n\n[[ youtube id="${state1.selectedText}"]]`
    );
    textApi.setSelectionRange({
      start: state2.selection.end - 3 - state1.selectedText.length,
      end: state2.selection.end - 3,
    });
  },
};

const MarkdownEditor = ({ markdown, onChange }) => {
  const [selectedTab, setSelectedTab] = useState("write");
  const { windowWidth } = useContext(windowContext);

  useEffect(() => {
    if (windowWidth >= 900) setSelectedTab("write");
  }, [windowWidth]);

  return (
    <div className="markdownEditorContainer">
      {windowWidth < 900 ? (
        <ReactMde
          value={markdown}
          onChange={onChange}
          commands={{ embed: youtubeCommand }}
          toolbarCommands={commands}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          minEditorHeight={584}
          minPreviewHeight={478}
          generateMarkdownPreview={(newMarkdown) => (
            <MarkdownRenderer source={newMarkdown} />
          )}
        />
      ) : (
        <>
          <ReactMde
            value={markdown}
            onChange={onChange}
            commands={{ video: youtubeCommand }}
            toolbarCommands={commands}
            minEditorHeight={584}
            minPreviewHeight={584}
          />
          <div className="markdownEditorPreview">
            <div className="preview-header">Preview</div>
            <div className="preview-body">
              <MarkdownRenderer source={markdown} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MarkdownEditor;
