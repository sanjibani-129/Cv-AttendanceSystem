# Face-api.js model weights

This folder needs the following files from the face-api.js `weights` folder
(github.com/justadudewhohacks/face-api.js — path `weights/`):

```
tiny_face_detector_model-weights_manifest.json
tiny_face_detector_model-shard1
face_landmark_68_model-weights_manifest.json
face_landmark_68_model-shard1
face_recognition_model-weights_manifest.json
face_recognition_model-shard1
face_recognition_model-shard2
```

Download them and place them directly inside this `public/models/` folder
(no subfolders). They are loaded client-side by `src/lib/faceEngine.ts` via
`loadFromUri("/models")`.

Quick way to grab them (run locally, once, before your first `npm run dev`):

```bash
npx degit justadudewhohacks/face-api.js/weights public/models
```

They are binary and add ~6MB, which is why they aren't checked into this
repo — but they must be present (and later deployed to Vercel as static
assets in `public/`) for the Live Camera and Register flows to work.
