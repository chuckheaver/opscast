/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bundle the USGS NED DEM with the /api/elevation serverless function
  // so the GeoTIFF is reachable at runtime on Vercel. Next's file tracer
  // can't follow the dynamic readdir + fromFile, so we list it explicitly.
  outputFileTracingIncludes: {
    "/api/elevation": ["./data/raw/*.tif"],
  },
};

export default nextConfig;
