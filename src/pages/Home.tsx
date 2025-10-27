import { DecorativeBlobs } from '../components/atoms/DecorativeBlobs';
import { Header } from '../components/organisms/Header';
import { Hero } from '../components/organisms/Hero';
import { Features } from '../components/organisms/Features';
import { Footer } from '../components/organisms/Footer';

export default function Home() {
  const bodyStyle = {
    fontFamily: "'Inter', sans-serif",
    background: 'linear-gradient(135deg, #e0f2f7 0%, #d4edee 50%, #fef3e2 100%)',
    minHeight: '100vh',
    backgroundAttachment: 'fixed'
  };

  return (
    <div className="text-gray-900" style={bodyStyle}>
      <DecorativeBlobs />
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
