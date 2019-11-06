 
export function encryption(plainText,type="enc")
{
  
    var CryptoJS = require("crypto-js");
    if(type==="enc")
    {
    var ciphertext = CryptoJS.AES.encrypt(plainText.toString(), 'bvi1secret');
    return ciphertext.toString();
    }
    else{
        if(plainText != null)
        {
             var bytes  = CryptoJS.AES.decrypt(plainText.toString(), 'bvi1secret');
            var decrypt = bytes.toString(CryptoJS.enc.Utf8);
             return decrypt;
        }
        else
        {
            window.location.href = "./login";
        }
    }
    
}


