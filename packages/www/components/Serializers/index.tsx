/** @jsx jsx */
import { jsx } from "theme-ui";
import EmbedHtml from "../EmbedHtml";
import Figure from "../Figure";

const serializers = {
  types: {
    EmbedHtml: EmbedHtml,
    figure: Figure,
  },
};

export default serializers;
