// src/pages/about.tsx
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

function HomePage() {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <div>
      <MDEditor value={value} onChange={setValue} />
    </div>
  );
}

export default HomePage;
  