/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import App, { Container } from 'next/app';
import NavBar from '../components/main/NavBar';
import config from '../auth.config';
import withAuth from '../components/common/auth/withAuth';
import { Fragment } from 'react';

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
  private user: any = undefined;
  render() {
    if (this.props.user) {
      this.user = this.props.user;
    }
    const { Component, pageProps } = this.props;
    return (
      <Fragment>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100vh;
          `}
        >
          <NavBar user={this.user} />
          <div
            css={css`
              flex: 1 1 auto;
            `}
          >
            <Component {...pageProps} />
          </div>
          <div id="modal-root"></div>
        </div>
      </Fragment>
    );
  }
}

export default withAuth(MyApp);
