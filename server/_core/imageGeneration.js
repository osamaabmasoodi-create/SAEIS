"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImage = generateImage;
exports.listImageModels = listImageModels;
/**
 * Image generation helper using internal ImageService
 *
 * Example usage:
 *   const { url: imageUrl } = await generateImage({
 *     prompt: "A serene landscape with mountains"
 *   });
 *
 * For editing:
 *   const { url: imageUrl } = await generateImage({
 *     prompt: "Add a rainbow to this landscape",
 *     originalImages: [{
 *       url: "https://example.com/original.jpg",
 *       mimeType: "image/jpeg"
 *     }]
 *   });
 */
const storage_1 = require("server/storage");
const env_1 = require("./env");
// Default model for generated sites. "MODEL_GPT_IMAGE_2" is the forge images.v1
// enum for GPT Image 2 (id: gpt-image-2). If omitted, forge falls back to Gemini 2.5 Flash.
const DEFAULT_IMAGE_MODEL = "MODEL_GPT_IMAGE_2";
const DEFAULT_IMAGE_QUALITY = "medium";
async function generateImage(options) {
    if (!env_1.ENV.forgeApiUrl) {
        throw new Error("BUILT_IN_FORGE_API_URL is not configured");
    }
    if (!env_1.ENV.forgeApiKey) {
        throw new Error("BUILT_IN_FORGE_API_KEY is not configured");
    }
    // Build the full URL by appending the service path to the base URL
    const baseUrl = env_1.ENV.forgeApiUrl.endsWith("/")
        ? env_1.ENV.forgeApiUrl
        : `${env_1.ENV.forgeApiUrl}/`;
    const fullUrl = new URL("images.v1.ImageService/GenerateImage", baseUrl).toString();
    const model = options.model ?? DEFAULT_IMAGE_MODEL;
    const quality = options.quality ?? (model === DEFAULT_IMAGE_MODEL ? DEFAULT_IMAGE_QUALITY : undefined);
    const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "connect-protocol-version": "1",
            authorization: `Bearer ${env_1.ENV.forgeApiKey}`,
        },
        body: JSON.stringify({
            prompt: options.prompt,
            original_images: options.originalImages || [],
            model,
            ...(quality ? { quality } : {}),
        }),
    });
    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Image generation request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`);
    }
    const result = (await response.json());
    const base64Data = result.image.b64Json;
    const buffer = Buffer.from(base64Data, "base64");
    // Save to S3
    const { url } = await (0, storage_1.storagePut)(`generated/${Date.now()}.png`, buffer, result.image.mimeType);
    return {
        url,
    };
}
/**
 * List the image models the internal ImageService currently supports.
 * Feed a returned `model` value into generateImage({ model }).
 */
async function listImageModels() {
    if (!env_1.ENV.forgeApiUrl) {
        throw new Error("BUILT_IN_FORGE_API_URL is not configured");
    }
    if (!env_1.ENV.forgeApiKey) {
        throw new Error("BUILT_IN_FORGE_API_KEY is not configured");
    }
    const baseUrl = env_1.ENV.forgeApiUrl.endsWith("/")
        ? env_1.ENV.forgeApiUrl
        : `${env_1.ENV.forgeApiUrl}/`;
    const fullUrl = new URL("images.v1.ImageService/ListModels", baseUrl).toString();
    const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "connect-protocol-version": "1",
            authorization: `Bearer ${env_1.ENV.forgeApiKey}`,
        },
        body: "{}",
    });
    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`List image models failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`);
    }
    const result = (await response.json());
    return { models: result.models ?? [] };
}
