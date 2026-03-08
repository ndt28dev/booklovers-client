import { Button } from "react-bootstrap";

const MyButtonDelete = ({ onClick }) => {
  return (
    <Button variant="danger" onClick={onClick} size="sm">
      <i className="bi bi-trash"></i>
    </Button>
  );
};
export default MyButtonDelete;
