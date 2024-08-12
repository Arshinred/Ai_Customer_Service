import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Chatbox",
  description: "An interactive AI chatbox application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
          rel="stylesheet"
        />
        <style>{`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-slide-up {
            animation: slideUp 0.5s ease-out;
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
        `}</style>
      </head>
      <body className={`${inter.className} min-h-screen animate-gradient`}>
        <div className="container mx-auto p-4">
          <header className="glass-effect text-white p-6 rounded-t-lg animate-fade-in">
            <h1 className="text-3xl font-bold">AI Chatbox</h1>
            <p className="mt-2 text-sm">Engage in intelligent conversations</p>
          </header>
          <main className="bg-white p-8 rounded-b-lg shadow-lg animate-slide-up">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Welcome to AI Chatbox</h2>
              <p className="text-gray-600">Start a conversation with our AI and explore endless possibilities!</p>
            </div>
            {children}
          </main>
          <footer className="mt-8 text-center text-white text-sm animate-fade-in">
            <p>© 2024 AI Chatbox. All rights reserved.</p>
            <p className="mt-2">Powered by cutting-edge AI technology</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
