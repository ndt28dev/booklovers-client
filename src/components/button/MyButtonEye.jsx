import { Button } from "react-bootstrap";

const MyButtonEye = ({ onClick }) => {
  return (
    <Button className="me-2" variant="success" onClick={onClick} size="sm">
      <i className="bi bi-eye"></i>
    </Button>
  );
};
export default MyButtonEye;
