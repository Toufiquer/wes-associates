/*
|-----------------------------------------
| setting up RichTextEditorField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import StarterKit from '@tiptap/starter-kit';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent, Editor } from '@tiptap/react';

function EditorMenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const options = [
    {
      label: 'Heading 1',
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      label: 'Heading 2',
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      label: 'Heading 3',
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      label: 'Heading 4',
      icon: <Heading4 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editor.isActive('heading', { level: 4 }),
    },
    {
      label: 'Heading 5',
      icon: <Heading5 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: editor.isActive('heading', { level: 5 }),
    },
    {
      label: 'Heading 6',
      icon: <Heading6 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: editor.isActive('heading', { level: 6 }),
    },
    { label: 'Bold', icon: <Bold className="size-4" />, onClick: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold') },
    { label: 'Italic', icon: <Italic className="size-4" />, onClick: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic') },
    {
      label: 'Line through',
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    {
      label: 'Align left',
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
    },
    {
      label: 'Align center',
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
    },
    {
      label: 'Align right',
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
    },
    {
      label: 'Bullet list',
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      label: 'Numbered list',
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      label: 'Highlight',
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive('highlight'),
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-wrap gap-1 p-1 mb-3 rounded-sm border border-white/20',
        'bg-white/10 backdrop-blur-md shadow-sm hover:bg-white/15 transition-all',
      )}
    >
      {options.map((option, index) => (
        <Toggle
          key={index}
          size="sm"
          pressed={option.isActive}
          onPressedChange={option.onClick}
          title={option.label}
          aria-label={option.label}
          className={cn(
            'rounded-sm bg-white/5 hover:bg-white/20 transition-all border border-transparent',
            option.isActive && 'bg-white/20 border-white/30 shadow-sm',
          )}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}

export interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (content: string) => void;
  label?: string;
  className?: string;
}

type RichTextMode = 'code' | 'preview';

const richTextPreviewClass = cn(
  'max-w-none rounded-sm text-sm leading-7',
  '[&_h1]:mb-4 [&_h1]:mt-5 [&_h1]:text-4xl [&_h1]:font-black [&_h1]:leading-tight',
  '[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:leading-tight',
  '[&_h3]:mb-3 [&_h3]:mt-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:leading-snug',
  '[&_h4]:mb-2 [&_h4]:mt-4 [&_h4]:text-xl [&_h4]:font-bold',
  '[&_h5]:mb-2 [&_h5]:mt-3 [&_h5]:text-lg [&_h5]:font-semibold',
  '[&_h6]:mb-2 [&_h6]:mt-3 [&_h6]:text-base [&_h6]:font-semibold',
  '[&_p]:my-3 [&_strong]:font-bold [&_em]:italic [&_s]:line-through',
  '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1',
  '[&_mark]:rounded-sm [&_mark]:bg-yellow-300/80 [&_mark]:px-1 [&_mark]:text-slate-950',
);

const escapeHtml = (content: string) =>
  content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

export const formatRichTextHtml = (content?: string) => {
  const value = content?.trim();
  if (!value) return '<p>No description added.</p>';
  if (/<\/?[a-z][\s\S]*>/i.test(value)) return value;

  return value
    .split(/\n{2,}/)
    .map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('');
};

export function RichTextPreview({ value, className }: { value?: string; className?: string }) {
  return <div className={cn(richTextPreviewClass, className)} dangerouslySetInnerHTML={{ __html: formatRichTextHtml(value) }} />;
}

export default function RichTextEditorField({ id, value, onChange, label, className }: RichTextEditorProps) {
  const [mode, setMode] = useState<RichTextMode>('code');

  const modeOptions = useMemo(
    () => [
      { value: 'code' as const, label: 'Code', icon: <Code2 className="size-4" /> },
      { value: 'preview' as const, label: 'Preview', icon: <Eye className="size-4" /> },
    ],
    [],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: 'list-disc pl-4' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal pl-4' } },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg min-h-[150px] w-full rounded-sm border border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 text-sm text-white/90 placeholder:text-white/40 shadow-inner transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent focus:outline-none focus:ring-0',
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <div className={cn('grid w-full gap-2 text-white', className)}>
      {label && (
        <Label htmlFor={id} className="text-white/80 tracking-wide">
          {label}
        </Label>
      )}
      <div className={cn('rounded-sm border border-white/20 bg-white/5 backdrop-blur-md shadow-lg p-2', 'hover:bg-white/10 transition-all duration-200')}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex rounded-sm border border-white/20 bg-white/10 p-1">
            {modeOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-sm px-2 text-xs font-medium text-white/70 transition-colors',
                  mode === option.value ? 'bg-white/20 text-white shadow-sm' : 'hover:bg-white/10 hover:text-white',
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {mode === 'code' && (
          <div className="space-y-3">
            <EditorMenuBar editor={editor} />
            <div className="overflow-hidden rounded-sm border border-white/10">
              <EditorContent editor={editor} id={id} />
            </div>
          </div>
        )}
        {mode === 'preview' && (
          <RichTextPreview
            value={value}
            className="min-h-[220px] border border-white/10 bg-white/10 px-4 py-3 text-white/90 [&_a]:text-sky-200 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_h5]:text-white [&_h6]:text-white"
          />
        )}
      </div>
    </div>
  );
}
