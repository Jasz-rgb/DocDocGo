import Link from "next/link";
import { Brain, Mail } from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // const socialLinks = [
  //   {
  //     icon: <FaGithub className="h-5 w-5" />,
  //     href: "https://github.com",
  //     label: "GitHub",
  //   },
  //   {
  //     icon: <Mail className="h-5 w-5" />,
  //     href: "mailid",
  //     label: "email",
  //   },
  // ];

  const footerLinks = {
    Product: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
    ],
    Resources: [
      {
        label: "GitHub",
        href: "https://github.com/Jasz-rgb/DocDocGo",
      },
      {
        label: "Documentation",
        href: "https://github.com/Jasz-rgb/DocDocGo#readme",
      },
    ],
  };
  const socialLinks = [
    {
      icon: <FaGithub className="h-5 w-5" />,
      href: "https://github.com/Jasz-rgb",
      label: "GitHub",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      href: "jasminesahoo007@email.com",
      label: "Email",
    },
  ];
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">DocDocGo</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              AI-powered document analysis for teams. Upload, analyze, and
              collaborate on documents with your organization.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}