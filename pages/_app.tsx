/** @jsx jsx */
import { css, jsx, withTheme } from '@emotion/react';
import App from 'next/app';
import withAuth from '../components/common/auth/withAuth';
import NavBar from '../components/main/NavBar';
import AppThemeProvider from '../components/theming/AppThemeProvider';
import { AppTheme } from '../components/theming/themes';
import AppBody from './AppBody';
class MyApp extends App<{ user?: any; enableAuth0: boolean; theme: AppTheme }> {
  private user: any = undefined;
  render() {
    if (this.props.user) {
      this.user = this.props.user;
    }
    const { Component, pageProps } = this.props;
    return (
      <AppThemeProvider>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100vh;
          `}
        >
          <NavBar user={this.user} isAuthAllowed={this.props.enableAuth0} />
          <AppBody>
            <Component {...pageProps} />
          </AppBody>
          <div id="modal-root"></div>
        </div>
      </AppThemeProvider>
    );
  }
}

export default withAuth(withTheme(MyApp));
