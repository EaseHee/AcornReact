import React from 'react';

function DeleteConfirmationModal({ selectedProductB, handleDeleteB, setShowDeleteBModal }) {
  return (
    <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">삭제 확인</h5>
            <button type="button" className="btn-close" onClick={() => setShowDeleteBModal(false)}></button>
          </div>

          <div className="modal-body">
            <p>정말로 '{selectedProductB.productBName}'을 삭제하시겠습니까?</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteBModal(false)}>
              취소
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDeleteB}>
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;