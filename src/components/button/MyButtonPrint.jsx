import { Button } from "react-bootstrap";

const MyButtonPrint = ({ onClick }) => {
  return (
    <Button className="me-2" variant="secondary " onClick={onClick} size="sm">
      <i className="bi bi-printer"></i>
    </Button>
  );
};
export default MyButtonPrint;
