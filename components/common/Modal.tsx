import { css } from '@emotion/react';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { animated, useTransition } from '@react-spring/web';
import { Fragment, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import tw from 'twin.macro';
import P10Button from './button/P10Button';

function useModalStyle() {
  const modalStyle = css`
    ${tw`bg-black bg-opacity-50 fixed h-full w-full top-0 left-0 flex items-center justify-center`}
    .modalPage {
      ${tw`border-black rounded bg-white`}
      .modalHeader {
        ${tw`flex items-center p-1 border-b-2`}
        .title {
          ${tw`flex-auto text-lg`}
        }
        .controls {
          ${tw`flex-none`}
        }
      }
      .modalBody {
        ${tw`p-1`}
      }
    }
  `;
  return modalStyle;
}

const ModalBody: React.FC = ({ children }) => {
  const modalRootRef = useRef(document.getElementById('modal-root'));
  const mainDivRef = useRef(document.createElement('div'));

  useEffect(() => {
    const modalRoot = modalRootRef.current;
    if (!modalRoot) {
      throw new Error('No modal-root exists!');
    }
    const mainDiv = mainDivRef.current;
    modalRoot.appendChild(mainDiv);
    return () => {
      modalRoot.removeChild(mainDiv);
    };
  }, []);

  return createPortal(children, mainDivRef.current);
};

const Modal: React.FC<{
  shown: boolean;
  title: string;
  width?: number;
  height?: number;
  onClick: () => void;
  onCancel: () => void;
}> = ({ children, title, onClick, onCancel, width, height, shown }) => {
  const parentDiv = useRef<HTMLDivElement>(null);
  const modalStyle = useModalStyle();

  useEffect(() => {
    if (shown && parentDiv.current) {
      parentDiv.current.focus();
    }
  }, [shown]);

  const sizeOverride = css({
    width,
    height,
  });

  const transition = useTransition(shown, {
    expires: 0,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const keyHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (shown && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onCancel();
    }
  };

  return (
    <Fragment>
      {transition((props, item) => {
        return (
          item && (
            <ModalBody>
              <animated.div
                style={props}
                ref={parentDiv}
                css={modalStyle}
                onKeyDown={keyHandler}
                tabIndex={0}
              >
                <div className="modalPage" css={sizeOverride}>
                  <div className="modalHeader">
                    <div className="title">{title}</div>
                    <div className="controls">
                      <P10Button
                        minimal
                        faIconDef={faTimes}
                        onClick={onClick}
                      />
                    </div>
                  </div>
                  <div className="modalBody">{children}</div>
                </div>
              </animated.div>
            </ModalBody>
          )
        );
      })}
    </Fragment>
  );
};

export default Modal;
