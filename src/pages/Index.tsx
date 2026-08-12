import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import About from '@/components/site/About';
import Calculator from '@/components/site/Calculator';
import FuelPrices from '@/components/site/FuelPrices';
import Process from '@/components/site/Process';
import Equipment from '@/components/site/Equipment';
import Prices from '@/components/site/Prices';
import Reviews from '@/components/site/Reviews';
import Faq from '@/components/site/Faq';
import Contacts from '@/components/site/Contacts';
import Footer from '@/components/site/Footer';
import CallbackButton from '@/components/site/CallbackButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <FuelPrices />
        <Calculator />
        <Process />
        <Equipment />
        <Prices />
        <Reviews />
        <Faq />
        <Contacts />
      </main>
      <Footer />
      <CallbackButton />
    </div>
  );
};

export default Index;
