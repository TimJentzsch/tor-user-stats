import Doc, { Html, Head, Main, NextScript } from 'next/document';

class Document extends Doc {
  static async getInitialProps(ctx) {
    const initialProps = await Doc.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="author" content="Tim Jentzsch" />
          <meta
            name="description"
            content="An unofficial tool to display user statistics for /r/TranscribersOfReddit."
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="tor-user-stats" />
          <meta
            property="og:description"
            content="An unofficial tool to display user statistics for /r/TranscribersOfReddit."
          />
          <meta property="og:image" content="https://i.imgur.com/ZCQ8tJH.png" />
          <meta property="og:image:width" content="500" />
          <meta property="og:image:height" content="500" />
          <meta property="og:image" content="https://i.imgur.com/1Hm1Qr7.png" />
          <meta property="og:image:width" content="1285" />
          <meta property="og:image:height" content="639" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:url" content="https://timjentzsch.github.io/tor-user-stats/" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="tor-user-stats" />
          <meta
            name="twitter:description"
            content="An unofficial tool to display user statistics for /r/TranscribersOfReddit."
          />
          <meta name="twitter:image" content="https://i.imgur.com/ZCQ8tJH.png" />

          <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
