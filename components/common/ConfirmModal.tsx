/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import P10Button from './button/P10Button';
import Modal from './Modal';

const ConfirmModal: React.FC<{
  isShown: boolean;
  onConfirmModal: VoidFunction;
  onCloseModal: VoidFunction;
}> = ({ isShown, onConfirmModal, onCloseModal, children }) => {
  return (
    <Modal
      shown={isShown}
      title="Remove Game?"
      onClick={onCloseModal}
      onCancel={onCloseModal}
      width={300}
    >
      {children}
      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        <P10Button minimal onClick={onConfirmModal}>
          YES
        </P10Button>
        <P10Button
          minimal
          css={css`
            color: red;
            margin-left: 10px;
          `}
          onClick={onCloseModal}
        >
          NO
        </P10Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
