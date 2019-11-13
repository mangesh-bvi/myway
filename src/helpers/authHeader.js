import { encryption } from "./encryption";

export function authHeader(token = "token") {
  if (token === "no") {
    return {
      Authorization: "Basic TXlXYXlVc2VyOmRlbW8=",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    };
  } else {
    // var token=window.localStorage.getItem('token');
    var msDiff =
      new Date().getTime() -
      new Date(window.localStorage.getItem("st")).getTime();
    var mm = Math.floor(msDiff / 1000 / 60);
    if (mm > 110) {
      //diff_minutes();
      window.localStorage.clear();
      window.location.href = "./";
    } else {
      var tokenValue =
        "Bearer " + encryption(window.localStorage.getItem("token"), "desc");
      return { Authorization: tokenValue, "Content-Type": "application/json" };
    }
  }
}
