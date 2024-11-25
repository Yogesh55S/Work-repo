import React from "react";
import Arrow from "../../assets/svg/arrow.svg"; // Replace with actual path
import BigRose from "../../assets/svg/bigrose.svg"; // Replace with actual path
import Rose from "../../assets/svg/rose.svg"; // Replace with actual path

const Testimonial = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Left Side - Image */}
      <div style={{ flex: 1, position: "relative" }}>
        <img
          src="path/to/your-image.png" // Replace with your image path
          alt="Skincare Product"
          style={{ borderRadius: "8px", width: "100%", maxWidth: "400px" }}
        />
        <img
          src={BigRose}
          alt="Decorative Flower"
          style={{ position: "absolute", top: "10px", left: "10px", width: "100px" }}
        />
      </div>

      {/* Right Side - Text */}
      <div style={{ flex: 2, paddingLeft: "40px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
          <img src={Arrow} alt="Arrow Icon" style={{ marginRight: "10px", verticalAlign: "middle" }} />
          What Our Clients Are Saying About Skin Care
        </h2>
        <blockquote style={{ fontSize: "16px", fontStyle: "italic", margin: "20px 0", color: "#555" }}>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque ac urna at
            malesuada. Nunc mattis cursus massa, non facilisis nisi ultricies id."
          </p>
        </blockquote>
        <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
          <img
            src="path/to/profile-image.jpg" // Replace with actual path
            alt="Client Avatar"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              marginRight: "15px",
            }}
          />
          <div>
            <p style={{ margin: 0, fontWeight: "bold" }}>Itadori Yuji</p>
            <p style={{ margin: 0, color: "#888" }}>Japan</p>
          </div>
        </div>
        <img src={Rose} alt="Small Rose" style={{ marginTop: "20px", width: "50px" }} />
      </div>
    </div>
  );
};

export default Testimonial;
