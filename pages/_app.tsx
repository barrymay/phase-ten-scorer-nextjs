import noramlize from '@csstools/normalize.css';
import React from 'react';
import App, { Container, NextAppContext } from 'next/app';
import Meta from './Meta';
import { Global, css } from '@emotion/core';

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
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;
