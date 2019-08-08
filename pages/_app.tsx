import App, { Container } from 'next/app';
import NavBar from '../components/main/NavBar';
import { Auth0Provider } from '../components/common/auth/react-auth0-wrapper';
import config from '../auth.config';

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: any) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Auth0Provider
          domain={config.domain}
          clientId={config.clientId}
          redirectUriCallback={() => window.location.origin}
          // @ts-ignore
          onRedirectCallback={onRedirectCallback}
        >
          <NavBar />
          <Component {...pageProps} />
          <div id="modal-root"></div>
        </Auth0Provider>
      </Container>
    );
  }
}

export default MyApp;
