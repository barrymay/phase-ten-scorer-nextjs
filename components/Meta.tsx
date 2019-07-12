import normalizeCss from '!!raw-loader!normalize.css';
import { css, Global } from '@emotion/core';
import Head from 'next/head';

const Meta = () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
    <Global
      styles={css`
        ${normalizeCss}
        body {
          margin: 0;

          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
            'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        code {
          font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
            monospace;
        }

        #modal-root {
          position: relative;
          z-index: 999;
        }

        // No browser focus shadows
        div:focus {
          outline: none;
        }
      `}
    ></Global>
  </div>
);

export default Meta;
