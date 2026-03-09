import { Button, Row, Col } from "react-bootstrap";
import MyModal from "../../../../../../components/mymodal/MyModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDate } from "../../../../../../utils/format";

const ExportBookModal = ({ isOpen, onClose, list }) => {
  const handleExport = () => {
    if (!list || list.length === 0) {
      alert("Không có dữ liệu để export");
      return;
    }

    const exportData = list.map((book, index) => ({
      STT: index + 1,
      "Tên sản phẩm": book.name,
      "Danh mục": book.category.name,
      "Thể loại": book.subcategory.name,
      "Giá bán": book.price,
      "% Giảm": book.discount,
      "Mã vạch": book.book_detail.barcode,
      "Nhà cung cấp": book.book_detail.supplier_name,
      "Tác giả": book.book_detail.authors,
      "Nhà xuất bản": book.book_detail.publisher,
      "Năm xuất bản": book.book_detail.published_year,
      "Ngôn ngữ": book.book_detail.language,
      "Cân nặng (g)": book.book_detail.weight_gram,
      "Số trang": book.book_detail.dimensions,
      "Kích thước": book.book_detail.page_count,
      "Loại bìa": book.book_detail.cover_type,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Books");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "books.xlsx");

    onClose();
  };

  return (
    <MyModal show={isOpen} handleClose={onClose} title="Xác nhận " size="md">
      <span>Bạn có chắc chắn muốn xuất danh sách sản phẩm không?</span>

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
export default ExportBookModal;
