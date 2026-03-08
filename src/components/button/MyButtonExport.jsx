import { Button } from "react-bootstrap";

const MyButtonExport = ({ onClick }) => {
  return (
    <Button variant="success" onClick={onClick} size="sm">
      <i className="bi bi-download me-2"></i>
      Export
    </Button>
  );
};
export default MyButtonExport;
