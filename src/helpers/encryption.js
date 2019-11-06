 
export function encryption(plainText,type="enc")
<<<<<<< HEAD
{  
=======
{
  
>>>>>>> 0dfe441557d0d0d8be7b6fe655e594015d9dde24
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


