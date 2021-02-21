import Head from 'next/head';
import Content from '../app/components/Content/Content';
import Footer from '../app/components/Footer/Footer';
import Header from '../app/components/Header/Header';
import UserStats from '../app/components/UserStats/UserStats';

export default function User(): JSX.Element {
  return (
    <div id="body">
      <Head>
        <title>tor-user-stats</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <Content>
        <UserStats />
      </Content>
      <Footer />
    </div>
  );
}
