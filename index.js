"use strict";
const kartInput = document.getElementById("kartInput");
const kartInpContainer = document.getElementById("kartInputContainer");
const kartDataContainer = document.getElementById("kartDataContainer");
const kartBalance = document.getElementById("kartBalance");
const kartLastUseDate = document.getElementById("kartLastUseDate");
const kartLastUsePrice = document.getElementById("kartLastUsePrice");
const kartLastLoadDate = document.getElementById("kartLastLoadDate");
const kartLastLoadPrice = document.getElementById("kartLastLoadPrice");
const kartPendingBalance = document.getElementById("kartPendingBalance");
const pendinBalanceContainer = document.getElementById("pendinBalanceContainer");
let isActive = false;

const isModifierKey = (event) => {
	const key = event.key;
	return (key == "Shift" || key === "Control" || key === "Enter") ||
		(key === "Backspace" || key === "Tab" || key === "Space" || key === "Delete") ||
		(key == "ArrowLeft" || key == "ArrowRight" || key == "Home" || key == "End") ||
		(
			(event.ctrlKey === true || event.metaKey === true) &&
			(key === "a" || key === "c" || key === "v" || key === "x" || key === "z")
		)
};


function getData() {
    kartDataContainer.style.display = "block";
    fetch("https://openapi.izmir.bel.tr/api/iztek/bakiyesorgulama/"+kartInput.value.replace("-","")).then(response=>response.json()).then(data=>{
        if (data.HataVarMi) {
            alert("Hatalı Giriş");
            return;
        }
        let bakiye = data.UlasimKartBakiyesi;
        if (bakiye.BekleyenYuklemeler.length) {
            let pendingTotal = 0;
            for (const yukleme of bakiye.BekleyenYuklemeler) {
                pendingTotal += parseFloat(yukleme.YuklenenTutar);
            }
            pendinBalanceContainer.style.display = "flex";
            kartPendingBalance.innerHTML = pendingTotal + " TL";
        }
        else {
            pendinBalanceContainer.style.display = "none";
        }
        kartBalance.innerHTML = bakiye.MevcutBakiye + " TL";
        kartLastUseDate.innerHTML = bakiye.SonIslemTarihi;
        kartLastUsePrice.innerHTML = bakiye.SonHarcananTutar + " TL";
        kartLastLoadDate.innerHTML = bakiye.SonYuklemeTarihi;
        kartLastLoadPrice.innerHTML = bakiye.SonYuklenenTutar + " TL";
    });
}

kartInput.addEventListener("keydown", function (event) {
    if (!(event.key >= 0 && event.key <= 9) && !isModifierKey(event)) {
        event.preventDefault();
    }
});

kartInput.addEventListener("keyup", function (event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '').replace(/^(\d{5})(\d{1,5})$/, '$1-$2').replace(/^(\d{5})(\d{5})(\d{1})$/, '$1-$2-$3');
    if (event.target.value.length == 13){
        if (!isActive) {
            kartInpContainer.style.transform = "translate(-50%, -200px)";
            isActive = true;
        }
        getData();
    }
});
