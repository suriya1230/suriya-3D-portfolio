# 🚗 How to Add Your 3D Car Model

## Quick Setup

1. Place your `.glb` file inside the `public/models/` folder:
   ```
   suriya-portfolio/
   └── public/
       └── models/
           └── car.glb     ← Your file goes here
   ```

2. That's it. The scene will automatically load it.

## Where to Find Free Car GLB Models

| Site | Quality | Notes |
|------|---------|-------|
| [Sketchfab.com](https://sketchfab.com/search?q=ferrari&type=models&features=downloadable) | ★★★★★ | Search "Ferrari SF90" — filter by Free + Downloadable |
| [Free3D.com](https://free3d.com) | ★★★☆☆ | Good selection, download as OBJ then convert |
| [CGTrader.com](https://cgtrader.com) | ★★★★☆ | Filter by Free + GLB format |
| [TurboSquid.com](https://turbosquid.com) | ★★★★☆ | Filter by Free |

## Recommended Sketchfab Search
```
https://sketchfab.com/search?q=ferrari+sf90&type=models&features=downloadable&sort_by=-relevance
```

## Convert OBJ/FBX to GLB (if needed)
Use **gltf.report** (online, free):
1. Go to https://gltf.report
2. Upload your OBJ / FBX file
3. Export as `.glb`
4. Place in `public/models/car.glb`

## How the Auto-Scaling Works
The scene automatically:
- Detects the bounding box of your model
- Scales it to fit a ~4.5 unit car size
- Centers it at the origin
- Rotates it to face forward

So ANY car GLB will work — the scale doesn't matter.

## If No Model Found
The scene falls back to a procedural Ferrari SF90 silhouette
built from Three.js geometry — it looks great and works everywhere.

## Performance Tips
- Keep GLB file under 15MB for smooth loading
- Sketchfab's "Download" button gives optimized files
- The `<Suspense fallback={<GeometryCar />}>` wrapper ensures
  the geometry car shows while your GLB loads
