import { NoiseFunction2D, createNoise2D } from "simplex-noise";

import "./style.css";

const canvas = document.getElementById("texture") as HTMLCanvasElement;
const width = canvas.width;
const height = canvas.height;

let noiseParams: GetNoiseOptions = {
  persistance: 1,
  octaves: 3,
  lacunarity: 2,
  exponent: 2
};

interface GetNoiseOptions {
  persistance: number;
  lacunarity: number;
  exponent: number;
  octaves: number;
}

const getNoise = (x: number, y: number, noiseFunc: NoiseFunction2D, options: GetNoiseOptions): number => {
  const { persistance, lacunarity, exponent, octaves } = options;
  const G = Math.pow(2, -persistance);

  let amplitude = 1.0;
  let frequency = 1.0;
  let normalization = 0;
  let total = 0;
  for (let o = 0; o < octaves; o++) {
    const nv = noiseFunc(x * frequency, y * frequency) * 0.5 + 0.5;
    total += nv * amplitude;

    normalization += amplitude;
    amplitude *= G;
    frequency *= lacunarity;
  }

  return Math.pow(total / normalization, exponent);
}

const generateNoise = () => {
  const context = canvas!.getContext("2d");
  const imageData = context!.createImageData(width, height);
  const data = imageData.data;

  const noise2D = createNoise2D();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = x / width - 0.5;
      const ny = y / height - 0.5;

      const n = getNoise(nx, ny, noise2D, noiseParams);

      const index = (x + y * width) * 4;
      const c = n * 255;      // Colour value
      data[index] = c;        // R
      data[index + 1] = c;    // G
      data[index + 2] = c;    // B
      data[index + 3] = 255;  // A
    }
  }

  context!.putImageData(imageData, 0, 0);
}

const controlOctaves = document.querySelector("input[name='octaves']") as HTMLInputElement;
controlOctaves.value = noiseParams.octaves.toString();

const controlPersistance = document.querySelector("input[name='persistance']") as HTMLInputElement;
controlPersistance.value = noiseParams.persistance.toString();

const controlLacunarity = document.querySelector("input[name='lacunarity']") as HTMLInputElement;
controlLacunarity.value = noiseParams.lacunarity.toString();

const controlExponent = document.querySelector("input[name='exponent']") as HTMLInputElement;
controlExponent.value = noiseParams.exponent.toString();

const generateButton = document.getElementById("generate") as HTMLButtonElement;
generateButton!.addEventListener("click", () => {
  const octaves = parseInt(controlOctaves.value);
  const persistance = parseInt(controlPersistance.value);
  const lacunarity = parseInt(controlLacunarity.value);
  const exponent = parseInt(controlExponent.value);

  noiseParams = {
    octaves: isNaN(octaves) ? noiseParams.octaves : octaves,
    persistance: isNaN(persistance) ? noiseParams.persistance : persistance,
    lacunarity: isNaN(lacunarity) ? noiseParams.lacunarity : lacunarity,
    exponent: isNaN(exponent) ? noiseParams.exponent : exponent,
  };

  generateButton.disabled = true;
  generateNoise();
  generateButton.disabled = false;
}, false);
window.onload = () => {
  generateNoise();
}
