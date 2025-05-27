// script.js

function izracunajVolumenInPSAD() {
  const sirina = parseFloat(document.getElementById("sirina").value);
  const visina = parseFloat(document.getElementById("visina").value);
  const dolzina = parseFloat(document.getElementById("dolzina").value);
  const psa = parseFloat(document.getElementById("psa").value);

  if (!isNaN(sirina) && !isNaN(visina) && !isNaN(dolzina)) {
    const volumen = ((sirina * visina * dolzina) * 0.52 / 1000).toFixed(1);
    document.getElementById("volumen").value = volumen;

    if (!isNaN(psa)) {
      document.getElementById("psad").value = (psa / volumen).toFixed(3);
    } else {
      document.getElementById("psad").value = "";
    }
  }
}

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
  const epe = document.getElementById("epe").value;
  const semenske = document.getElementById("semenske").value;
  const snopa = document.getElementById("snopa").value;
  const limfne = document.getElementById("limfne").value;
  const skelet = document.getElementById("skelet").value;
  const ostalo = document.getElementById("ostalo").value.trim(); // [DODANO: OSTALO]

  let izpis = `Protokol: ${protokol}\n\nIndikacija: ${indikacija}`;
  if (klinika) izpis += `\nKlinični podatki:\n${klinika}`;
  izpis += `\n\nDimenzije prostate: ${sirina} × ${visina} × ${dolzina} mm\nVolumen prostate: ${volumen} cc`;
  izpis += psa ? `\nPSA: ${psa} ng/ml` : `\nVrednost PSA ni navedena.`;
  if (psa && psad) izpis += `\nPSAD: ${psad} ng/ml/cc`;

  if (status === "Ni sumljivih sprememb") {
    izpis += `\n\nV periferni coni ni sumljivih arealov z restrikcijo difuzije.\nV prehodni coni so vidni dobro omejeni noduli, nesumljivi.\n\nSeminalni vezikuli sta simetrični.\nNevrovaskularna snopa sta primerna.\nPeriprostatično maščevje je strukturno primerno.\n\nBrez proste tekočine v mali medenici.\n${limfne}\n${skelet}`;
    if (ostalo) izpis += `\n\n${ostalo}`; // [DODANO: OSTALO]
    izpis += `\n\nZaključek:\n`;
    izpis += parseFloat(volumen) > 30
      ? `Prostata je povečana in spremenjena v sklopu BHP. V prostati ni sumljivih sprememb.`
      : `Prostata je normalno velika. V prostati ni sumljivih sprememb.`;
  } else {
    const lezijeText = Array.from(document.querySelectorAll('.lezija'))
      .map((el, i) => el.value.trim())
      .filter(txt => txt.length > 0)
      .join("\n\n");
    izpis += `\n\n${lezijeText}\n\nEkstrakapsularno širjenje: ${epe}\nSeminalni vezikuli: ${semenske}\nNevrovaskularna snopa: ${snopa}\n\nBezgavke:\n${limfne}\n\nSkelet:\n${skelet}`;
    if (ostalo) izpis += `\n\n${ostalo}`; // [DODANO: OSTALO]

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

// Popolna prilagoditev višine
izpisElement.style.height = "auto"; // najprej resetiramo višino
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
