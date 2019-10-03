var crypto = require('crypto');
var assert = require('assert');

var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'password';
var text = 'I love kittens';
var cipher = crypto.createCipher(algorithm, key);  
export function encryption(plainText)
{
    var encrypted = cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
}

export function decryption(encrypted)
{
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
}