import { Button, Row, Col } from "react-bootstrap";
import MyModal from "../../../../../../components/mymodal/MyModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDate } from "../../../../../../utils/format";

const ExportPromotionModal = ({ isOpen, onClose, list }) => {
  const handleExport = () => {
    if (!list || list.length === 0) {
      alert("Không có dữ liệu để export");
      return;
    }

    const exportData = list.map((promotion, index) => ({
      STT: index + 1,
      Code: promotion.code,
      "Mô tả": promotion.description,
      Loại: promotion.discount_type === "percent" ? "%" : "VNĐ",
      "Giá trị": promotion.discount_value,
      "Ngày bắt đầu": promotion.start_date,
      "Ngày kết thúc": promotion.end_date,
      "Trạng thái": promotion.is_active,
      "Số lượng": promotion.usage_limit,
      "Số lượng đã dùng": promotion.used_count,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Promotions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "promotions.xlsx");

    onClose();
  };

  return (
    <MyModal show={isOpen} handleClose={onClose} title="Xác nhận " size="md">
      <span>Bạn có chắc chắn muốn xuất danh sách khuyến mãi không?</span>

      <Row className="mt-3">
        <Col className="d-flex justify-content-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Huỷ
          </Button>

          <Button variant="success" size="sm" onClick={handleExport}>
            Export
          </Button>
        </Col>
      </Row>
    </MyModal>
  );
};
export default ExportPromotionModal;
