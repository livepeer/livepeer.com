/** @jsx jsx */
import { jsx } from "theme-ui";

export default ({ node }) => {
  const { html } = node;
  if (!html) {
    return undefined;
  }
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
