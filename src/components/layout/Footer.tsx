import React from "react";
import { Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-red-500">
              The Aswang Archive
            </h3>
            <p className="text-sm">
              Exploring Philippine Folklore, Mythology, and the Supernatural
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-red-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-100 mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/creatures"
                  className="hover:text-red-500 transition-colors"
                >
                  Creatures
                </Link>
              </li>
              <li>
                <Link
                  to="/stories"
                  className="hover:text-red-500 transition-colors"
                >
                  Stories
                </Link>
              </li>
              <li>
                <Link
                  to="/regions"
                  className="hover:text-red-500 transition-colors"
                >
                  Regions
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className="hover:text-red-500 transition-colors"
                >
                  Articles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-100 mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-red-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contributors"
                  className="hover:text-red-500 transition-colors"
                >
                  Contributors
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-red-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacypolicy"
                  className="hover:text-red-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/termsofservice"
                  className="hover:text-red-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-100 mb-4">Subscribe</h4>
            <p className="text-sm mb-4">
              Join our newsletter to receive the latest updates on Philippine
              folklore.
            </p>
            <form className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 bg-gray-800 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} The Aswang Archive. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
