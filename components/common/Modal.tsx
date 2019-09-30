/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { animated, useTransition } from 'react-spring';
import P10Button from './button/P10Button';

const modalStyle = css`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .modalPage {
    border: 1px solid black;
    border-radius: 4px;
    background: white;
    .modalHeader {
      display: flex;
      align-items: center;
      padding: 4px;
      border-bottom: 1px solid black;
      .title {
        display: flex;
        flex: 1 1 auto;
        font-size: 1.2em;
      }
      .controls {
        display: flex;
        flex: none;
      }
    }
    .modalBody {
      padding: 4px;
    }
  }
`;

const Modal: React.FC<{
  shown: boolean;
  title: string;
  width?: number;
  height?: number;
  onClick: () => void;
  onCancel: () => void;
}> = ({ children, title, onClick, onCancel, width, height, shown }) => {
  const parentDiv = useRef<HTMLDivElement>(null);
  const appended = useRef(false);
  const [show, setShow] = useState(false);

  const sizeOverride = css({
    width,
    height,
  });

  const modalRootRef = useRef<HTMLElement | null>(
    document.getElementById('modal-root'),
  );

  const mainDivRef = useRef<HTMLDivElement>(document.createElement('div'));

  const getModalRoot = useCallback(() => {
    const modalRoot = modalRootRef.current;
    if (!modalRoot) {
      throw new Error('No modal-root exists!');
    }
    return modalRoot;
  }, []);

  useEffect(() => {
    const mainDiv = mainDivRef.current;
    return () => {
      const modalRoot = getModalRoot();
      if (
        modalRoot &&
        mainDiv &&
        Array.from(modalRoot.childNodes).includes(mainDiv)
      ) {
        modalRoot.removeChild(mainDiv);
      }
    };
  }, [getModalRoot, shown]);

  const transitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  useEffect(() => {
    if (shown) {
      const mainDiv = mainDivRef.current;
      const modalRoot = getModalRoot();
      modalRoot.appendChild(mainDiv);
      appended.current = true;
      setShow(true);
      parentDiv.current && parentDiv.current.focus();
      return () => {
        setShow(false);
      };
    }
  }, [getModalRoot, shown]);

  const keyHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (shown && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onCancel();
    }
  };
  const modalBody = transitions(
    (props, item) =>
      item && (
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
                <P10Button minimal faIconDef={faTimes} onClick={onClick} />
              </div>
            </div>
            <div className="modalBody">{children}</div>
          </div>
        </animated.div>
      ),
  );

  return createPortal(modalBody, mainDivRef.current);
};

export default Modal;
