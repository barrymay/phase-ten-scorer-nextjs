/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import App from 'next/app';
import { Fragment } from 'react';
import withAuth from '../components/common/auth/withAuth';
import NavBar from '../components/main/NavBar';
import AppThemeProvider from '../components/theming/AppThemeProvider';

class MyApp extends App<{ user?: any; enableAuth0: boolean }> {
  private user: any = undefined;
  render() {
    if (this.props.user) {
      this.user = this.props.user;
    }
    const { Component, pageProps } = this.props;
    return (
      <Fragment>
        <AppThemeProvider>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              height: 100vh;
            `}
          >
            <NavBar user={this.user} isAuthAllowed={this.props.enableAuth0} />
            <div
              css={css`
                flex: 1 1 auto;
              `}
            >
              <Component {...pageProps} />
            </div>
            <div id="modal-root"></div>
          </div>
        </AppThemeProvider>
      </Fragment>
    );
  }
}

export default withAuth(MyApp);
