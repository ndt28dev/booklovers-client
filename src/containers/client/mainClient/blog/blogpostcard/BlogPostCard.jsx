import React from "react";
import { Card } from "react-bootstrap";
import ButtonCustom from "../../../../../components/button/ButtonCustom";
import "./BlogPostCard.scss";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../../../config/api";

const BlogPostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Text
          style={{
            color: "#a7a7a7",
            fontSize: "12px",
            padding: "5px 0",
            margin: "0",
            fontWeight: "500",
          }}
          className="text-muted"
        >
          {new Date(post.date).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Card.Text>
        <Card.Title
          style={{ color: "#222", height: "45px", overflow: "hidden" }}
        >
          {post.title}
        </Card.Title>
        <Card.Text
          style={{
            fontSize: "12px",
            color: "#757575",
            fontStyle: "italic",
            fontWeight: "500",
          }}
        >
          {post.author}
        </Card.Text>
        <Card.Img
          variant="top"
          src={`${API_URL}/blogs/${post.image}`}
          style={{ height: "150px", objectFit: "cover", margin: "10px 0 20px" }}
        />
        <Card.Text style={{ color: "#757575" }} className="card-description">
          {post.description}
        </Card.Text>
        <ButtonCustom
          text="Xem chi tiết →"
          onClick={() => {
            navigate(`/bai-viet/chi-tiet-bai-viet/${post.id}`);
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default BlogPostCard;
