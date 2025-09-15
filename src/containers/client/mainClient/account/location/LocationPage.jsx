import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import ButtonCustom from "../../../../../components/button/ButtonCustom";
import AddLocation from "../../../../../components/addlocation/AddLocation";
import "./LocationPage.scss";
import {
  getUserWithAddress,
  setDefaultAddress,
  deleteUserAddress,
  resetDefaultAddressStatus,
  resetDeleteressStatus,
} from "../../../../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LocationPage = () => {
  const dispatch = useDispatch();

  const { user, addresses } = useSelector((state) => state.user.profile);
  const { success } = useSelector((state) => state.user.deleteAddress);
  const { success: successUpDefault } = useSelector(
    (state) => state.user.updateDefaultAddress
  );

  const [itemUpAddress, setItemUpAddress] = useState();

  useEffect(() => {
    dispatch(getUserWithAddress());
  }, []);

  useEffect(() => {
    if (success) {
      toast.success("Xoá địa chỉ thành công!", {
        autoClose: 1000,
        onClose: () => dispatch(resetDeleteressStatus()),
      });
      dispatch(getUserWithAddress());
    }
  }, [success]);

  useEffect(() => {
    if (successUpDefault) {
      toast.success("Thiết lập mặc định thành công!", {
        autoClose: 1000,
        onClose: () => dispatch(resetDefaultAddressStatus()),
      });
      dispatch(getUserWithAddress());
    }
  }, [successUpDefault]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (id) => {
    dispatch(deleteUserAddress(id));
  };

  const handleSetDefault = (id) => {
    dispatch(setDefaultAddress(id));
  };

  const handleEdit = (item) => {
    setShowAddModal(true);
    setItemUpAddress(item);
  };

  const hanldeShowFormAdd = () => {
    setShowAddModal(true);
    setItemUpAddress({});
  };

  const hanldeCloseFormAdd = () => {
    setShowAddModal(false);
  };

  return (
    <>
      <AddLocation
        show={showAddModal}
        handleClose={hanldeCloseFormAdd}
        itemUpAddress={itemUpAddress}
        user={user}
      />
      <Card style={{ borderRadius: "5px" }} className="border-0 p-3">
        <Row className="align-items-center mb-3">
          <Col>
            <h5 className="mb-0">Địa chỉ của tôi</h5>
          </Col>
          <Col xs="auto">
            <ButtonCustom
              text="Thêm địa chỉ mới"
              icon="bi bi-plus-lg me-2"
              bgrColor="#E35765"
              onClick={hanldeShowFormAdd}
            />
          </Col>
        </Row>

        {addresses.length === 0 ? (
          <div
            className="text-center text-muted"
            style={{ userSelect: "none" }}
          >
            <i className="bi bi-geo-alt-fill me-2"></i>
            Chưa có địa chỉ nào
          </div>
        ) : (
          addresses.map((item, index) => (
            <Card
              key={item.id}
              className={index === addresses.length - 1 ? "" : "mb-3"}
            >
              <Card.Body className="p-2 border-bottom">
                <Row>
                  <Col md={10}>
                    <h6 className="mb-2">
                      {item.fullname}{" "}
                      {item.is_default ? (
                        <span className="text-success ms-2">
                          <i className="bi bi-check-circle"></i> Địa chỉ mặc
                          định
                        </span>
                      ) : (
                        ""
                      )}
                    </h6>
                    <div className="mb-1">
                      <span className="text-muted">Địa chỉ: </span>
                      <span className="fw-semibold">{item.address}</span>
                    </div>
                    <div>
                      <span className="text-muted">Điện thoại: </span>
                      <span className="fw-semibold">{item.phone}</span>
                    </div>
                  </Col>
                  <Col md={2} className="text-end">
                    <div className="d-flex flex-column align-items-end gap-1">
                      {!item.is_default && (
                        <Button
                          variant="link"
                          className="p-0 text-decoration-none btn-no-underline text-success"
                          onClick={() => handleSetDefault(item.id)}
                        >
                          Thiết lập mặc định
                        </Button>
                      )}
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none btn-no-underline"
                        onClick={() => handleEdit(item)}
                      >
                        Chỉnh sửa
                      </Button>
                      {!item.is_default && (
                        <Button
                          variant="link"
                          className="p-0 text-decoration-none btn-no-underline text-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Xoá
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </Card>
    </>
  );
};

export default LocationPage;
