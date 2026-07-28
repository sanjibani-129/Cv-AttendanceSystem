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
  descriptor: number[];
}

export interface MatchResult {
  member: MatchCandidate;
  distance: number;
  confidence: number; // 0-100, derived from distance
}

/**
 * Compares a live descriptor against every registered member and returns
 * the closest match, or null if nothing clears the threshold.
 */
export function matchFace(
  liveDescriptor: Float32Array,
  candidates: MatchCandidate[],
  threshold = Number(process.env.NEXT_PUBLIC_FACE_MATCH_THRESHOLD ?? 0.5)
): MatchResult | null {
  let best: MatchResult | null = null;

  for (const candidate of candidates) {
    const distance = euclideanDistance(liveDescriptor, candidate.descriptor);
    if (!best || distance < best.distance) {
      const confidence = Math.max(0, (1 - distance / 1.0)) * 100;
      best = { member: candidate, distance, confidence };
    }
  }

  if (best && best.distance <= threshold) return best;
  return null;
}

/** Averages several descriptors captured during registration into one. */
export function averageDescriptors(descriptors: Float32Array[]): number[] {
  const length = descriptors[0].length;
  const avg = new Array(length).fill(0);
  for (const d of descriptors) {
    for (let i = 0; i < length; i++) avg[i] += d[i];
  }
  return avg.map((v) => v / descriptors.length);
}
