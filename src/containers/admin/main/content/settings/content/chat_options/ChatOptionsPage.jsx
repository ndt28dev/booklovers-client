import MyButtonCreate from "../../../../../../../components/button/MyButtonCreate";

const ChatOptionsPage = () => {
  return (
    <>
      {/* {isOpen && (
        <CreateUpdateSupplier
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={isCheck ? "Cập nhật nhà cung cấp" : "Thêm mới nhà cung cấp"}
          isCheck={isCheck}
          dataSelected={dataSelected}
          currentPage={currentPage}
        />
      )} */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 style={{ color: "#E35765" }}>Danh sách câu hỏi & câu trả lời</h5>
        <MyButtonCreate />
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
    </>
  );
};
export default ChatOptionsPage;
