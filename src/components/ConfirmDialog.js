import Image from 'next/image';
import PropTypes from 'prop-types';
import Modal from './Modal';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="flex flex-col gap-6">
        <p className="paragraph-regular text-dark300_light700">{message}</p>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isLoading} className="flex items-center gap-2 background-light800_dark300 text-dark300_light700 paragraph-medium px-4 py-2 rounded-lg transition-colors hover:text-primary-500 disabled:opacity-50">
            {cancelText || 'Cancel'}
          </button>

          <button type="button" onClick={onConfirm} disabled={isLoading} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white paragraph-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </>
            ) : (
              <>
                <Image src="/icons/trash.svg" alt="Delete" width={20} height={20} />
                {confirmText || 'Delete'}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isLoading: PropTypes.bool,
};

ConfirmDialog.defaultProps = {
  confirmText: 'Delete',
  cancelText: 'Cancel',
  isLoading: false,
};

export default ConfirmDialog;
