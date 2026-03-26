import { Button } from "react-bootstrap";

const MyButtonHide = ({ isHidden = true, onClick }) => {
  const icon = isHidden ? "bi bi-eye" : "bi bi-eye-slash";
  const variant = isHidden ? "secondary" : "warning";

  return (
    <Button variant={variant} onClick={onClick} size="sm" className="me-2">
      <i className={icon}></i>
    </Button>
  );
};

export default MyButtonHide;
