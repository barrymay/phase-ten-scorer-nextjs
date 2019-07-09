/** @jsx jsx */
import { jsx } from '@emotion/core';
import { extractCritical } from 'emotion-server';
import Document, { Main, NextScript } from 'next/document';
import FontAwesomeSetup from '../components/common/font-awesome/FontAwesomeSetup';
import GlobalNormalize from '../components/defaults/GlobalNormalize';
import Meta from '../components/Meta';

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
        <FontAwesomeSetup></FontAwesomeSetup>
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
