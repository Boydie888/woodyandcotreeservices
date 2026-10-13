import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated brand card used for link previews. To use a real photo instead,
// delete this file and add app/opengraph-image.jpg (1200×630).
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#10291E",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 56,
              border: "5px solid #879B82",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 22, background: "#879B82", display: "flex" }} />
          </div>
          <div style={{ marginLeft: 20, fontSize: 34, fontWeight: 700, display: "flex" }}>
            {site.name}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.05, display: "flex" }}>
            Professional Tree Care.
          </div>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.05, display: "flex" }}>Done Right.</div>
          <div style={{ marginTop: 28, fontSize: 38, color: "#879B82", display: "flex" }}>
            {`Tree services in ${site.region}`}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
