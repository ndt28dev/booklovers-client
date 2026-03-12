import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPromotion } from "../../../../../redux/slices/promotionSlice";
import MyDataTable from "../../../../../components/mytable/MyDataTable";
import MyLayoutAdmin from "../../../../../components/mylayout/MyLayoutAdmin";
import MyButtonCreate from "../../../../../components/button/MyButtonCreate";
import MyButtonExport from "../../../../../components/button/MyButtonExport";
import { Badge, Col, Form } from "react-bootstrap";
import { formatDate } from "../../../../../utils/format";
import MyButtonUpdate from "../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../components/button/MyButtonDelete";
import CreateUpdatePromotionModal from "./crud/CreateUpdatePromotionModal";
import ExportPromotionModal from "./crud/ExportPromotionModal";

const Promotions = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isOpenExport, setIsOpenExport] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);

  const { listPromotion, error, pagination } = useSelector(
    (state) => state.promotion.listState
  );

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    dispatch(
      fetchAllPromotion({
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

  const handleCreate = () => {
    setIsOpen(true);
    setIsCheck(false);
  };

  const handleUpdate = (dataSelected) => {
    setIsOpen(true);
    setIsCheck(true);
    setDataSelected(dataSelected);
  };

  const handleDelete = (dataSelected) => {
    setIsOpenDelete(true);
    setDataSelected(dataSelected);
  };

  const handleImport = () => {
    setIsOpenImport(true);
  };

  const handleExport = () => {
    setIsOpenExport(true);
  };

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Code", style: { width: "10%" } },
    { title: "Mô tả" },
    { title: "Loại", style: { width: "5%", textAlign: "center" } },
    { title: "Giá trị", style: { width: "6%" } },
    { title: "Ngày BĐ", style: { width: "8%", textAlign: "center" } },
    { title: "Ngày KT", style: { width: "8%", textAlign: "center" } },
    { title: "Trạng thái", style: { width: "10%", textAlign: "center" } },
    { title: "SL", style: { width: "5%", textAlign: "center" } },
    { title: "SLĐD", style: { width: "5%", textAlign: "center" } },
    { title: "Thao tác", style: { width: "8%", textAlign: "center" } },
  ];

  const renderRow = (promotion, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{promotion.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>
      <td className="align-middle">{promotion.code}</td>
      <td className="align-middle">{promotion.description}</td>
      <td className="align-middle text-center">
        {promotion.discount_type === "percent" && (
          <Badge bg="success"> %</Badge>
        )}
        {promotion.discount_type === "amount" && <Badge bg="info">VNĐ</Badge>}
      </td>
      <td className="align-middle text-right">{promotion.discount_value}</td>
      <td className="align-middle text-center">
        {formatDate(promotion.start_date)}
      </td>{" "}
      <td className="align-middle text-center">
        {formatDate(promotion.end_date)}
      </td>
      <td className="align-middle text-center">
        {promotion.is_active === 1 ? (
          <Badge bg="success">Đang hoạt động</Badge>
        ) : (
          <Badge bg="danger">Hết hạn</Badge>
        )}
      </td>
      <td className="align-middle text-center">{promotion.usage_limit}</td>
      <td className="align-middle text-center">{promotion.used_count}</td>
      <td className="text-center align-middle">
        <MyButtonUpdate onClick={() => handleUpdate(promotion)} />
        <MyButtonDelete onClick={() => handleDelete(promotion)} />
      </td>
    </tr>
  );

  return (
    <>
      {isOpen && (
        <CreateUpdatePromotionModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={isCheck ? "Cập nhật khuyến mãi" : "Thêm mới khuyến mãi"}
          isCheck={isCheck}
          dataSelected={dataSelected}
          currentPage={currentPage}
        />
      )}
      {/* {isOpenDelete && (
        <DeletePromotionModal
          isOpen={isOpenDelete}
          onClose={() => setIsOpenDelete(false)}
          id={dataSelected?.id}
          currentPage={currentPage}
        />
      )} */}
      {isOpenExport && (
        <ExportPromotionModal
          isOpen={isOpenExport}
          onClose={() => setIsOpenExport(false)}
          list={listPromotion}
        />
      )}
      <MyLayoutAdmin title="Danh sách khuyến mãi">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Col className="d-flex align-items-center  gap-3">
            <MyButtonCreate onClick={handleCreate} />
            {/* <MyButtonImport onClick={handleImport} /> */}
            <MyButtonExport onClick={handleExport} />
          </Col>
          {/* <div className="d-flex align-items-center" style={{ gap: "20px" }}>
            <Form.Select
              value={featured}
              onChange={(e) => {
                setFeatured(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: "150px", height: "38px" }}
            >
              <option value="">Tất cả</option>
              <option value="1">Nổi bật</option>
              <option value="0">Không nổi bật</option>
            </Form.Select>

            <div className="d-flex align-items-center">
              <Form.Label className="mb-0 me-2 text-nowrap">
                Tìm kiếm
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div> */}
        </div>
        <div style={{ minHeight: "722px" }}>
          <MyDataTable
            columns={columns}
            data={listPromotion}
            renderRow={renderRow}
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </MyLayoutAdmin>
    </>
  );
};

export default Promotions;
