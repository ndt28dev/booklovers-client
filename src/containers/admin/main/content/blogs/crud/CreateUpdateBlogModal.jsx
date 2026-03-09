import { useDispatch } from "react-redux";
import MyModal from "../../../../../../components/mymodal/MyModal";

const CreateUpdateBlogModal = ({
  isOpen,
  onClose,
  title,
  isCheck = false,
  dataSelected,
  currentPage,
}) => {
  const dispatch = useDispatch();

  //   const { isLoading, error, success } = useSelector(
  //     (state) => state.user.createUser
  //   );

  //   const {
  //     isLoading: isLoadingUpdate,
  //     error: errorUpdate,
  //     success: successUpdate,
  //   } = useSelector((state) => state.user.updateUser);

  return (
    <MyModal show={isOpen} handleClose={onClose} title={title} size="md">
      123
    </MyModal>
  );
};
export default CreateUpdateBlogModal;
