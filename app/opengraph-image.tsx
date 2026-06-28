import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#08090a",
          color: "#f5f5f7",
        }}
      >
        <div style={{ fontSize: 28, color: "#86868b", letterSpacing: 4 }}>XENTURYLENS</div>
        <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.05, marginTop: 24, maxWidth: 900 }}>
          Software built to last a hundred years.
        </div>
      </div>
    ),
    { ...size }
  );
}
