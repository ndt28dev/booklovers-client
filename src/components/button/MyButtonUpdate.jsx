import { Button } from "react-bootstrap";

const MyButtonUpdate = ({ onClick }) => {
  return (
    <Button className="me-2" variant="warning " onClick={onClick} size="sm">
      <i className="bi bi-pencil-square"></i>
    </Button>
  );
};
export default MyButtonUpdate;
