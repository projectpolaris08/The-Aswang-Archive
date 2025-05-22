import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";

interface StorySubmissionProps {
  session: Session;
}

const StorySubmission: React.FC<StorySubmissionProps> = ({ session }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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
        const { data: storageData, error: storageError } =
          await supabase.storage.from("story-images").upload(fileName, image);
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
        content,
        image_url: imageUrl,
        user_id: session.user.id,
        status: "pending",
      });
      const { error: insertError } = await supabase.from("stories").insert([
        {
          title,
          content,
          image_url: imageUrl,
          user_id: session.user.id,
          status: "pending",
        },
      ]);
      if (insertError) throw insertError;

      setSuccess("Story submitted successfully! Waiting for admin approval.");
      setTitle("");
      setContent("");
      setImage(null);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Failed to submit story");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Write your story</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Story Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Story Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-red-50 file:text-red-700
              hover:file:bg-red-100"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Submit Story
          </button>
        </div>
      </form>
    </div>
  );
};

export default StorySubmission;
