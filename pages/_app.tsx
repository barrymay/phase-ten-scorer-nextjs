import App, { Container, NextAppContext } from 'next/app';
import NavBar from './main/NavBar';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }: NextAppContext) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <NavBar />
        <Component {...pageProps} />
        <div id="modal-root"></div>
      </Container>
    );
  }
}

export default MyApp;
