import App, { Container } from 'next/app';
import NavBar from '../components/main/NavBar';

class MyApp extends App {
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
