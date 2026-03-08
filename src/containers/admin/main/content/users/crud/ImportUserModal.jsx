import { useEffect, useRef, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import MyModal from "../../../../../../components/mymodal/MyModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUser,
  importUsers,
  resetImportUserStatus,
} from "../../../../../../redux/slices/userSlice";
import { toast } from "react-toastify";

const ImportUserModal = ({ isOpen, onClose, currentPage }) => {
  const dispatch = useDispatch();
  const fileRef = useRef();
  const [file, setFile] = useState(null);

  const { data, isLoading, success, error } = useSelector(
    (state) => state.user.importUser
  );

  const handleChooseFile = () => {
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast.error("Vui lòng chọn file");
      return;
    }

    dispatch(importUsers(file));
  };

  useEffect(() => {
    if (success) {
      console.log(data);
      toast.success("Import thành cong");
      dispatch(resetImportUserStatus());
      dispatch(fetchAllUser({ page: currentPage, limit: 10 }));
      onClose();
    } else if (error) {
      toast.error(error);
    }
  }, [success, error]);

  return (
    <MyModal show={isOpen} handleClose={onClose} title="Chọn file " size="md">
      <Form>
        <Form.Group>
          <Form.Label>Chọn file Excel</Form.Label>

          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              style={{ width: "100px" }}
              size="sm"
              onClick={handleChooseFile}
            >
              Chọn file
            </Button>

            <Form.Control
              type="text"
              value={file ? file.name : ""}
              placeholder="Chưa chọn file"
              readOnly
            />
          </div>

          <input
            type="file"
            accept=".xlsx,.csv"
            ref={fileRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-end mt-3 gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Huỷ
          </Button>

          <Button variant="success" size="sm" onClick={handleImport}>
            {isLoading ? <Spinner size="sm" animation="border" /> : "Import"}
          </Button>
        </div>
      </Form>
    </MyModal>
  );
};

export default ImportUserModal;
