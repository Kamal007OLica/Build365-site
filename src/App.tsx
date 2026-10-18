import { useSpotlight } from './hooks';
import TopProgress from './ui/TopProgress';
import Intro from './ui/Intro';
import Rails from './ui/Rails';
import Nav from './sections/Nav';
import Stage from './sections/Stage';
import Command from './sections/Command';
import Native from './sections/Native';
import Rooms from './sections/Rooms';
import Platform from './sections/Platform';
import Clock from './sections/Clock';
import Features from './sections/Features';
import Principles from './sections/Principles';
import GetStarted from './sections/GetStarted';
import Pricing from './sections/Pricing';
import Faq from './sections/Faq';
import Cta from './sections/Cta';
import Footer from './sections/Footer';

export default function App() {
  useSpotlight('.panel, .start-card, .card-in, .pr, .k-card, .nat-card, .price-card, .ent-step, .tn-card');
  return (
    <>
      <Rails />
      <Intro />
      <TopProgress />
      <Nav />
      <main id="main">
        <Stage />
        <Command />
        <Native />
        <Rooms />
        <Platform />
        <Clock />
        <Features />
        <Principles />
        <GetStarted />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
