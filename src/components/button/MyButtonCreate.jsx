import { Button } from "react-bootstrap";

const MyButtonCreate = ({ onClick }) => {
  return (
    <Button variant="primary" onClick={onClick} size="sm">
      <i className="bi bi-plus me-2"></i>Thêm
    </Button>
  );
};
export default MyButtonCreate;
