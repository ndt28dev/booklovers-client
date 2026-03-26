import React, { use, useEffect, useState } from "react";
import { Form, Button, Image } from "react-bootstrap";
import MyModal from "../../../../components/mymodal/MyModal";
import {
  createReview,
  resetCreateReview,
} from "../../../../redux/slices/reviewSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getUserWithAddress } from "../../../../redux/slices/userSlice";
import { getUserOrders } from "../../../../redux/slices/orderSlice";

const ReviewForm = ({ isOpen, onClose, productId, orderItemId }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const { success, error } = useSelector((state) => state.review.createReview);
  const { user } = useSelector((state) => state.user.profile);

  useEffect(() => {
    dispatch(getUserWithAddress());
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [images]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      alert("Vui lòng chọn số sao");
      return;
    }

    const data = new FormData();
    data.append("product_id", productId);
    data.append("user_id", user?.id);
    data.append("rating", rating);
    data.append("title", title);
    data.append("comment", comment);
    data.append("order_item_id", orderItemId);

    images.forEach((img) => {
      data.append("review", img);
    });

    try {
      await dispatch(createReview(data));

      // reset form
      setRating(0);
      setTitle("");
      setComment("");
      setImages([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (success) {
      toast.success("Đánh giá thành công!");
      dispatch(resetCreateReview());
      dispatch(getUserOrders());
      onClose();
    } else if (error) {
      toast.error(error?.message || error);
    }
  }, [error, success]);

  return (
    <MyModal show={isOpen} handleClose={onClose} title="Đánh giá sản phẩm">
      <Form onSubmit={handleSubmit} className="p-3 border rounded">
        <div className="mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                fontSize: "28px",
                cursor: "pointer",
                color: star <= (hover || rating) ? "#ffc107" : "#ccc",
              }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        <Form.Group className="mb-2">
          <Form.Label className="mb-0">Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tiêu đề..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label className="mb-0">Nhận xét</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Chia sẻ cảm nhận của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleImageChange}
          />
        </Form.Group>

        <div className="d-flex gap-2 mb-2">
          {images.map((file, index) => {
            const previewUrl = URL.createObjectURL(file);

            if (file.type.startsWith("image")) {
              return (
                <Image
                  key={index}
                  src={previewUrl}
                  width={80}
                  height={80}
                  thumbnail
                  style={{ objectFit: "cover" }}
                />
              );
            }

            if (file.type.startsWith("video")) {
              return (
                <video
                  key={index}
                  src={previewUrl}
                  width={80}
                  height={80}
                  controls
                  style={{ borderRadius: "6px", objectFit: "cover" }}
                />
              );
            }

            return null;
          })}
        </div>

        <div className="d-flex justify-content-end">
          <Button variant="success" type="submit" size="sm">
            Gửi đánh giá
          </Button>
        </div>
      </Form>
    </MyModal>
  );
};

export default ReviewForm;
