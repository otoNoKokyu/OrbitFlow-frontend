import React from 'react';
import '../../../css/components/Modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

type ModalProps = {
  submitFn?: () => void;
  closeModal: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ closeModal, children }) => {
  return (
    <div className='overlay'>
      <div className="modal-container">
        <div onClick={closeModal} className="modal-header">
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <div className='children'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
