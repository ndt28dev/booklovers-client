import { data } from "react-router-dom";
import MyLayoutAdmin from "../../../../../../components/mylayout/MyLayoutAdmin";
import MyModal from "../../../../../../components/mymodal/MyModal";
import MyDataTable from "../../../../../../components/mytable/MyDataTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
  resetCreateSupplier,
  resetDeleteSupplier,
  resetUpdateSupplier,
  updateSupplier,
} from "../../../../../../redux/slices/supplierSlice";
import { formatDate } from "../../../../../../utils/format";
import MyButtonEye from "../../../../../../components/button/MyButtonEye";
import MyButtonUpdate from "../../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../../components/button/MyButtonDelete";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const Supplier = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [editingSupplier, setEditingSupplier] = useState(null);

  const { data, pagination } = useSelector((state) => state.supplier.suppliers);
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    dispatch(
      fetchSuppliers({
        page: currentPage,
        limit: 10,
      })
    );
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Nhà cung cấp", style: { width: "25%" } },
    { title: "Email", style: { width: "20%" } },
    { title: "SĐT", style: { width: "10%", textAlign: "center" } },
    { title: "Địa chỉ", style: { width: "25%" } },
    { title: "Thao tác", style: { width: "10%", textAlign: "center" } },
  ];

  const renderRow = (supplier, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{supplier.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>
      <td className="align-middle">{supplier.name}</td>
      <td className="align-middle">{supplier.email}</td>
      <td className="align-middle text-center">{supplier.phone}</td>
      <td className="align-middle">{supplier.address}</td>
      <td className="text-center align-middle">
        <MyButtonUpdate
          onClick={() => {
            setEditingSupplier(supplier);
            setForm({
              name: supplier.name,
              email: supplier.email,
              phone: supplier.phone,
              address: supplier.address,
            });
          }}
        />
        <MyButtonDelete
          onClick={async () => {
            if (window.confirm("Bạn có chắc muốn xoá?")) {
              await dispatch(deleteSupplier(supplier.id));
              dispatch(fetchSuppliers({ page: currentPage, limit: 10 }));
            }
          }}
        />
      </td>
    </tr>
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const { loading, success, error } = useSelector(
    (state) => state.supplier.createSupplier
  );

  const {
    loading: isLoadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.supplier.updateSupplier);

  const {
    loading: isLoadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.supplier.deleteSupplier);

  const validate = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Vui lòng nhập tên nhà cung cấp";
    if (!form.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!form.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^0\d{9}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)";
    }
    if (!form.address) newErrors.address = "Vui lòng nhập địa chỉ";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    let result;

    if (editingSupplier) {
      // UPDATE
      result = await dispatch(
        updateSupplier({
          id: editingSupplier.id,
          data: form,
        })
      );
    } else {
      // CREATE
      result = await dispatch(createSupplier(form));
    }
  };

  useEffect(() => {
    if (success) {
      toast.success("Thêm nhà cung cấp thành công!");
      dispatch(resetCreateSupplier());
      dispatch(fetchSuppliers({ page: currentPage, limit: 10 }));

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      setEditingSupplier(null); // reset mode
      setErrors({});
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, success]);

  useEffect(() => {
    if (successUpdate) {
      toast.success("Cập nhật nhà cung cấp thành công!");
      dispatch(resetUpdateSupplier());
      dispatch(fetchSuppliers({ page: currentPage, limit: 10 }));

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      setEditingSupplier(null); // reset mode
      setErrors({});
    } else if (errorUpdate) {
      toast.error(errorUpdate?.message || errorUpdate);
    }
  }, [errorUpdate, successUpdate]);

  useEffect(() => {
    if (successDelete) {
      toast.success("Xoá nhà cung cấp thành công!");
      dispatch(resetDeleteSupplier());
      dispatch(fetchSuppliers({ page: currentPage, limit: 10 }));
    } else if (errorDelete) {
      toast.error(errorDelete?.message || errorDelete);
    }
  }, [errorDelete, successDelete]);

  return (
    <MyModal
      show={isOpen}
      handleClose={onClose}
      title={"Danh sách nhà cung cấp"}
      size="xl"
    >
      <MyLayoutAdmin>
        <div className="mb-3">
          <Row>
            <Col md={6}>
              <label>Tên nhà cung cấp</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </Col>
            <Col md={6}>
              <label>Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="text-danger">{errors.email}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <label>Số điện thoại</label>
              <input
                type="text"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <div className="text-danger">{errors.phone}</div>
              )}
            </Col>
            <Col md={6}>
              <label>Địa chỉ</label>
              <input
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                name="address"
                value={form.address}
                onChange={handleChange}
              />
              {errors.address && (
                <div className="text-danger">{errors.address}</div>
              )}
            </Col>
          </Row>
          <div className="text-end  mt-2">
            <Button
              className="btn btn-secondary me-2"
              size="sm"
              onClick={() => {
                setEditingSupplier(null);
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  address: "",
                });
                setErrors({});
              }}
            >
              Huỷ
            </Button>
            <Button
              className="btn btn-success "
              onClick={handleSubmit}
              disabled={loading}
              size="sm"
            >
              Lưu
            </Button>
          </div>
        </div>
        <div>
          <MyDataTable
            columns={columns}
            data={data}
            renderRow={renderRow}
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </MyLayoutAdmin>
    </MyModal>
  );
};
export default Supplier;
