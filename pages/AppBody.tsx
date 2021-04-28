import { css } from '@emotion/react';
import 'twin.macro';
import tw from 'twin.macro';

const AppBody: React.FC = (props) => {
  return (
    <div
      tw="flex-auto text-black dark:text-white bg-background-light dark:bg-background-dark"
      css={css`
        input {
          ${tw`dark:text-black`}
        }
      `}
    >
      {props.children}
    </div>
  );
};

export default AppBody;
