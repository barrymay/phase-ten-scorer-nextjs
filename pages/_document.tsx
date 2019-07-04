/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';
import GlobalNormalize from './defaults/GlobalNormalize';
import Meta from './Meta';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }: { renderPage: any }) {
    const page = renderPage();
    const styles = extractCritical(page.html);
    return { ...page, ...styles };
  }

  constructor(props: any) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = ids;
    }
  }

  render() {
    return (
      <html>
        <GlobalNormalize></GlobalNormalize>
        <Meta></Meta>

        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
