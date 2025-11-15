"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreview, setIsPreview] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const heading = document.createElement(`h${level}`);
      heading.textContent = selection.toString() || `Heading ${level}`;
      range.deleteContents();
      range.insertNode(heading);
      onChange(editorRef.current?.innerHTML || "");
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Underline, command: "underline", title: "Underline" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    { icon: Code, command: "formatBlock", value: "pre", title: "Code Block" },
    {
      icon: Quote,
      command: "formatBlock",
      value: "blockquote",
      title: "Quote",
    },
  ];

  return (
    <div className={cn("border rounded-md", className)}>
      <style jsx>{`
        .empty-editor:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(1)}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(2)}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(3)}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {toolbarButtons.map(({ icon: Icon, command, value, title }) => (
          <Button
            key={command}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand(command, value)}
            title={title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) execCommand("createLink", url);
          }}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>

        <div className="ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {/* Editor */}
      {isPreview ? (
        <div
          className="p-4 min-h-[200px] prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          className={`p-4 min-h-[200px] outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            value === "" ? "empty-editor" : ""
          }`}
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: value }}
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
}
