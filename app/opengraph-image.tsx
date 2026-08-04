import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const photoBuffer = readFileSync(join(process.cwd(), "public", "professor-photo.jpg"));
  const photoDataUrl = `data:image/jpeg;base64,${photoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #0f4c5c 0%, #093543 100%)",
          fontFamily: "sans-serif"
        }}
      >
        <img
          src={photoDataUrl}
          width={630}
          height={630}
          style={{ objectFit: "cover", height: "100%", width: 504 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 56px",
            color: "#ffffff"
          }}
        >
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, lineHeight: 1.2 }}>
            Prof. Sergiy Sushkov
          </div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 18, color: "#f5d3b0" }}>
            Surgeon &amp; Oncologist · Kharkiv
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
