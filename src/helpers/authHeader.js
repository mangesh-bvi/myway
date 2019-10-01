export function authHeader (token='token') {
    if(token==='no')
    {
        return { 'Authorization': 'Basic TXlXYXlVc2VyOmRlbW8=', 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}
    }
    else{
       // var token=window.localStorage.getItem('token');
        var tokenValue=window.localStorage.getItem('token');
        return { 'Authorization': 'Bearer amnlnPGUUNYP9nY8HwcQAug6MFrrFrXaaiDpJ2hMdvGQm1ZPKX9uccbxt8qBJfVWMjIZMQS77hPrgpMo_KvLse5gyiCJBhkauVAUw_DMfJkyvdgLZJ5yMb2pmaEduJKVOk0KBVBLbV6Mb68lD2dhUqFDv7NlpNZYnovZVNiTRs0RhgVtY5qsEs0jJryZ65uKXAWrO1DCWmLpV617cAShXLc9bW5OipsLh5SlwcOCnsiLRBX3Tsh3vqyXq6P21X9TDzwTLFMFzDUk3YqDGhUJwFoSRhSlHQrwscKa9EoDr5kMnYNN9ZFH14Ui6lVjRwZzcAQ1bl9BMVNF10PpbJU28TA1OBafCVlxcyzuARnp4WoyXvoCSLZ2KlAmW_YHnb2Y', 'Content-Type': 'application/json'}
    }
  
}