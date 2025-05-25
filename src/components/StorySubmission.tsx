import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

interface StorySubmissionProps {
  session: Session;
}

const StorySubmission: React.FC<StorySubmissionProps> = ({ session }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [region, setRegion] = useState("");
  const [author, setAuthor] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    let imageUrl = null;
    try {
      console.log("session.user.id", session.user.id);

      // 1. Upload image to Supabase Storage if present
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
        const { error: storageError } = await supabase.storage
          .from("story-images")
          .upload(fileName, image);
        if (storageError) throw storageError;
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("story-images")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Insert story into Supabase
      console.log({
        title,
        author,
        excerpt,
        region,
        content,
        image_url: imageUrl,
        user_id: session.user.id,
        status: "pending",
      });
      const { error: insertError, data: insertedStories } = await supabase
        .from("stories")
        .insert([
          {
            title,
            author,
            excerpt,
            region,
            content,
            image_url: imageUrl,
            user_id: session.user.id,
            status: "pending",
          },
        ])
        .select();
      if (insertError) throw insertError;

      // Insert admin notification for pending review
      const newStory = insertedStories && insertedStories[0];
      await supabase.from("notifications").insert([
        {
          target_type: "admin",
          type: "pending_review",
          story_id: newStory?.id,
          message: `New story submitted by ${author}: ${title} - ${content.substring(
            0,
            60
          )}...`,
        },
      ]);

      setSuccess("Story submitted successfully! Waiting for admin approval.");
      setTitle("");
      setAuthor("");
      setExcerpt("");
      setRegion("");
      setContent("");
      setImage(null);
      editor?.commands.clearContent();
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Failed to submit story");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-[70vh] bg-transparent pb-20 mb-12">
      <div className="bg-zinc-900 rounded-xl shadow-2xl p-8 w-full max-w-xl mt-12 border border-zinc-800">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-100 tracking-tight">
          Write your story
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2"
              placeholder="Your name or pen name"
            />
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Excerpt (short summary)
            </label>
            <input
              type="text"
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2"
              placeholder="A short summary of your story"
            />
          </div>

          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2"
            >
              <option value="">Select a region</option>
              <option value="Luzon">Luzon</option>
              <option value="Visayas">Visayas</option>
              <option value="Mindanao">Mindanao</option>
              <option value="Metro Manila">Metro Manila</option>
              <option value="Nationwide">Nationwide</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Story Content
            </label>
            <div className="border border-gray-700 rounded-md bg-gray-900">
              <div className="border-b border-gray-700 p-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-gray-800 ${
                    editor?.isActive("bold") ? "bg-gray-800" : ""
                  }`}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-gray-800 ${
                    editor?.isActive("italic") ? "bg-gray-800" : ""
                  }`}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleUnderline().run()
                  }
                  className={`p-2 rounded hover:bg-gray-800 ${
                    editor?.isActive("underline") ? "bg-gray-800" : ""
                  }`}
                >
                  <u>U</u>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={`p-2 rounded hover:bg-gray-800 ${
                    editor?.isActive("heading", { level: 2 })
                      ? "bg-gray-800"
                      : ""
                  }`}
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("left").run()
                  }
                  className={`p-2 rounded hover:bg-gray-800 ${
                    editor?.isActive({ textAlign: "left" }) ? "bg-gray-800" : ""
                  }`}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                  className={`p-2 rounded hover:bg-gray-800 ${
                    editor?.isActive({ textAlign: "center" })
                      ? "bg-gray-800"
                      : ""
                  }`}
                >
                  ↔
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("right").run()
                  }
                  className={`p-2 rounded hover:bg-gray-800 ${
                    editor?.isActive({ textAlign: "right" })
                      ? "bg-gray-800"
                      : ""
                  }`}
                >
                  →
                </button>
              </div>
              <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none p-4 min-h-[200px]"
              />
              {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <div className="flex gap-2 bg-zinc-800 rounded shadow p-2">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`p-1 rounded ${
                        editor.isActive("bold")
                          ? "bg-red-600 text-white"
                          : "text-gray-200"
                      }`}
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      className={`p-1 rounded ${
                        editor.isActive("italic")
                          ? "bg-red-600 text-white"
                          : "text-gray-200"
                      }`}
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                      }
                      className={`p-1 rounded ${
                        editor.isActive("underline")
                          ? "bg-red-600 text-white"
                          : "text-gray-200"
                      }`}
                    >
                      <u>U</u>
                    </button>
                  </div>
                </BubbleMenu>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Story Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
          </div>

          <button
            type="submit"
            className="w-full max-w-xs mx-auto block py-3 px-4 border border-transparent rounded-md shadow-md text-base font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
          >
            Submit Story
          </button>
        </form>

        {/* Live Preview Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Live Preview
          </h3>
          <div className="prose prose-invert max-w-none bg-gray-800 rounded p-4 border border-gray-700">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorySubmission;
