import { useDispatch, useSelector } from "react-redux";
import {
  deleteBlog,
  fetchAllBlog,
  resetDeleteBlogState,
} from "../../../../../../redux/slices/blogSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import MyModal from "../../../../../../components/mymodal/MyModal";
import { Button, Col, Row } from "react-bootstrap";

const DeleteBlogModal = ({ isOpen, onClose, id, currentPage }) => {
  const dispatch = useDispatch();

  const { isLoading, error, success } = useSelector(
    (state) => state.blog.deleteState
  );

  const handleSubmit = (s) => {
    dispatch(deleteBlog(id));
  };

  useEffect(() => {
    if (success) {
      toast.success("Xoá sản phẩm thành công!");
      dispatch(resetDeleteBlogState());
      dispatch(fetchAllBlog({ page: currentPage, limit: 10 }));
      onClose();
    } else if (error) {
      toast.error(error);
    }
  }, [error, success]);
  return (
    <MyModal show={isOpen} handleClose={onClose} title={"Xác nhận xoá"}>
      <span>Bạn có chắc muốn xoá bài viết có id = {id} không?</span>
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
export default DeleteBlogModal;
