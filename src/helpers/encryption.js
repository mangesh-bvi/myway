 
export function encryption(plainText,type="enc")
{
    var CryptoJS = require("crypto-js");
    if(type==="enc")
    {
    var ciphertext = CryptoJS.AES.encrypt(plainText, 'bvi1secret');
    return ciphertext.toString();
    }
    else{
        var bytes  = CryptoJS.AES.decrypt(plainText.toString(), 'bvi1secret');
        var decrypt = bytes.toString(CryptoJS.enc.Utf8);
       return decrypt;
    }
    
}
