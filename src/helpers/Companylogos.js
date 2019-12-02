import { air_asiana } from "./../assets/img/company_logos/AIR_LINERS/air_asiana.png";
import { air_canada } from "./../assets/img/company_logos/AIR_LINERS/air_canada.png";
import { air_serbia } from "./../assets/img/company_logos/AIR_LINERS/air_serbia.png";
import { airfrance } from "./../assets/img/company_logos/AIR_LINERS/airfrance.png";
import { emirates } from "./../assets/img/company_logos/AIR_LINERS/emirates.png";
import { etihad } from "./../assets/img/company_logos/AIR_LINERS/etihad.png";
import { gulf_air } from "./../assets/img/company_logos/AIR_LINERS/gulf_air.png";
import { korean_air } from "./../assets/img/company_logos/AIR_LINERS/korean_air.png";
import { lufthansa } from "./../assets/img/company_logos/AIR_LINERS/lufthansa.png";
import { mng_airlines } from "./../assets/img/company_logos/AIR_LINERS/mng_airlines.png";
import { pegasus_airlines } from "./../assets/img/company_logos/AIR_LINERS/pegasus_airlines.png";
import { qatar_airways } from "./../assets/img/company_logos/AIR_LINERS/qatar_airways.png";
import { royal_air_maroc } from "./../assets/img/company_logos/AIR_LINERS/royal_air_maroc.png";
import { royal_jordanian } from "./../assets/img/company_logos/AIR_LINERS/royal_jordanian.png";
import { sichuan } from "./../assets/img/company_logos/AIR_LINERS/sichuan.png";
import { silkway } from "./../assets/img/company_logos/AIR_LINERS/silkway.png";
import { singapore_airlines } from "./../assets/img/company_logos/AIR_LINERS/singapore_airlines.png";
import { turkish_airlines } from "./../assets/img/company_logos/AIR_LINERS/turkish_airlines.png";
import { arkas_line } from "./../assets/img/company_logos/OEAN_LINERS/arkas_line.png";
import { borchard } from "./../assets/img/company_logos/OEAN_LINERS/borchard.png";
import { CMA_logo } from "./../assets/img/company_logos/OEAN_LINERS/CMA_logo.png";
import { cosco } from "./../assets/img/company_logos/OEAN_LINERS/cosco.png";

import { evergreen } from "./../assets/img/company_logos/OEAN_LINERS/evergreen.png";
import { hamburg_sud } from "./../assets/img/company_logos/OEAN_LINERS/hamburg_sud.png";
import { hapag_llyod } from "./../assets/img/company_logos/OEAN_LINERS/hapag_llyod.png";
import { maersk } from "./../assets/img/company_logos/OEAN_LINERS/maersk.png";
import { medkon } from "./../assets/img/company_logos/OEAN_LINERS/medkon.png";
import { Msc_logo } from "./../assets/img/company_logos/OEAN_LINERS/Msc_logo.png";
import { one_line } from "./../assets/img/company_logos/OEAN_LINERS/one_line.png";
import { OOCL } from "./../assets/img/company_logos/OEAN_LINERS/OOCL.png";
import { safmarine } from "./../assets/img/company_logos/OEAN_LINERS/safmarine.png";
import { seago } from "./../assets/img/company_logos/OEAN_LINERS/seago.png";
import { sealand } from "./../assets/img/company_logos/OEAN_LINERS/sealand.png";
import { tarros } from "./../assets/img/company_logos/OEAN_LINERS/tarros.png";
import { YML } from "./../assets/img/company_logos/OEAN_LINERS/YML.png";
import { ZIM } from "./../assets/img/company_logos/OEAN_LINERS/ZIM.png";
import { ATA } from "./../assets/img/company_logos/ATAFreight_console.png";


const COSCO = require('./../assets/img/company_logos/OEAN_LINERS/cosco.png');

export function GetImgByName(params) {
 
  if (params === "air_asiana") {
    return air_asiana;
  } else if (params === "air_canada") {
    return air_canada;
  } else if (params === "air_serbia") {
    return air_serbia;
  } else if (params === "airfrance") {
    return airfrance;
  } else if (params === "emirates") {
    return emirates;
  } else if (params === "etihad") {
    return etihad;
  } else if (params === "gulf_air") {
    return gulf_air;
  } else if (params === "korean_air") {
    return korean_air;
  } else if (params === "lufthansa") {
    return lufthansa;
  } else if (params === "mng_airlines") {
    return mng_airlines;
  } else if (params === "pegasus_airlines") {
    return pegasus_airlines;
  } else if (params === "qatar_airways") {
    return qatar_airways;
  } else if (params === "royal_air_maroc") {
    return royal_air_maroc;
  } else if (params === "royal_jordanian") {
    return royal_jordanian;
  } else if (params === "sichuan") {
    return sichuan;
  } else if (params === "silkway") {
    return silkway;
  } else if (params === "singapore_airlines") {
    return singapore_airlines;
  } else if (params === "turkish_airlines") {
    return turkish_airlines;
  } else if (params === "arkas_line") {
    return arkas_line;
  } else if (params === "borchard") {
    return borchard;
  } else if (params === "CMA_logo") {
    return CMA_logo;
  } else if (params === "COSCO") {
    debugger
    
    return require('./../assets/img/company_logos/OEAN_LINERS/cosco.png');
  } else if (params === "evergreen") {
    return evergreen;
  } else if (params === "hamburg_sud") {
    return hamburg_sud;
  } else if (params === "hapag_llyod") {
    return hapag_llyod;
  } else if (params === "maersk") {
    return maersk;
  } else if (params === "medkon") {
    return medkon;
  } else if (params === "Msc_logo") {
    return Msc_logo;
  } else if (params === "one_line") {
    return one_line;
  } else if (params === "OOCL") {
    return OOCL;
  } else if (params === "safmarine") {
    return safmarine;
  } else if (params === "seago") {
    return seago;
  } else if (params === "sealand") {
    return sealand;
  } else if (params === "tarros") {
    return tarros;
  } else if (params === "YML") {
    return YML;
  } else if (params === "ZIM") {
    return ZIM;
  } else {
    return ATA;
  }
}
