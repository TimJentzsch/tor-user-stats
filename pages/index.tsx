import Head from 'next/head';
import Content from '../app/components/Content/Content';
import Footer from '../app/components/Footer/Footer';
import Header from '../app/components/Header/Header';

export default function Home(): JSX.Element {
  return (
    <div id="body">
      <Head>
        <title>tor-user-stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
