import { encryption } from "./encryption";

export function authHeader (token='token') {
    if(token==='no')
    {
        return { 'Authorization': 'Basic TXlXYXlVc2VyOmRlbW8=', 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}
    }
    else{
       // var token=window.localStorage.getItem('token');
        var tokenValue="Bearer "+encryption(window.localStorage.getItem('token'),"desc");
        return { 'Authorization':tokenValue, 'Content-Type': 'application/json'}
    }
  
}