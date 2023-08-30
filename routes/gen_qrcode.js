/*!
 * promptpay-qr
 * JavaScript library to generate PromptPay QR code
 * <https://github.com/dtinth/promptpay-qr>
 *
 * Refs:
 * - https://www.blognone.com/node/95133
 * - https://www.emvco.com/emv-technologies/qrcodes/
 *
 * @license MIT
 */

const { crc16xmodem } = require("crc");
// field ID
var ID_PAYLOAD_FORMAT = "00";
var ID_POI_METHOD = "01";
var ID_MERCHANT_INFORMATION_BOT = "30";
var ID_LAO_QR = "38";
var ID_MERCHANT_CODE = "52";

var ID_TRANSACTION_CURRENCY = "53";
var ID_TRANSACTION_AMOUNT = "54";
var ID_COUNTRY_CODE = "58";
var ID_ADDITIONAL_INFORMATION = "62";
var ID_CRC = "63";
// midlle filed
var PAYLOAD_FORMAT_EMV_QRCPS_MERCHANT_PRESENTED_MODE = "01";
var POI_METHOD_STATIC = "11";
var POI_METHOD_DYNAMIC = "12";
var APP_ID = "00";
var ID_ACC_Main = "01";
var EXPIRE_TIME = "02";
var SC_KEY = "03";

// Lao QR
var AID = "00";
var IIN = "01";
var PAYMENT_TYPE = "02";
var RECEIVER_ID = "03";

// var MERCHANT_ID_POINT = "02";
var TRANSACTION_CURRENCY_LA = "418";
var COUNTRY_CODE_LAO = "LA";
var BILL_ID = "01";

function generatePayload(target, options) {
  const date = new Date(Date.now());
  const result = Math.random().toString(36).substring(4, 8);
  const amount = options.amount ? options.amount.toString() : null;
  const app_id_val = "MP";
  const qr_expire_time = new Date(date)
    .setMinutes(date.getMinutes() + 2)
    .toString();
  // const secretkey = "8aa2f3d8-ffa1-430c-9beb-3c77446b2907";
  const Billid = `B${Date.now()}${result}`.toLocaleLowerCase();
  const aid = "A005266284662577";
  const iin = "12345678";
  //check payment type is QR profile user or QR profile merchant
  const payment_type =
    app_id_val == "PM"
      ? "001"
      : app_id_val == "MP" || app_id_val == "MT"
      ? "002"
      : "";
  var receiver_id = target;

  var data = [
    f(ID_PAYLOAD_FORMAT, PAYLOAD_FORMAT_EMV_QRCPS_MERCHANT_PRESENTED_MODE),
    f(ID_POI_METHOD, amount ? POI_METHOD_DYNAMIC : POI_METHOD_STATIC),
    // PM  is QR User Profile, MP && MT is QR Merchant Profile ,
    app_id_val == "PM" || app_id_val == "MP" || app_id_val == "MT"
      ? f(
          ID_LAO_QR,
          serialize([
            f(AID, aid),
            f(IIN, iin),
            f(PAYMENT_TYPE, payment_type),
            f(RECEIVER_ID, receiver_id),
          ])
        )
      : f(
          ID_MERCHANT_INFORMATION_BOT,
          serialize([
            f(APP_ID, app_id_val),
            f(ID_ACC_Main, target),
            qr_expire_time && f(EXPIRE_TIME, qr_expire_time),
            secretkey && f(SC_KEY, secretkey),
          ])
        ),

    options.mccCode && f(ID_MERCHANT_CODE, options.mccCode), // mcc
    f(ID_TRANSACTION_CURRENCY, TRANSACTION_CURRENCY_LA),
    amount && f(ID_TRANSACTION_AMOUNT, amount),
    Billid && f(ID_ADDITIONAL_INFORMATION, serialize([f(BILL_ID, Billid)])),

    f(ID_COUNTRY_CODE, COUNTRY_CODE_LAO),
  ];
  var dataToCrc = serialize(data) + ID_CRC + "04";
  data.push(f(ID_CRC, formatCrc(crc16xmodem(dataToCrc, 0xffff))));
  return serialize(data);
}

function f(id, value) {
  return [id, ("00" + value.length).slice(-2), value].join("");
}

function serialize(xs) {
  return xs
    .filter(function (x) {
      return x;
    })
    .join("");
}

function sanitizeTarget(id) {
  return id.replace(/[^0-9]/g, "");
}

function formatTarget(id) {
  const numbers = sanitizeTarget(id);
  if (numbers.length >= 13) return numbers;
  return ("0000000000000" + numbers.replace(/^0/, "66")).slice(-13);
}

function formatAmount(amount) {
  return amount.toFixed(2);
}

function formatCrc(crcValue) {
  return ("0000" + crcValue.toString(16).toUpperCase()).slice(-4);
}

module.exports = { generatePayload };
