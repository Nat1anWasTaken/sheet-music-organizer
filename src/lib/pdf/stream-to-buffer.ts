import { Readable } from "stream";

/**
 * Converts a Readable Stream into a Buffer.
 * @param stream The Readable Stream to convert.
 * @returns A Promise that resolves to a Buffer containing the stream's data.
 */
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk as Buffer));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}