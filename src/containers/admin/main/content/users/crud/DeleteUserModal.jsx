import { Button, Col, Modal, Row } from "react-bootstrap";
import MyModal from "../../../../../../components/mymodal/MyModal";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  fetchAllUser,
  resetDeleteUserStatus,
} from "../../../../../../redux/slices/userSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const DeleteUserModal = ({ isOpen, onClose, id, currentPage }) => {
  const dispatch = useDispatch();

  const { isLoading, error, success } = useSelector(
    (state) => state.user.deleteUser
  );

  const handleSubmit = (s) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (success) {
      toast.success("Xoá người dùng thành công!");
      dispatch(resetDeleteUserStatus());
      dispatch(fetchAllUser({ page: currentPage, limit: 10 }));
      onClose();
    } else if (error) {
      toast.error(error);
    }
  }, [error, success]);

  return (
    <MyModal show={isOpen} handleClose={onClose} title={"Xác nhận xoá"}>
      <span>Bạn có chắc muốn xoá người dùng có id = {id} không?</span>
      <Row className="d-flex align-items-end justify-content-end mt-3">
        <Col md={4} className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onClose} size="sm">
            Huỷ
          </Button>
          <Button variant="danger" onClick={handleSubmit} size="sm">
            Xác nhận
          </Button>
        </Col>
      </Row>
    </MyModal>
  );
};
export default DeleteUserModal;
