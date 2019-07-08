import { NextContext } from 'next';
import App from './main/App';
import Head from 'next/head';

function Start() {
  return (
    <div>
      <Head>
        <title>Phase 10 Scorer</title>
      </Head>
      <App />
      <div id="modal-root"></div>
    </div>
  );
}
Start.getInitialProps = async ({ req }: NextContext) => {
  let pageProps = {};

  return { pageProps };
};

export default Start;
