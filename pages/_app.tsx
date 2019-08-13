import App, { Container } from 'next/app';
import NavBar from '../components/main/NavBar';
import config from '../auth.config';
import withAuth from '../components/common/auth/withAuth';

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

class MyApp extends App<{ user?: any }> {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <NavBar user={this.props.user} />
        <Component {...pageProps} />
        <div id="modal-root"></div>
      </Container>
    );
  }
}

export default withAuth(MyApp);
