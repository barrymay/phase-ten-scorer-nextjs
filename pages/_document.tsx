/** @jsx jsx */
import { jsx } from '@emotion/core';
import Document, { Main, NextScript } from 'next/document';
import FontAwesomeSetup from '../components/common/font-awesome/FontAwesomeSetup';
import Meta from '../components/Meta';

export default class MyDocument extends Document {
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
        <Meta></Meta>

        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
