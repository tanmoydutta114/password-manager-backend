import * as crypto from 'crypto';
import config from '../../credential.json';

export class EncryptionDecryption {
	private static async deriveKey(userId: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const salt = config.ENC_DEC_SALT + userId; // Combine the secret salt with the user ID
			crypto.pbkdf2(userId, salt, 100000, 32, 'sha256', (err, derivedKey) => {
				if (err) reject(err);
				else resolve(derivedKey);
			});
		});
	}

	static async encrypt(text: string, userId: string): Promise<string> {
		const key = await this.deriveKey(userId);
		const iv = crypto.randomBytes(16); // Generate a random IV for each encryption
		const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
		let encrypted = cipher.update(text, 'utf8', 'base64');
		encrypted += cipher.final('base64');
		return `${iv.toString('base64')}:${encrypted}`; // Include the IV with the encrypted text
	}

	static async decrypt(encryptedText: string, userId: string): Promise<string> {
		const key = await this.deriveKey(userId);
		const [ivString, encrypted] = encryptedText.split(':');
		const iv = Buffer.from(ivString, 'base64');
		const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
		let decrypted = decipher.update(encrypted, 'base64', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	}
}
