import { CreateFileDTO } from '@modules/file/presenters/file.dto';
import { FileUpload } from 'graphql-upload';

export class FileUtils {
  static async createFile(file: FileUpload): Promise<CreateFileDTO> {
    if (file) {
      const base64 = await this.createBufferFromReadStreamFile(file);

      const { filename, mimetype, encoding } = await file;

      const key = `${Date.now()}-${filename}`;

      const newFile: CreateFileDTO = new CreateFileDTO({
        originalname: filename,
        fieldname: 'file',
        mimetype,
        encoding,
        buffer: base64,
        key,
      });

      return newFile;
    }
  }

  static async createBufferFromReadStreamFile(
    file: FileUpload,
  ): Promise<Buffer> {
    const { createReadStream } = file;

    const stream = createReadStream();
    const chunks = [];

    return await new Promise<Buffer>((resolve, reject) => {
      let buffer: Buffer;

      stream.on('data', function (chunk) {
        chunks.push(chunk);
      });

      stream.on('end', function () {
        buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      stream.on('error', reject);
    });
  }

  static async createBase64FromBuffer(file: FileUpload): Promise<string> {
    const buffer = await this.createBufferFromReadStreamFile(file);

    return buffer.toString('base64');
  }
}
