"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import "highlight.js/styles/atom-one-dark.min.css";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { Bold, Code, Heading2, Italic, List, ListOrdered } from "lucide-react";

const lowlight = createLowlight(common);

export default function TipTapEditor({ value, onChange }) {
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    setEditorReady(true);
  }, []);

  const debouncedOnChange = useCallback(
    debounce((html) => {
      if (html !== value) {
        onChange(html);
      }
    }, 300),
    [value, onChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        heading: { levels: [2] },
        bulletList: {},
        orderedList: {},
        codeBlock: false,
        bold: {},
        italic: {},
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: null,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => debouncedOnChange(editor.getHTML()),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editorReady || !editor) {
    return <p className="text-gray-500 text-center">جاري تحميل المحرر ...</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm p-4 rounded-lg">
      <div className="flex gap-1 mb-3 pb-2 border-gray-200 dark:border-gray-700 border-b">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive("bold") ? "!bg-primary text-white" : ""
          }`}
          title="عريض"
        >
          <Bold />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive("italic") ? "!bg-primary text-white" : ""
          }`}
          title="مائل"
        >
          <Italic />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "!bg-primary text-white" : ""
          }`}
          title="عنوان H2"
        >
          <Heading2 />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive("bulletList") ? "!bg-primary text-white" : ""
          }`}
          title="قائمة نقطية"
        >
          <List />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive("orderedList") ? "!bg-primary text-white" : ""
          }`}
          title="قائمة مرقمة"
        >
          <ListOrdered />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive("codeBlock") ? "!bg-primary text-white" : ""
          }`}
          title="كتلة تعليمات برمجية"
        >
          <Code />
        </button>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 p-3 border border-gray-200 focus-within:border-primary dark:border-gray-700 rounded-md focus-within:ring-1 focus-within:ring-primary w-full min-h-[200px] text-gray-900 dark:text-gray-100 leading-relaxed transition-all duration-200">
        <EditorContent
          editor={editor}
          title="محرر النصوص"
          className="outline-none w-full max-w-none h-full min-h-[200px] text-gray-900 dark:text-gray-100 prose prose-sm content"
        />
      </div>
    </div>
  );
}