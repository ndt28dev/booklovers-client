import MyModal from "../../../../../../components/mymodal/MyModal";

const Supplier = ({ isOpen, onClose }) => {
  return (
    <MyModal
      show={isOpen}
      handleClose={onClose}
      title={"Danh sách nhà cung cấp"}
      size="lg"
    >
      123
    </MyModal>
  );
};
export default Supplier;
