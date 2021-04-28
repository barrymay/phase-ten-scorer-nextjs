import 'twin.macro';
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
      <div tw="flex justify-center">
        <P10Button minimal onClick={onConfirmModal}>
          YES
        </P10Button>
        <P10Button minimal tw="text-red-500 ml-1" onClick={onCloseModal}>
          NO
        </P10Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
