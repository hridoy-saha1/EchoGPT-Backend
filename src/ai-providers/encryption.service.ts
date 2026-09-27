import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
    const encryptionKey = this.configService.get<string>(
      'AI_PROVIDER_ENCRYPTION_KEY',
    );

    if (!encryptionKey || !/^[0-9a-fA-F]{64}$/.test(encryptionKey)) {
      throw new Error(
        'AI_PROVIDER_ENCRYPTION_KEY must be a 64-character hexadecimal key',
      );
    }

    this.key = Buffer.from(encryptionKey, 'hex');
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.key,
      iv,
    );

    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return [
      iv.toString('hex'),
      authTag.toString('hex'),
      encrypted.toString('hex'),
    ].join(':');
  }

  decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, encryptedHex] =
      encryptedText.split(':');

    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error('Invalid encrypted data format');
    }

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(ivHex, 'hex'),
    );

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, 'hex')),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}