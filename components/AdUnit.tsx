"use client";

// Renders a single Adsterra banner creative inside its own isolated iframe
// (via srcDoc) so its `atOptions` global never collides with any other ad
// unit rendered elsewhere on the same page.
export default function AdUnit({
  adKey,
  width,
  height,
  className = "",
}: {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}) {
  const srcDoc = `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden;}</style></head><body>
<script>
  atOptions = {
    'key' : '${adKey}',
    'format' : 'iframe',
    'height' : ${height},
    'width' : ${width},
    'params' : {}
  };
<\/script>
<script src="https://interventioncopiedloitering.com/${adKey}/invoke.js"><\/script>
</body></html>`;

  return (
    <iframe
      key={adKey}
      srcDoc={srcDoc}
      width={width}
      height={height}
      style={{ border: "none", maxWidth: "100%" }}
      scrolling="no"
      title="Advertisement"
      className={className}
    />
  );
}
