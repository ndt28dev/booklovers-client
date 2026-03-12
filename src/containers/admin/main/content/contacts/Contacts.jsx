import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../../../../redux/slices/contactSlice";
import MyLayoutAdmin from "../../../../../components/mylayout/MyLayoutAdmin";
import { Col } from "react-bootstrap";
import MyDataTable from "../../../../../components/mytable/MyDataTable";
import { formatDate } from "../../../../../utils/format";

const Contacts = () => {
  const dispatch = useDispatch();

  const { data, pagination } = useSelector(
    (state) => state.contact.listContact
  );
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination?.totalPages || 0;

  useEffect(() => {
    dispatch(
      fetchContacts({
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
    { title: "Họ và tên", style: { width: "16%" } },
    { title: "Email", style: { width: "10%" } },
    { title: "Số điện thoại", style: { width: "12%", textAlign: "center" } },
    { title: "Tin nhắn" },
    { title: "Ngày tạo", style: { width: "6%", textAlign: "center" } },
    // { title: "Thao tác", style: { width: "10%", textAlign: "center" } },
  ];

  const renderRow = (contact, index) => (
    <tr key={index}>
      <td className="text-center align-middle d-none">{contact.id}</td>
      <td className="text-center align-middle">
        {(page - 1) * limit + index + 1}
      </td>
      <td className="align-middle">{contact.name}</td>
      <td className="align-middle">{contact.email}</td>
      <td className="align-middle text-center">{contact.phone}</td>
      <td className="align-middle text-center">{contact.message}</td>
      <td className="align-middle text-center">
        {formatDate(contact.created_at)}
      </td>
    </tr>
  );

  return (
    <MyLayoutAdmin title="Danh sách phản hồi">
      <div style={{ minHeight: "722px" }}>
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
  );
};

export default Contacts;
