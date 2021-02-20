import type { AppProps } from 'next/app';
import '../app/styles/variables.css';
import '../app/styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
