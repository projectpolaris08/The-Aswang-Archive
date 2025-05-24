import React from "react";

const TermsOfService: React.FC = () => (
  <div className="bg-gray-900 min-h-screen py-16">
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="font-serif text-4xl font-bold text-white mb-8 text-center">
        Terms of Service
      </h1>
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 text-gray-300">
        <p className="mb-4">Last updated: May 23, 2025</p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          1. Acceptance of Terms
        </h2>
        <p className="mb-4">
          By accessing or using The Aswang Archive website
          (https://theaswangarchive.com), you agree to be bound by these Terms
          of Service and all applicable laws and regulations. If you do not
          agree with any of these terms, you are prohibited from using or
          accessing this site.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          2. Use License
        </h2>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of the
          materials (information or software) on The Aswang Archive's website
          for personal, non-commercial transitory viewing only. This is the
          grant of a license, not a transfer of title, and under this license
          you may not:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>
            Attempt to decompile or reverse engineer any software contained on
            the website
          </li>
          <li>
            Remove any copyright or other proprietary notations from the
            materials
          </li>
          <li>
            Transfer the materials to another person or "mirror" the materials
            on any other server
          </li>
        </ul>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          3. Disclaimer
        </h2>
        <p className="mb-4">
          The materials on The Aswang Archive's website are provided on an 'as
          is' basis. The Aswang Archive makes no warranties, expressed or
          implied, and hereby disclaims and negates all other warranties
          including, without limitation, implied warranties or conditions of
          merchantability, fitness for a particular purpose, or non-infringement
          of intellectual property or other violation of rights.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          4. Limitations
        </h2>
        <p className="mb-4">
          In no event shall The Aswang Archive or its suppliers be liable for
          any damages (including, without limitation, damages for loss of data
          or profit, or due to business interruption) arising out of the use or
          inability to use the materials on the website, even if The Aswang
          Archive or a The Aswang Archive authorized representative has been
          notified orally or in writing of the possibility of such damage.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          5. Revisions and Errata
        </h2>
        <p className="mb-4">
          The materials appearing on The Aswang Archive's website could include
          technical, typographical, or photographic errors. The Aswang Archive
          does not warrant that any of the materials on its website are
          accurate, complete, or current. The Aswang Archive may make changes to
          the materials contained on its website at any time without notice.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          6. Links
        </h2>
        <p className="mb-4">
          The Aswang Archive has not reviewed all of the sites linked to its
          website and is not responsible for the contents of any such linked
          site. The inclusion of any link does not imply endorsement by The
          Aswang Archive. Use of any such linked website is at the user's own
          risk.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          7. Modifications
        </h2>
        <p className="mb-4">
          The Aswang Archive may revise these Terms of Service at any time
          without notice. By using this website you are agreeing to be bound by
          the then current version of these Terms of Service.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          8. Governing Law
        </h2>
        <p className="mb-4">
          Any claim relating to The Aswang Archive's website shall be governed
          by the laws of the Philippines without regard to its conflict of law
          provisions.
        </p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">
          9. Contact Us
        </h2>
        <p>
          If you have any questions about these Terms, please contact us at:{" "}
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

export default TermsOfService;
