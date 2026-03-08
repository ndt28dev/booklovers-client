import { useRef } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

const MyButtonImport = ({ onClick }) => {
  return (
    <>
      <Button variant="secondary" onClick={onClick} size="sm">
        <i className="bi bi-upload me-2"></i>
        Import
      </Button>
    </>
  );
};
export default MyButtonImport;
