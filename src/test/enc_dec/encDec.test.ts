import { EncryptionService } from '../../utils/EncryptionService';
import { expect, test } from 'vitest';

test('Key generation test', async () => {
	const userId = '12';
	const secretText = 'I want to switch';
	const encryptedText = await EncryptionService.encrypt(secretText, userId);
	const decryptedText = await EncryptionService.decrypt(encryptedText, userId);
	console.log(`Real Text : ${secretText}\nEncrypted Text : ${encryptedText}\nDecrypted Text : ${decryptedText}`);
	expect(decryptedText).toEqual(secretText);
});
