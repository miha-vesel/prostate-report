// script.js

function izracunajVolumenInPSAD() {
  const sirina = parseFloat(document.getElementById("sirina").value);
  const visina = parseFloat(document.getElementById("visina").value);
  const dolzina = parseFloat(document.getElementById("dolzina").value);
  const psa = parseFloat(document.getElementById("psa").value);

  if (!isNaN(sirina) && !isNaN(visina) && !isNaN(dolzina)) {
    const volumen = ((sirina * visina * dolzina) * 0.52 / 1000).toFixed(0);
    document.getElementById("volumen").value = volumen;

    if (!isNaN(psa)) {
      document.getElementById("psad").value = (psa / volumen).toFixed(2);
    } else {
      document.getElementById("psad").value = "";
    }
  }
}

document.getElementById("status").addEventListener("change", function () {
  const selectedValue = this.value;
  const specialDiv = document.getElementById("indikacija-div");

  if (selectedValue === "2") {
    specialDiv.style.display = "block";
  } else {
    specialDiv.style.display = "none";
  }
});


function generirajIzpis() {
  izracunajVolumenInPSAD();
  const status = document.getElementById("status").value;
  const protokol = document.getElementById("protokol").value;
  const indikacija = document.getElementById("indikacija").value;
  const klinika = document.getElementById("klinika").value.trim();
  const psa = document.getElementById("psa").value;
  const psad = document.getElementById("psad").value;
  const sirina = document.getElementById("sirina").value;
  const visina = document.getElementById("visina").value;
  const dolzina = document.getElementById("dolzina").value;
  const volumen = document.getElementById("volumen").value;
  const periferna = document.getElementById("periferna").value;
  const prehodna = document.getElementById("prehodna").value;
  const epe = document.getElementById("epe").value;
  const semenske = document.getElementById("semenske").value;
  const snopa = document.getElementById("snopa").value;
  const limfne = document.getElementById("limfne").value;
  const skelet = document.getElementById("skelet").value;
  const ostalo = document.getElementById("ostalo").value.trim();

  let zacetek = "";
  if (protokol === "Multiparametrični pristop (T2W, DWI/ADC, DCE)") {
    zacetek = "MR prostate s KS in MR dinamično slikanje\n" + protokol;
  } else {
    zacetek = "MR prostate\n" + protokol;
  }


  let izpis = `${zacetek}\n\nIndikacija: ${indikacija}`;
  if (klinika) izpis += `\nKlinični podatki: ${klinika}`;
  izpis += `\n\nDimenzije prostate: ${sirina} × ${visina} × ${dolzina} mm\nVolumen prostate: ${volumen} cc`;
  izpis += psa ? `\nPSA: ${psa} ng/ml` : `\nVrednost PSA ni navedena.`;
  if (psa && psad) izpis += `\nPSAD: ${psad} ng/ml/cc`;

  if (status === "1") {
    izpis += `\n\n${periferna}\n${prehodna}\n\nSeminalni vezikuli sta simetrični.\nNevrovaskularna snopa sta primerna.\nPeriprostatično maščevje je strukturno primerno.\n\nBrez proste tekočine v mali medenici.\n${limfne}\n${skelet}`;
    if (ostalo) izpis += `\n\n${ostalo}`;
    izpis += `\n\nZaključek:\n`;
    izpis += parseFloat(volumen) > 30
      ? `Prostata je povečana in spremenjena v sklopu BHP. V prostati ne vidim signifikantnih lezij.`
      : `Prostata je normalno velika. V prostati ne vidim signifikantnih lezij.`;
  } else {
    const lezijeText = Array.from(document.querySelectorAll('.lezija'))
      .map((el, i) => el.value.trim())
      .filter(txt => txt.length > 0)
      .join("\n\n");
    izpis += `\n\n${periferna}\n${prehodna}\n${lezijeText}\n\nEkstrakapsularno širjenje: ${epe}\nSeminalni vezikuli: ${semenske}\nNevrovaskularna snopa: ${snopa}\n\nBezgavke: ${limfne}\nSkelet: ${skelet}`;
    if (ostalo) izpis += `\n\n${ostalo}`;

    const psadNum = parseFloat(psad);
    let zakljucki = "";
    const polja = document.querySelectorAll('.lezija');
    polja.forEach((lezija, index) => {
      const besedilo = lezija.value.trim();
      const piradsMatch = besedilo.match(/PI-RADS\s*(\d)/i);
      if (piradsMatch) {
        const pirads = parseInt(piradsMatch[1]);
        if (pirads >= 4) {
          zakljucki += `Lezija ${index + 1}: PI-RADS ${pirads}. Svetujemo ciljano biopsijo spremembe.\n`;
        } else if (pirads === 3) {
          if (!isNaN(psadNum)) {
            zakljucki += psadNum > 0.15
              ? `Lezija ${index + 1}: PI-RADS 3 ob PSAD ${psadNum.toFixed(3)}. Svetujemo ciljano biopsijo spremembe.\n`
              : `Lezija ${index + 1}: PI-RADS 3 ob PSAD ${psadNum.toFixed(3)}. Svetujemo klinično in MRI kontrolo.\n`;
          } else {
            zakljucki += `Lezija ${index + 1}: PI-RADS 3. PSAD ni znan. Svetujemo klinično in MRI kontrolo.\n`;
          }
        }
      }
    });
    if (zakljucki) izpis += `\n\nZaključek:\n${zakljucki.trim()}`;
  }

const izpisElement = document.getElementById("izpis");
izpisElement.value = izpis.trim();


izpisElement.style.height = "auto";
izpisElement.style.height = izpisElement.scrollHeight + "px";
}


function kopirajVsebino() {
  const izpis = document.getElementById("izpis");
  izpis.select();
  izpis.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(izpis.value)
 //   .then(() => alert("Poročilo je kopirano v odložišče."))
    .catch(() => alert("Kopiranje ni uspelo."));
}

function dodajLezijo() {
  const lezijeDiv = document.getElementById("lezije");
  const count = lezijeDiv.querySelectorAll(".lezija-container").length + 1;
  const container = document.createElement("div");
  container.className = "lezija-container";
  container.innerHTML = `<textarea class="lezija" placeholder="Opis lezije ${count}..."></textarea><span class="pirads-tag" id="pirads-tag-${count}">PI-RADS: --</span>`;
  lezijeDiv.appendChild(container);
}

document.addEventListener("input", function (e) {
  if (e.target.classList.contains("lezija")) {
    const container = e.target.parentElement;
    const tag = container.querySelector(".pirads-tag");
    const match = e.target.value.match(/PI-RADS\s*(\d)/i);
    tag.textContent = match ? `PI-RADS: ${match[1]}` : "PI-RADS: --";
  }
});
