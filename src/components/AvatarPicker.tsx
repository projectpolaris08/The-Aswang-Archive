import React, { useRef } from "react";

interface AvatarPickerProps {
  value: string | null;
  onChange: (url: string) => void;
  onUpload?: (file: File) => Promise<string>; // For custom upload logic
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  value,
  onChange,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      const url = await onUpload(e.target.files[0]);
      onChange(url);
    }
  };

  const defaultAvatars = Array.from(
    { length: 17 },
    (_, i) => `/assets/avatars/avatar${i + 1}.png`
  );

  return (
    <div>
      <div className="grid grid-cols-5 gap-4 mb-4">
        {defaultAvatars.map((avatar, idx) => (
          <button
            type="button"
            key={idx}
            className={`rounded-full border-2 ${
              value === avatar ? "border-red-500" : "border-transparent"
            }`}
            onClick={() => onChange(avatar)}
          >
            <img
              src={avatar}
              alt={`avatar${idx + 1}`}
              className="w-16 h-16 rounded-full"
            />
          </button>
        ))}
        <button
          type="button"
          className="rounded-full border-2 border-gray-400 flex items-center justify-center w-16 h-16 bg-gray-700 text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          +
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {value && (
        <div>
          <span className="text-gray-400">Selected:</span>
          <img
            src={value}
            alt="selected avatar"
            className="w-16 h-16 rounded-full inline ml-2"
          />
        </div>
      )}
    </div>
  );
};

export default AvatarPicker;
