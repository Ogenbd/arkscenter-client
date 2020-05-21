import React, { useState } from "react";
import ReactMde from "react-mde";
import { getDefaultToolbarCommands } from "react-mde/lib/js/commands/default-commands/defaults";
import { ReactComponent as YoutubeIcon } from "../../assets/images/general/youtube.svg";
import "./MarkdownEditor.scss";

import MarkdownRenderer from "./MarkdownRenderer";

const getSurroundingWord = (text, position) => {
  let isWordDelimiter = (c) => {
    return c === " " || c.charCodeAt(0) === 10;
  };
  let start = 0;
  let end = text.length;
  for (let i = position; i - 1 > -1; i--) {
    if (isWordDelimiter(text[i - 1])) {
      start = i;
      break;
    }
  }
  for (let i = position; i < text.length; i++) {
    if (isWordDelimiter(text[i])) {
      end = i;
      break;
    }
  }
  return { start: start, end: end };
};

const selectWord = (a) => {
  let text = a.text,
    selection = a.selection;
  if (text && text.length && selection.start === selection.end) {
    return getSurroundingWord(text, selection.start);
  }
  return selection;
};

const commands = getDefaultToolbarCommands();
commands.push(["embed"]);

const youtubeCommand = {
  buttonProps: { "aria-label": "embed youtube video" },
  icon: () => <YoutubeIcon className="svg-icon" style={{ width: "1.5em" }} />,
  execute: ({ initialState, textApi }) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({
      text: initialState.text,
      selection: initialState.selection,
    });
    const state1 = textApi.setSelectionRange(newSelectionRange);
    // Replaces the current selection with the bold mark up
    const state2 = textApi.replaceSelection(
      `[[ youtube id="${state1.selectedText}"]]`
    );
    // Adjust the selection to not contain the **
    textApi.setSelectionRange({
      start: state2.selection.end - 3 - state1.selectedText.length,
      end: state2.selection.end - 3,
    });
  },
};

const MarkdownEditor = ({ guide, onChange }) => {
  const [selectedTab, setSelectedTab] = useState("write");

  return (
    <ReactMde
      value={guide}
      onChange={onChange}
      commands={{ embed: youtubeCommand }}
      toolbarCommands={commands}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      minEditorHeight={584}
      minPreviewHeight={584}
      generateMarkdownPreview={(markdown) =>
        Promise.resolve(<MarkdownRenderer source={markdown} />)
      }
    />
  );
};

export default MarkdownEditor;
