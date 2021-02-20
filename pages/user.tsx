import Head from 'next/head';
import Header from '../app/components/Header/Header';

export default function User() {
  return (
    <div>
      <Head>
        <title>tor-user-stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
    </div>
  );
}
