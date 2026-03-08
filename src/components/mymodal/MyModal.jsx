import { Modal, Button } from "react-bootstrap";

const MyModal = ({
  show,
  handleClose,
  title,
  children,
  centered = false,
  size = "md",
}) => {
  return (
    <Modal show={show} size={size} onHide={handleClose} centered={centered}>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "20px" }}>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default MyModal;
