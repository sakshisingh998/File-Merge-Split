// src/components/Footer.jsx
import React from "react";
import { Heart, Github, Mail, Shield, FileText, Users } from "lucide-react";
import theme from "../config/theme";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-16 py-8 px-4 border-t-2"
      style={{
        backgroundColor: theme.colors.primary,
        color: theme.colors.card.text,
        borderColor: theme.colors.accent
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Project Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-3 flex items-center">
              📑 PDF Utility Suite
            </h3>
            <p className="text-sm opacity-80 mb-4 leading-relaxed">
              Built with passion for Development and making real-world impact.
              This tool is Robust And Highly Scalable and helps manage PDF files with splitting, merging, and text extraction features.
              Created as part of our journey in mastering REST APIS , SpringBoot , React , Containerization , AI Integration , Azure and modern web technologies.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-opacity-20 hover:bg-white"
                aria-label="View Code on GitHub"
                title="View Source Code"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-opacity-20 hover:bg-white"
                aria-label="Contact Us"
                title="Get in Touch"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <FileText size={18} className="mr-2" />
              Features
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="hover:opacity-100 transition-opacity cursor-pointer">
                Split PDFs by pages
              </li>
              <li className="hover:opacity-100 transition-opacity cursor-pointer">
                Merge multiple files
              </li>
              <li className="hover:opacity-100 transition-opacity cursor-pointer">
                Extract text content
              </li>
              <li className="hover:opacity-100 transition-opacity cursor-pointer">
                AI-powered summaries
              </li>
            </ul>
          </div>

          {/* Learning Section */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Users size={18} className="mr-2" />
              About Us
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="hover:opacity-100 transition-opacity">
                CS Girlies
              </li>
              <li className="hover:opacity-100 transition-opacity">
                Building Robust Systems
              </li>
              <li className="hover:opacity-100 transition-opacity">
                Open Source Project
              </li>
              <li className="hover:opacity-100 transition-opacity">
                ReactJs & SpringBoot Used
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="border-t pt-6" style={{ borderColor: theme.colors.accent }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            {/* Copyright */}
            <div className="flex items-center text-sm opacity-80 ">
              <span>© {currentYear} . Built with </span>
              <Heart size={14} className="mx-1 text-red-400" />
              <span>by aspiring developers</span>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="opacity-80 hover:opacity-100 transition-opacity hover:underline"
              >
                View Source Code
              </a>
              <a
                href="#"
                className="opacity-80 hover:opacity-100 transition-opacity hover:underline"
              >
                Report Bugs
              </a>
              <a
                href="#"
                className="opacity-80 hover:opacity-100 transition-opacity hover:underline"
              >
                Suggest Features
              </a>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center mt-4 pt-4 border-t" style={{ borderColor: theme.colors.accent }}>
            <p className="text-xs opacity-60">
              <div className="ml-1"> • Created by Sakshi Singh & Palak Kumrawat • </div>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;