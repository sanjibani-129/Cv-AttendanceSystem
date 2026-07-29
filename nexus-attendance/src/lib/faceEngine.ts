"use client";

import * as faceapi from "face-api.js";

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

/**
 * Loads the face-api.js models from /public/models. Safe to call from
 * multiple components; the actual network fetch only happens once.
 *
 * NOTE: the weight files themselves are NOT included in this repo (they're
 * ~6MB of binary shards). Download them once from the face-api.js weights
 * folder and drop them into public/models/ — see public/models/README.md.
 */
export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return;
  if (loadingPromise) return loadingPromise;

  const MODEL_URL = "/models";
  loadingPromise = Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]).then(() => {
    modelsLoaded = true;
  });

  return loadingPromise;
}

export interface DetectedFace {
  descriptor: Float32Array;
  box: { x: number; y: number; width: number; height: number };
}

/**
 * Runs detection + landmarks + a 128-value descriptor for the most
 * prominent face in a video frame. Returns null if no face is found.
 */
export async function detectSingleFace(
  input: HTMLVideoElement
): Promise<DetectedFace | null> {
  const result = await faceapi
    .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!result) return null;

  return {
    descriptor: result.descriptor,
    box: {
      x: result.detection.box.x,
      y: result.detection.box.y,
      width: result.detection.box.width,
      height: result.detection.box.height,
    },
  };
}

export function euclideanDistance(a: number[] | Float32Array, b: number[] | Float32Array) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export interface MatchCandidate {
  id: string;
  name: string;
  roll_no: string;
  descriptors: number[][]; // every captured sample for this member, not an average
}

export interface MatchResult {
  member: MatchCandidate;
  distance: number;
  confidence: number; // 0-100, derived from distance
}

/**
 * Compares a live descriptor against every sample of every registered
 * member and returns the closest single match, or null if nothing clears
 * the threshold. Matching against each stored sample individually (instead
 * of an averaged descriptor) is what face-api.js's own FaceMatcher does —
 * averaging embeddings together tends to produce a "blurred" vector that's
 * farther from any real live frame than a genuine sample would be.
 */
export function matchFace(
  liveDescriptor: Float32Array,
  candidates: MatchCandidate[],
  // face-api.js's own docs use 0.6 as the standard euclidean-distance cutoff
  // for its 128-d descriptors; 0.5 was stricter than recommended and could
  // reject genuine matches.
  threshold = Number(process.env.NEXT_PUBLIC_FACE_MATCH_THRESHOLD ?? 0.6)
): MatchResult | null {
  let best: MatchResult | null = null;

  for (const candidate of candidates) {
    for (const sample of candidate.descriptors) {
      const distance = euclideanDistance(liveDescriptor, sample);
      if (!best || distance < best.distance) {
        const confidence = Math.max(0, 1 - distance / 1.0) * 100;
        best = { member: candidate, distance, confidence };
      }
    }
  }

  if (best && best.distance <= threshold) return best;
  return null;
}

/** Converts captured Float32Array samples to plain arrays for JSON storage. */
export function toStoredSamples(descriptors: Float32Array[]): number[][] {
  return descriptors.map((d) => Array.from(d));
}