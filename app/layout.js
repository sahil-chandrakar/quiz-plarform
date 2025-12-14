// app/layout.js
import './globals.css';
import Navbar from './components/Navbar';
import ThemeRegistry from './components/ThemeRegistry';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = { title: 'Quiz Spark', description: 'Premium Quiz Platform' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      {/* ADD suppressHydrationWarning={true} BELOW */}
      <body
        style={{ backgroundColor: '#f8fafc' }}
        suppressHydrationWarning={true}
      >
        <ThemeRegistry>
          <Navbar />
          <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
}