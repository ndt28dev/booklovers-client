import { useDispatch, useSelector } from "react-redux";
import MyButtonCreate from "../../../../../../../components/button/MyButtonCreate";
import MyDataTable from "../../../../../../../components/mytable/MyDataTable";
import { useEffect, useState } from "react";
import {
  deleteChatOption,
  fetchChatOptions,
  resetDeleteChat,
} from "../../../../../../../redux/slices/chatOptionSlice";
import MyButtonUpdate from "../../../../../../../components/button/MyButtonUpdate";
import MyButtonDelete from "../../../../../../../components/button/MyButtonDelete";
import CreateUpdateChatOption from "./crud/CreateUpdateChatOption";
import { Button } from "react-bootstrap";
import ChatCategoryPage from "./ChatCategoryPage";
import { toast } from "react-toastify";

const ChatOptionsPage = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenChatCategory, setIsOpenChatCategory] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);

  const { data, pagination } = useSelector(
    (state) => state.chatOption.listChat
  );
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  const deleteState = useSelector((state) => state.chatOption.deleteChat);

  useEffect(() => {
    dispatch(
      fetchChatOptions({
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
    setDataSelected(null);
  };

  const handleUpdate = (dataSelected) => {
    setIsOpen(true);
    setIsCheck(true);
    setDataSelected(dataSelected);
  };

  const handleOpenChatCategory = () => {
    setIsOpenChatCategory(true);
  };

  const columns = [
    { title: "STT", style: { width: "3%", textAlign: "center" } },
    { title: "Câu hỏi", style: { width: "30%" } },
    { title: "Câu trả lời" },
    { title: "Thể loại", style: { width: "18%" } },
    { title: "Thao tác", style: { width: "12%", textAlign: "center" } },
  ];

  const renderRow = (chatOption, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{chatOption.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>
      <td className="align-middle">{chatOption.question}</td>
      <td className="align-middle">{chatOption.answer}</td>
      <td className="align-middle">{chatOption.category_name}</td>
      <td className="text-center align-middle">
        <MyButtonUpdate onClick={() => handleUpdate(chatOption)} />
        <MyButtonDelete
          onClick={async () => {
            if (window.confirm("Bạn có chắc muốn xoá?")) {
              await dispatch(deleteChatOption(chatOption.id));
            }
          }}
        />
      </td>
    </tr>
  );

  useEffect(() => {
    if (deleteState.success) {
      toast.success("Xoá bộ câu hỏi thành công!");
      dispatch(resetDeleteChat());
      dispatch(fetchChatOptions({ page: currentPage, limit: 10 }));
    } else if (deleteState.error) {
      toast.error(deleteState.error?.message || deleteState.error);
    }
  }, [deleteState.error, deleteState.success]);

  return (
    <>
      {isOpen && (
        <CreateUpdateChatOption
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={isCheck ? "Cập nhật bộ câu hỏi" : "Thêm mới bộ câu hỏi"}
          isCheck={isCheck}
          dataSelected={dataSelected}
          currentPage={currentPage}
        />
      )}
      {isOpenChatCategory && (
        <ChatCategoryPage
          isOpen={isOpenChatCategory}
          onClose={() => setIsOpenChatCategory(false)}
        />
      )}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 style={{ color: "#E35765" }}>Danh sách câu hỏi & câu trả lời</h5>
        <div className="d-flex align-items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleOpenChatCategory}
          >
            Quản lý danh mục chat
          </Button>
          <MyButtonCreate onClick={handleCreate} />
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
    </>
  );
};
export default ChatOptionsPage;
