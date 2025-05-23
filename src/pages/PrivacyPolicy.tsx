import React from "react";

const PrivacyPolicy: React.FC = () => (
  <div className="bg-gray-900 min-h-screen py-16">
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="font-serif text-4xl font-bold text-white mb-8 text-center">
        Privacy Policy
      </h1>
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 text-gray-300">
        <p className="mb-4">Last updated: May 23, 2025</p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          1. Introduction
        </h2>
        <p className="mb-4">
          The Aswang Archive (“we”, “us”, or “our”) is committed to protecting
          your privacy. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you visit our website
          (https://theaswangarchive.com).
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          2. Information We Collect
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>
            <b>Personal Data:</b> Such as your name and email address, if you
            register, subscribe to our newsletter, or contact us.
          </li>
          <li>
            <b>Usage Data:</b> Information automatically collected when you
            visit our site, such as your IP address, browser type, device
            information, and pages visited.
          </li>
          <li>
            <b>Cookies:</b> We may use cookies and similar tracking technologies
            to enhance your experience.
          </li>
        </ul>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          3. How We Use Your Information
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>
            Communicate with you, including sending newsletters or responding to
            inquiries
          </li>
          <li>
            Monitor and analyze usage and trends to improve your experience
          </li>
        </ul>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          4. Sharing Your Information
        </h2>
        <p className="mb-4">
          We do not sell, trade, or rent your personal information to third
          parties. We may share information with service providers who help us
          operate the website, or if required by law.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          5. Third-Party Services
        </h2>
        <p className="mb-4">
          Our website may contain links to third-party sites or services. We are
          not responsible for the privacy practices or content of those sites.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          6. Security
        </h2>
        <p className="mb-4">
          We use reasonable measures to protect your information, but no method
          of transmission over the Internet is 100% secure.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          7. Children's Privacy
        </h2>
        <p className="mb-4">
          Our website is not intended for children under 13. We do not knowingly
          collect personal information from children.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          8. Your Rights
        </h2>
        <p className="mb-4">
          You may request to access, correct, or delete your personal
          information by contacting us at{" "}
          <a
            href="mailto:contact@theaswangarchive.com"
            className="text-red-400 underline"
          >
            contact@theaswangarchive.com
          </a>
          .
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          9. Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated date.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          10. Contact Us
        </h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:{" "}
          <a
            href="mailto:contact@theaswangarchive.com"
            className="text-red-400 underline"
          >
            contact@theaswangarchive.com
          </a>
        </p>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
