import { NextContext } from 'next';
import App from './main/App';

function Start() {
  return (
    <div>
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
