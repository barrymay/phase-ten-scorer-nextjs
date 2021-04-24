/* @jsx jsx */
import { jsx, css } from '@emotion/react';
import P10Button from './button/P10Button';
import Modal from './Modal';

const ConfirmModal: React.FC<{
  modalTitle: string;
  isShown: boolean;
  onConfirmModal: VoidFunction;
  onCloseModal: VoidFunction;
}> = ({ modalTitle, isShown, onConfirmModal, onCloseModal, children }) => {
  return (
    <Modal
      shown={isShown}
      title={modalTitle}
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
