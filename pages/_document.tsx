import Document, { Head, Html, Main, NextScript } from 'next/document';
import FontAwesomeSetup from '../components/common/font-awesome/FontAwesomeSetup';
import Meta from '../components/Meta';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head />
        <FontAwesomeSetup></FontAwesomeSetup>
        <Meta></Meta>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
