import React, { Component } from 'react';
import cookie from 'js-cookie';
import fetch from 'isomorphic-fetch';
import Router from 'next/router';
import { NextComponentType, NextPageContext } from 'next-server/dist/lib/utils';

export const logout = () => {
  cookie.remove('token');
  window.localStorage.setItem('logout', '' + Date.now());
  Router.push('/logout');
};

// Gets the display name of a JSX component for dev tools
const getDisplayName = (
  wrappedComponent: React.FC<{ user: any; getInitialProps: NextPageContext }>,
) =>
  wrappedComponent.displayName || wrappedComponent.name || 'wrappedComponent';

const withAuth = (WrappedComponent: any) =>
  class AuthInnerComponent extends Component {
    static displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(wrapperContext: any) {
      const { req, res } = wrapperContext.ctx;

      // get the initial props as defined in the page
      let componentProps: any =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(wrapperContext));

      componentProps = componentProps || {};

      // On client side find user in __NEXT_DATA__
      if (!req) {
        const { pageProps } = (window as any).__NEXT_DATA__.props;

        if ('user' in pageProps) {
          componentProps.user = pageProps.user;
          return { ...componentProps };
        }
        return { ...componentProps };
      }

      // determine the protocol for local vs production
      let protocol = 'https:';
      let host = req
        ? req.headers.host || req.headers['x-forwarded-host']
        : window.location.hostname;

      if (host && host.indexOf('localhost') > -1) {
        protocol = 'http:';
        host = req.headers['x-forwarded-host'];
      }

      // if on server side mimic the client making the request by using req headers
      let options: any;
      if (typeof res !== 'undefined') {
        options = { credentials: 'same-origin', headers: req.headers };
      }

      const userData = await fetch(`${protocol}//${host}/user`, options);

      // place user in component props
      const userJson = await userData.json();
      const { user } = userJson;
      componentProps.user = user;
      return { ...componentProps };
    }

    // event listen across tabs to sync logout
    componentDidMount() {
      window.addEventListener('storage', this.syncLogout);
    }

    componentWillUnmount() {
      window.removeEventListener('storage', this.syncLogout);
      window.localStorage.removeItem('logout');
    }

    syncLogout(event: any) {
      if (event.key === 'logout') {
        Router.push('/logout');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

export default withAuth;
