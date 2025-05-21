import React from "react";

interface SocialButtonProps {
  provider: "google" | "microsoft";
  onClick: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onClick }) => {
  const getProviderDetails = () => {
    switch (provider) {
      case "google":
        return {
          text: "Continue with Google",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          ),
          bgColor: "bg-white",
          textColor: "text-gray-900",
          hoverBg: "hover:bg-gray-100",
          borderColor: "border-gray-300",
        };
      case "microsoft":
        return {
          text: "Continue with Microsoft",
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
          ),
          bgColor: "bg-white",
          textColor: "text-gray-900",
          hoverBg: "hover:bg-gray-100",
          borderColor: "border-gray-300",
        };
    }
  };

  const details = getProviderDetails();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center px-4 py-2 border ${details.borderColor} rounded-md shadow-sm text-sm font-medium ${details.textColor} ${details.bgColor} ${details.hoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
    >
      <span className="sr-only">Sign in with {provider}</span>
      {details.icon}
      <span className="ml-2">{details.text}</span>
    </button>
  );
};

export default SocialButton;
