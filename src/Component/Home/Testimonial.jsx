import React from "react";

const Testimonial = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Left Side - Image */}
      <div style={{ flex: 1, position: "relative" }}>
        <img
          src="/mnt/data/drop.png" // Replace with actual file path for the dropper image
          alt="Skincare Product"
          style={{ borderRadius: "8px", width: "100%", maxWidth: "400px" }}
        />
        <img
          src="/mnt/data/image.png" // Replace with actual file path for decorative flower
          alt="Decorative Flower"
          style={{
            position: "absolute",
            top: "10px",
            left: "-20px",
            width: "150px",
            height: "auto",
          }}
        />
      </div>

      {/* Right Side - Text */}
      <div style={{ flex: 2, paddingLeft: "40px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
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
            src="/mnt/data/user1.jpg" // Replace with actual file path for user image
            alt="Client Avatar"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              marginRight: "15px",
            }}
          />
          <div>
            <p style={{ margin: 0, fontWeight: "bold" }}>Itadori Yuji</p>
            <p style={{ margin: 0, color: "#888" }}>Japan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
