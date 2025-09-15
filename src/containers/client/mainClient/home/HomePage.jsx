import React from "react";
import Introduce from "./introduce/Introduce";
import BookBanner from "./bookbanner/BookBanner";
import BlogBanner from "./blogbanner/BlogBanner";
import AboutBanner from "./aboutbanner/AboutBanner";
import StoreBanner from "./storebanner/StoreBanner";

const HomePage = () => {
  return (
    <div>
      <Introduce />
      <BookBanner />
      <BlogBanner />
      <AboutBanner />
      <StoreBanner />
    </div>
  );
};

export default HomePage;
