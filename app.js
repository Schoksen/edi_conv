
let initialise = () => {
  let d = new Date();
  document.getElementById("input-ord-odate").setAttribute("value", `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`);
  document.getElementById("input-ord-ddate").setAttribute("value", `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`);
  document.getElementById("input-iv-switch").addEventListener("click", () => {
    disabler(document.getElementById("iv-group").getElementsByClassName("form-control"), document.getElementById("input-iv-switch").checked);});
  document.getElementById("input-dp-country").addEventListener("change", () => {
    dropdowner((document.getElementById("input-dp-country")).selectedIndex);});
  document.getElementById("btn-save").addEventListener("click", btnsave);
};

let disabler = (anchor, condition = false) => {
    if (condition) {
    for (i = 0; i < anchor.length; i++) {anchor[i].setAttribute("disabled", "true");}
  } else {
    for (i = 0; i < anchor.length; i++) {anchor[i].removeAttribute("disabled");}
  }
};

let dropdowner = (anchor) => {
switch (anchor) {
  case 0:
      document.getElementById("input-ord-freight").value = "";
      document.getElementById("input-ord-spedi").value = "DHL";
      break;
  case 1:
      document.getElementById("input-ord-freight").value = "5,00";
      document.getElementById("input-ord-spedi").value = "DHL";
      break;
  case 2:
      document.getElementById("input-ord-freight").value = "7,50";
      document.getElementById("input-ord-spedi").value = "UPS";
      break;
}
}

let trimmer = (x) => {return (document.getElementById(x).value).trim();};

let pos_arr = (z) => {
    if (trimmer(`input-pos-ean-${z}`)) {
      return `"POS";"${trimmer(`input-pos-ean-${z}`)}";;${trimmer(`input-pos-quantity-${z}`)};${trimmer(`input-pos-price-${z}`)};;;;;;;;;;;;`
    }
  }


let btnsave = () => {
  let odate = (trimmer("input-ord-odate")).split(".");
  let odate_new = `${odate[2]}${(odate[1] < 10 )?'0'+odate[1]:odate[1]}${(odate[0] < 10 )?'0'+odate[0]:odate[0]}`
  let ddate = (trimmer("input-ord-ddate")).split(".");
  let ddate_new = `${ddate[2]}${(odate[1] < 10 )?'0'+ddate[1]:odate[1]}${(ddate[0] < 10 )?'0'+ddate[0]:ddate[0]}`


  let ord_arr = [
    `"ORD";"${trimmer("input-iln-supplier")}"`,
    `"${trimmer("input-iln-buyer")}"`,
    `"${trimmer("input-iln-delivery")}"`,
    `"${trimmer("input-iln-invoice")}"`,
    odate_new,
    ddate_new,
    `"${trimmer("input-ord-ordernr")}"`,
    `;;;;;;;;;;;;;"220";;;;"webshop_ew";"WA";`
  ].join(";");

  let ord2_arr = [`"ORD2";;;"${trimmer("input-ord-ordernr")}";;;;;;;;;;;;;;;;;`];

  let dp_arr = [
    `;"${trimmer("input-dp-name")}"`,
    `"${trimmer("input-dp-surname")}"`,
    `"${trimmer("input-dp-additions")}"`,
    `"${trimmer("input-dp-street")}"`,
    `"${trimmer("input-dp-city")}"`,
    `"${trimmer("input-dp-postal")}"`,
    `"${trimmer("input-dp-country")}"`
  ];

  let iv_arr = [
    `;"${trimmer("input-iv-name")}"`,
    `"${trimmer("input-iv-surname")}"`,
    `"${trimmer("input-iv-additions")}"`,
    `"${trimmer("input-iv-street")}"`,
    `"${trimmer("input-iv-city")}"`,
    `"${trimmer("input-iv-postal")}"`,
    `"${trimmer("input-iv-country")}"`
  ];

  if (document.getElementById("input-iv-switch").checked) { iv_arr = dp_arr; };

  let freight = `${(Number(trimmer("input-ord-freight")) / 1.19).toFixed(2)}`;
  let pay_arr =  `"PAY";"${freight}";;;;;;;`;
  let info_arr = `"INFO";;;;;"${trimmer("input-ord-spedi")}";`;

  let all_arr = [
    ord_arr, ord2_arr,
    [`"DP"`, ...dp_arr,`;;;;;`].join(";"),
    [`"IV"`, ...iv_arr, `;;;;;;;;;`].join(";"),
    pay_arr, info_arr, pos_arr(1), pos_arr(2), pos_arr(3)
  ].join("\r\n");

  const CHARS = {'\u00dc':'UE', '\u00fc':'ue', '\u00c4':'AE', '\u00e4':'ae', '\u00d6':'OE', '\u00f6':'oe', '\u00df':'ss', ',':'.'};
  all_arr = all_arr.replace(/[ÜüÄäÖöß,]/g, m => CHARS[m]);

  let blob = new Blob([all_arr], {type: "text/plain;charset=US-ASCII"});
  saveAs(blob, `25_ORDERS_${trimmer("input-iln-buyer")}_${trimmer("input-ord-ordernr")}.txt`);
};

document.addEventListener("DOMContentLoaded", initialise);
