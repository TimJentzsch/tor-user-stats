import Head from 'next/head';
import Footer from '../app/components/Footer/Footer';
import Header from '../app/components/Header/Header';

export default function Home() {
  return (
    <div>
      <Head>
        <title>tor-user-stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <Footer />
    </div>
  );
}
