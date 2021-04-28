import { withTheme } from '@emotion/react';
import App from 'next/app';
import { GlobalStyles } from 'twin.macro';
import NavBar from '../components/main/NavBar';
import AppThemeProvider from '../components/theming/AppThemeProvider';
import { AppTheme } from '../components/theming/themes';
import '../styles/globals.css';
import AppBody from './AppBody';

class MyApp extends App<{ user?: any; enableAuth0: boolean; theme: AppTheme }> {
  private user: any = undefined;
  render() {
    if (this.props.user) {
      this.user = this.props.user;
    }
    const { Component, pageProps } = this.props;
    return (
      <div tw="flex flex-col h-screen">
        <GlobalStyles />
        <AppThemeProvider>
          <NavBar user={this.user} isAuthAllowed={this.props.enableAuth0} />
          <AppBody>
            <Component {...pageProps} />
          </AppBody>
        </AppThemeProvider>

        <div id="modal-root"></div>
      </div>
    );
  }
}

//export default withAuth(withTheme(MyApp));
export default withTheme(MyApp);
