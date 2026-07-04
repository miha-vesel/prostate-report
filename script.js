// ═══════════════════════════════════════════════════════════
// TEMA
// ═══════════════════════════════════════════════════════════

const btnTema = document.getElementById("btn-tema");

function nastaviTemo(tema) {
  document.documentElement.setAttribute("data-tema", tema);
  localStorage.setItem("tema", tema);
  btnTema.textContent = tema === "temna" ? "☀️" : "🌙";
  btnTema.title = tema === "temna" ? "Svetli način" : "Temni način";
}

btnTema.addEventListener("click", () => {
  const trenutna = document.documentElement.getAttribute("data-tema");
  nastaviTemo(trenutna === "temna" ? "svetla" : "temna");
});

nastaviTemo(localStorage.getItem("tema") || "svetla");


// ═══════════════════════════════════════════════════════════
// ZAVIHKI
// ═══════════════════════════════════════════════════════════

let aktivniTab = "diagnostika";

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    aktivniTab = btn.dataset.tab;
    document.getElementById("tab-" + aktivniTab).classList.add("active");
    shraniStanje();
  });
});


// ═══════════════════════════════════════════════════════════
// VOLUMEN IN PSAD — AVTOMATSKI IZRAČUN
// ═══════════════════════════════════════════════════════════

function izracunajVolumenInPSAD() {
  const s = parseFloat(document.getElementById("sirina").value);
  const v = parseFloat(document.getElementById("visina").value);
  const d = parseFloat(document.getElementById("dolzina").value);
  const psa = parseFloat(document.getElementById("psa").value);
  const container = document.getElementById("volumen-psad-container");

  if (!isNaN(s) && !isNaN(v) && !isNaN(d)) {
    const vol = ((s * v * d) * 0.52 / 1000).toFixed(0);
    document.getElementById("volumen").value = vol;
    if (!isNaN(psa) && parseFloat(vol) > 0) {
      document.getElementById("psad").value = (psa / parseFloat(vol)).toFixed(2);
    } else {
      document.getElementById("psad").value = "";
    }
    container.style.display = "flex";
  } else {
    container.style.display = "none";
  }
}

["sirina", "visina", "dolzina", "psa"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    izracunajVolumenInPSAD();
    shraniStanje();
  });
});


// ═══════════════════════════════════════════════════════════
// TAB 1 — DIAGNOSTIKA: STATUS IN LEZIJE
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('input[name="status"]').forEach(r => {
  r.addEventListener("change", () => {
    const sumljivo = r.value === "sumljivo";
    document.getElementById("lezije-section").style.display = sumljivo ? "block" : "none";
    document.getElementById("stagiranje-section").style.display = sumljivo ? "block" : "none";
    if (sumljivo && document.getElementById("lezije-container").children.length === 0) {
      dodajLezijo();
    }
    shraniStanje();
  });
});

let steviloLezij = 0;

function dodajLezijo() {
  steviloLezij++;
  const n = steviloLezij;
  const container = document.getElementById("lezije-container");
  const div = document.createElement("div");
  div.className = "lezija-kartica";
  div.dataset.id = n;
  div.innerHTML = `
    <div class="lezija-header">
      <span class="lezija-naziv">Lezija ${n}</span>
      <span class="pirads-badge" id="diag-pirads-badge-${n}">PI-RADS —</span>
    </div>
    <div class="lezija-polja">
      <div class="field-group">
        <label>Cona</label>
        <select class="lez-cona" data-id="${n}">
          <option value="PZ">PZ — periferna cona</option>
          <option value="TZ">TZ — prehodna cona</option>
          <option value="AS">AS — anteriorna stroma</option>
        </select>
      </div>
      <div class="field-group">
        <label>Tretjina</label>
        <select class="lez-tretjina" data-id="${n}">
          <option value="bazalna">bazalna tretjina</option>
          <option value="srednja">srednja tretjina</option>
          <option value="apikalna">apikalna tretjina</option>
          <option value="bazalna/srednja">bazalna/srednja tretjina</option>
          <option value="srednja/apikalna">srednja/apikalna tretjina</option>
        </select>
      </div>
      <div class="field-group">
        <label>Stran</label>
        <select class="lez-stran" data-id="${n}">
          <option value="desno">desno</option>
          <option value="levo">levo</option>
          <option value="sredinska">sredinska</option>
          <option value="obojestransko">obojestransko</option>
        </select>
      </div>
      <div class="field-group">
        <label>Lokacija (ura od — do)</label>
        <div class="ura-row">
          <select class="lez-ura-od" data-id="${n}">
            ${ureOptions()}
          </select>
          <span class="dim-sep">—</span>
          <select class="lez-ura-do" data-id="${n}">
            ${ureOptions()}
          </select>
        </div>
      </div>
      <div class="field-group">
        <label>Velikost (mm)</label>
        <input type="number" class="lez-velikost" data-id="${n}" placeholder="npr. 12">
      </div>
      <div class="field-group">
        <label>PI-RADS</label>
        <select class="lez-pirads" data-id="${n}">
          <option value="">—</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    </div>
    <div class="sekvence-grid" style="margin-top:8px">
      <div class="field-group">
        <label>T2WI</label>
        <input type="text" class="lez-t2" data-id="${n}" placeholder="npr. hipointenzna, nodularna...">
      </div>
      <div class="field-group">
        <label>DWI/ADC</label>
        <input type="text" class="lez-dwi" data-id="${n}" placeholder="npr. restrikcija difuzije...">
      </div>
      <div class="field-group lez-dce-group">
        <label>DCE</label>
        <input type="text" class="lez-dce" data-id="${n}" placeholder="npr. zgodnje KS...">
      </div>
    </div>
    <div class="lezija-zakljucek" id="diag-zakljucek-${n}"></div>
  `;
  container.appendChild(div);

  // Event listenerji za badge in zaključek
  div.querySelectorAll("select, input, textarea").forEach(el => {
    el.addEventListener("input", () => {
      posodobiDiagBadge(n);
      shraniStanje();
    });
    el.addEventListener("change", () => {
      posodobiDiagBadge(n);
      shraniStanje();
    });
  });

  posodobiDiagBadge(n);
}

function ureOptions(selected) {
  let html = "";
  for (let i = 1; i <= 12; i++) {
    html += `<option value="${i}" ${selected == i ? "selected" : ""}>${i}h</option>`;
  }
  return html;
}

function posodobiDiagBadge(n) {
  const pirads = document.querySelector(`.lez-pirads[data-id="${n}"]`)?.value;
  const badge = document.getElementById(`diag-pirads-badge-${n}`);
  const zakljucekEl = document.getElementById(`diag-zakljucek-${n}`);
  if (!badge) return;

  if (pirads) {
    badge.textContent = `PI-RADS ${pirads}`;
    badge.className = "pirads-badge pirads-" + pirads;
  } else {
    badge.textContent = "PI-RADS —";
    badge.className = "pirads-badge";
  }

  // Zaključek za to lezijo
  if (pirads && zakljucekEl) {
    const psad = parseFloat(document.getElementById("psad").value);
    const starost = parseInt(document.getElementById("starost").value);
    const p = parseInt(pirads);
    let priporocilo = "";

    if (p >= 4) {
      priporocilo = "Svetujem ciljano biopsijo spremembe.";
    } else if (p === 3) {
      if (!isNaN(psad) && psad > 0.15) {
        priporocilo = `Svetujem ciljano biopsijo spremembe (PI-RADS 3, PSAD ${psad.toFixed(2)} ng/ml/cc > 0,15).`;
      } else if (!isNaN(starost) && starost < 65) {
        priporocilo = `Svetujem ciljano biopsijo spremembe (PI-RADS 3, starost < 65 let).`;
      } else {
        priporocilo = `Svetujem klinično kontrolo in MRI sledenje (PI-RADS 3, nizek PSAD).`;
      }
    }

    zakljucekEl.textContent = priporocilo;
    zakljucekEl.style.display = priporocilo ? "block" : "none";
  }
}

document.getElementById("btn-dodaj-lezijo").addEventListener("click", () => {
  dodajLezijo();
  posodobiDcePrikaz();
  shraniStanje();
});

function posodobiDcePrikaz() {
  const jeBipar = document.getElementById("protokol").value.includes("Biparametrični");
  document.querySelectorAll(".lez-dce-group").forEach(el => {
    el.style.display = jeBipar ? "none" : "block";
  });
}

document.getElementById("protokol").addEventListener("change", posodobiDcePrikaz);


// ═══════════════════════════════════════════════════════════
// TAB 2 — AKTIVNO SPREMLJANJE (PRECISE v2)
// ═══════════════════════════════════════════════════════════

let steviloAsLezij = 0;

function dodajAsLezijo() {
  steviloAsLezij++;
  const n = steviloAsLezij;
  const container = document.getElementById("as-lezije-container");
  const div = document.createElement("div");
  div.className = "lezija-kartica";
  div.dataset.id = n;
  div.innerHTML = `
    <div class="lezija-header">
      <span class="lezija-naziv">Lezija ${n}</span>
      <span class="pirads-badge" id="as-precise-badge-${n}">PRECISE —</span>
    </div>
    <div class="precise-grid">
      <div class="precise-col">
        <div class="precise-col-label">Osnovni MR</div>
        <div class="field-group">
          <label>Velikost (mm)</label>
          <input type="number" class="as-baz-velikost" data-id="${n}" placeholder="mm — prazno če nevidna">
        </div>
        <div class="field-group">
          <label>PI-RADS</label>
          <select class="as-baz-pirads" data-id="${n}">
            <option value="">—</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <div class="precise-col">
        <div class="precise-col-label">Trenutni MR</div>
        <div class="field-group">
          <label>Cona</label>
          <select class="as-cona" data-id="${n}">
            <option value="PZ">PZ</option>
            <option value="TZ">TZ</option>
            <option value="AS">AS</option>
          </select>
        </div>
        <div class="field-group">
          <label>Lokacija</label>
          <select class="as-tretjina" data-id="${n}">
            <option value="bazalna">bazalna</option>
            <option value="srednja">srednja</option>
            <option value="apikalna">apikalna</option>
          </select>
        </div>
        <div class="field-group">
          <label>Stran</label>
          <select class="as-stran" data-id="${n}">
            <option value="desno">desno</option>
            <option value="levo">levo</option>
            <option value="sredinska">sredinska</option>
          </select>
        </div>
        <div class="field-group">
          <label>Velikost (mm)</label>
          <input type="number" class="as-cur-velikost" data-id="${n}" placeholder="mm — prazno če nevidna">
        </div>
        <div class="field-group">
          <label>PI-RADS</label>
          <select class="as-cur-pirads" data-id="${n}">
            <option value="">—</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
    </div>
    <div class="field-group" style="margin-top:8px">
      <label>Vidna na novi sekvenci glede na prejšnji MR</label>
      <select class="as-nova-sekvenca" data-id="${n}">
        <option value="ne">Ne</option>
        <option value="da">Da</option>
      </select>
    </div>
    <div class="lezija-zakljucek" id="as-zakljucek-${n}"></div>
  `;
  container.appendChild(div);

  div.querySelectorAll("select, input").forEach(el => {
    el.addEventListener("change", () => { izracunajPrecise(n); shraniStanje(); });
    el.addEventListener("input", () => { izracunajPrecise(n); shraniStanje(); });
  });

  izracunajPrecise(n);
}

function izracunajPrecise(n) {
  const bazVelikost = parseFloat(document.querySelector(`.as-baz-velikost[data-id="${n}"]`)?.value);
  const bazPirads = parseInt(document.querySelector(`.as-baz-pirads[data-id="${n}"]`)?.value);
  const curVelikost = parseFloat(document.querySelector(`.as-cur-velikost[data-id="${n}"]`)?.value);
  const bazVidnost = !isNaN(bazVelikost) ? "vidna" : "nevidna";
  const curVidnost = !isNaN(curVelikost) ? "vidna" : "nevidna";
  const curPirads = parseInt(document.querySelector(`.as-cur-pirads[data-id="${n}"]`)?.value);
  const novaSekvenca = document.querySelector(`.as-nova-sekvenca[data-id="${n}"]`)?.value;

  const badge = document.getElementById(`as-precise-badge-${n}`);
  const zakljucekEl = document.getElementById(`as-zakljucek-${n}`);
  if (!badge) return;

  let score = null;
  let opis = "";

  // Izračun volumna (ellipsoid formula simplified — samo 1 os na voljo)
  // Significant size change: >50% volume change ≈ >14% diameter change for sphere
  // Practical: use diameter directly — >50% vol ≈ oz pri kliničnem >2mm + 20% premer
  let velikostnaSpremembaPozitivna = false;
  if (!isNaN(bazVelikost) && !isNaN(curVelikost) && bazVelikost > 0) {
    const sprememba = (curVelikost - bazVelikost) / bazVelikost;
    // >50% volume ≈ >31% diameter (V = 4/3πr³, ΔV/V = (1+Δd)³ − 1)
    if (sprememba > 0.31) velikostnaSpremembaPozitivna = true;
  }

  const novaLezija = (bazVidnost === "nevidna" && curVidnost === "vidna" && !isNaN(curVelikost) && curVelikost >= 6);
  const piradsNarascanje = (!isNaN(bazPirads) && !isNaN(curPirads) && curPirads > bazPirads && curPirads >= 4);
  const piradsZmanjsanje = (!isNaN(bazPirads) && !isNaN(curPirads) && curPirads < bazPirads);
  const konspikuoznostPovecana = (novaSekvenca === "da");

  // PRECISE v2 algoritem
  if (curVidnost === "nevidna") {
    score = "3-NonV";
    opis = "Lezija ni vidna na trenutnem MR (PRECISE 3-NonV).";
  } else if (curVidnost === "vidna" && bazVidnost === "nevidna" && (isNaN(curVelikost) || curVelikost < 6)) {
    score = "3-V";
    opis = "Nova drobna vidna lezija < 6 mm, brez znakov signifikantnega napredovanja (PRECISE 3-V).";
  } else if (piradsZmanjsanje && !velikostnaSpremembaPozitivna) {
    score = "2";
    opis = "Zmanjšanje v konspikuoznosti ali PI-RADS score lezije (PRECISE 2).";
  } else if (curVidnost === "nevidna" && bazVidnost === "vidna") {
    score = "1";
    opis = "Prejšnja sumljiva sprememba ni več vidna (PRECISE 1).";
  } else if (novaLezija || velikostnaSpremembaPozitivna || piradsNarascanje || konspikuoznostPovecana) {
    score = "4";
    opis = "Znaki radiološkega napredovanja — ";
    if (novaLezija) opis += "nova lezija ≥ 6 mm; ";
    if (velikostnaSpremembaPozitivna) opis += "signifikantno povečanje velikosti (> ~50% vol); ";
    if (piradsNarascanje) opis += "zvišanje PI-RADS na 4 ali 5; ";
    if (konspikuoznostPovecana) opis += "vidna na novi sekvenci; ";
    opis = opis.replace(/; $/, "") + " (PRECISE 4). Svetujem ponovitev biopsije.";
  } else if (curVidnost === "vidna") {
    score = "3-V";
    opis = "Stabilna vidna lezija, brez znakov signifikantne spremembe (PRECISE 3-V).";
  } else {
    score = "3-NonV";
    opis = "Stabilna preiskava (PRECISE 3-NonV).";
  }

  // Badge
  const scoreLabel = score ? `PRECISE ${score}` : "PRECISE —";
  badge.textContent = scoreLabel;
  badge.className = "pirads-badge precise-" + (score || "none");

  if (zakljucekEl) {
    zakljucekEl.textContent = opis;
    zakljucekEl.style.display = opis ? "block" : "none";
  }
}

document.getElementById("btn-as-dodaj-lezijo").addEventListener("click", () => {
  dodajAsLezijo();
  shraniStanje();
});

// Prva lezija ob zagonu
dodajAsLezijo();


// ═══════════════════════════════════════════════════════════
// TAB 3 — LOKALNI RECIDIV (PI-RR)
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('input[name="zdravljenje"]').forEach(r => {
  r.addEventListener("change", () => {
    const jeRrp = r.value === "rrp";
    document.getElementById("pirr-rrp-section").style.display = jeRrp ? "block" : "none";
    document.getElementById("pirr-rt-section").style.display = jeRrp ? "none" : "block";
    shraniStanje();
  });
});

let steviloPirrRrpLezij = 0;
let steviloPirrRtLezij = 0;

function dodajPirrLezijo(tip) {
  const jeRrp = tip === "rrp";
  if (jeRrp) steviloPirrRrpLezij++; else steviloPirrRtLezij++;
  const n = jeRrp ? steviloPirrRrpLezij : steviloPirrRtLezij;
  const containerId = jeRrp ? "pirr-rrp-lezije-container" : "pirr-rt-lezije-container";
  const container = document.getElementById(containerId);

  const lokacije = jeRrp
    ? `<option value="anastomoza">Ob anastomozi</option>
       <option value="loza-desno">Prostatična loža desno</option>
       <option value="loza-levo">Prostatična loža levo</option>
       <option value="vezikule">Ob preostanku seminalnih vezikul</option>
       <option value="retrovezikalno">Retrovezikalno</option>`
    : `<option value="PZ-desno">PZ desno</option>
       <option value="PZ-levo">PZ levo</option>
       <option value="TZ-desno">TZ desno</option>
       <option value="TZ-levo">TZ levo</option>
       <option value="semenske-vezikule">Seminalne vezikule</option>`;

  const prefix = `${tip}-${n}`;
  const div = document.createElement("div");
  div.className = "lezija-kartica";
  div.innerHTML = `
    <div class="lezija-header">
      <span class="lezija-naziv">Lezija ${n}</span>
      <span class="pirads-badge" id="pirr-badge-${prefix}">PI-RR —</span>
    </div>
    <div class="lezija-polja">
      <div class="field-group">
        <label>Lokacija</label>
        <select class="pirr-lokacija" data-prefix="${prefix}">${lokacije}</select>
      </div>
      <div class="field-group">
        <label>Velikost (mm)</label>
        <input type="number" class="pirr-velikost" data-prefix="${prefix}" placeholder="mm">
      </div>
      <div class="field-group">
        <label>DWI score (1–5)</label>
        <select class="pirr-dwi" data-prefix="${prefix}">
          <option value="">—</option>
          <option value="1">1 — brez restrikcije</option>
          <option value="2">2 — minimalna restrikcija</option>
          <option value="3">3 — zmerna restrikcija</option>
          <option value="4">4 — izrazita restrikcija</option>
          <option value="5">5 — zelo izrazita restrikcija</option>
        </select>
      </div>
      <div class="field-group">
        <label>DCE score (1–5)</label>
        <select class="pirr-dce" data-prefix="${prefix}">
          <option value="">—</option>
          <option value="1">1 — brez zgodnjega KS</option>
          <option value="2">2 — minimalno zgodnje KS</option>
          <option value="3">3 — zmerno zgodnje KS</option>
          <option value="4">4 — izrazito zgodnje KS</option>
          <option value="5">5 — zelo izrazito zgodnje KS</option>
        </select>
      </div>
    </div>
    <div class="field-group" style="margin-top:8px">
      <label>Opis lezije (neobvezno)</label>
      <textarea class="pirr-opis" data-prefix="${prefix}" rows="2" placeholder="Morfološki opis na T2WI..."></textarea>
    </div>
    <div class="lezija-zakljucek" id="pirr-zakljucek-${prefix}"></div>
  `;
  container.appendChild(div);

  div.querySelectorAll("select, input").forEach(el => {
    el.addEventListener("change", () => { izracunajPirr(prefix); shraniStanje(); });
    el.addEventListener("input", () => { izracunajPirr(prefix); shraniStanje(); });
  });

  izracunajPirr(prefix);
}

function izracunajPirr(prefix) {
  const dwi = parseInt(document.querySelector(`.pirr-dwi[data-prefix="${prefix}"]`)?.value);
  const dce = parseInt(document.querySelector(`.pirr-dce[data-prefix="${prefix}"]`)?.value);
  const badge = document.getElementById(`pirr-badge-${prefix}`);
  const zakljucekEl = document.getElementById(`pirr-zakljucek-${prefix}`);
  if (!badge) return;

  if (isNaN(dwi) || isNaN(dce)) {
    badge.textContent = "PI-RR —";
    badge.className = "pirads-badge";
    if (zakljucekEl) zakljucekEl.style.display = "none";
    return;
  }

  let score = Math.max(dwi, dce);
  if (dwi >= 4 && dce >= 4) score = 5;

  badge.textContent = `PI-RR ${score}`;
  badge.className = `pirads-badge pirads-${score}`;

  let opis = "";
  if (score <= 2) opis = `PI-RR ${score}: Nizka verjetnost lokalnega recidiva.`;
  else if (score === 3) opis = `PI-RR 3: Nejasna sprememba — verjetnost recidiva nedoločljiva. Svetujem klinično korelacijo in MR kontrolo.`;
  else if (score === 4) opis = `PI-RR 4: Visoka verjetnost lokalnega recidiva. Svetujem ciljano biopsijo.`;
  else if (score === 5) opis = `PI-RR 5: Zelo visoka verjetnost lokalnega recidiva (DWI ${dwi}, DCE ${dce}). Svetujem ciljano biopsijo.`;

  if (zakljucekEl) {
    zakljucekEl.textContent = opis;
    zakljucekEl.style.display = "block";
  }
}

document.getElementById("btn-pirr-rrp-dodaj").addEventListener("click", () => {
  dodajPirrLezijo("rrp");
  shraniStanje();
});

document.getElementById("btn-pirr-rt-dodaj").addEventListener("click", () => {
  dodajPirrLezijo("rt");
  shraniStanje();
});

// Prva lezija ob zagonu za oba tipa
dodajPirrLezijo("rrp");
dodajPirrLezijo("rt");


// ═══════════════════════════════════════════════════════════
// GENERIRANJE POROČILA
// ═══════════════════════════════════════════════════════════

function generirajPorocilo() {
  izracunajVolumenInPSAD();

  const protokol = document.getElementById("protokol").value;
  const indikacija = document.getElementById("indikacija").value;
  const klinika = document.getElementById("klinika").value.trim();
  const psa = document.getElementById("psa").value;
  const psad = document.getElementById("psad").value;
  const piqual = document.getElementById("piqual").value;
  const sirina = document.getElementById("sirina").value;
  const visina = document.getElementById("visina").value;
  const dolzina = document.getElementById("dolzina").value;
  const volumen = document.getElementById("volumen").value;

  // Glava poročila
  const naslov = protokol.includes("Multiparametrični")
    ? `MR prostate s KS in MR dinamično slikanje\n${protokol}`
    : `MR prostate\n${protokol}`;

  let izpis = `${naslov}\n\nIndikacija: ${indikacija}`;
  if (klinika) izpis += `\nKlinični podatki: ${klinika}`;
  const dre = document.getElementById("dre").value.trim();
  if (dre) izpis += `\nDRE: ${dre}`;

  if (sirina && visina && dolzina) {
    izpis += `\n\nDimenzije prostate: ${sirina} × ${visina} × ${dolzina} mm`;
    if (volumen) izpis += `\nVolumen prostate: ${volumen} cc`;
  }
  if (psa) izpis += `\nPSA: ${psa} ng/ml`;
  else izpis += `\nVrednost PSA ni navedena.`;
  if (psa && psad) izpis += `\nPSAD: ${psad} ng/ml/cc`;
  if (piqual) izpis += `\nPI-QUAL v2: ${piqual}`;

  izpis += "\n";

  // ─── Tab 1: Diagnostika ───
  if (aktivniTab === "diagnostika") {
    const status = document.querySelector('input[name="status"]:checked').value;
    const periferna = document.getElementById("periferna").value;
    const prehodna = document.getElementById("prehodna").value;
    const limfne = document.getElementById("limfne").value;
    const skelet = document.getElementById("skelet").value;
    const ostalo = document.getElementById("ostalo").value.trim();

    if (status === "normalno") {
      izpis += `\n${periferna}\n${prehodna}`;
      const normSemenske = document.getElementById("norm-semenske").value;
      const normSnopa = document.getElementById("norm-snopa").value;
      const normPeriprostatično = document.getElementById("norm-periprostatično").value;
      izpis += `\n\nSeminalni vezikuli: ${normSemenske}.`;
      izpis += `\nNevrovaskularna snopa: ${normSnopa}.`;
      izpis += `\nPeriprostatično maščevje: ${normPeriprostatično}.`;
      izpis += `\n\nBrez proste tekočine v mali medenici.`;
      izpis += `\n${limfne}`;
      if (skelet) izpis += `\n${skelet}`;
      if (ostalo) izpis += `\n\n${ostalo}`;

      izpis += `\n\nZaključek:\n`;
      const vol = parseFloat(volumen);
      if (!isNaN(vol) && vol > 30) {
        izpis += `Prostata je povečana in spremenjena v sklopu benigno hiperplastičnih sprememb. V prostati ne vidim za PI-RADS 4 ali PI-RADS 5 sumljivih sprememb.`;
      } else {
        izpis += `Prostata je normalno velika. V prostati ne vidim znakov za maligno rast.`;
      }

    } else {
      // Sumljivo — lezije
      const lezijeDivs = document.querySelectorAll("#lezije-container .lezija-kartica");
      let lezijeOdstavki = [];
      let zakljuckiLezij = [];

      lezijeDivs.forEach((div, idx) => {
        const n = div.dataset.id;
        const cona = div.querySelector(`.lez-cona`)?.value || "";
        const tretjina = div.querySelector(`.lez-tretjina`)?.value || "";
        const stran = div.querySelector(`.lez-stran`)?.value || "";
        const uraOd = div.querySelector(`.lez-ura-od`)?.value || "";
        const uraDo = div.querySelector(`.lez-ura-do`)?.value || "";
        const velikost = div.querySelector(`.lez-velikost`)?.value || "";
        const pirads = div.querySelector(`.lez-pirads`)?.value || "";
        const t2 = div.querySelector(`.lez-t2`)?.value?.trim() || "";
        const dwiTekst = div.querySelector(`.lez-dwi`)?.value?.trim() || "";
        const dceTekst = div.querySelector(`.lez-dce`)?.value?.trim() || "";

        let lokBesedilo = `${cona}, ${tretjina} tretjina, ${stran}`;
        if (uraOd && uraDo && uraOd !== uraDo) lokBesedilo += `, na ${uraOd}h do ${uraDo}h`;
        else if (uraOd) lokBesedilo += `, na ${uraOd}h`;

        let lezijaTekst = `Lezija ${idx + 1}: ${lokBesedilo}`;
        if (velikost) lezijaTekst += `, velikosti ${velikost} mm`;
        if (pirads) lezijaTekst += `, PI-RADS ${pirads}`;
        lezijaTekst += `.`;
        let sekv = [];
        if (t2) sekv.push(`na T2WI ${t2}`);
        if (dwiTekst) sekv.push(`na DWI ${dwiTekst}`);
        if (dceTekst) sekv.push(`na DCE ${dceTekst}`);
        if (sekv.length > 0) lezijaTekst += `\nLezija je ${sekv.join(", ")}.`;
        lezijeOdstavki.push(lezijaTekst);

        // Zaključek
        if (pirads) {
          const psadNum = parseFloat(psad);
          const starost = parseInt(document.getElementById("starost").value);
          const p = parseInt(pirads);
          let zakLok = `${cona}, ${tretjina} tretjina, ${stran}`;
          if (uraOd && uraDo && uraOd !== uraDo) zakLok += `, na ${uraOd}h do ${uraDo}h`;
          else if (uraOd) zakLok += `, na ${uraOd}h`;
          let z = `Lezija ${idx + 1} (${zakLok}, ${velikost ? velikost + " mm, " : ""}PI-RADS ${pirads}): `;
          if (p >= 4) {
            z += "Svetujem ciljano biopsijo spremembe.";
          } else if (p === 3) {
            if (!isNaN(psadNum) && psadNum > 0.15) {
              z += `Svetujem ciljano biopsijo (PI-RADS 3, PSAD ${psadNum.toFixed(2)} > 0,15 ng/ml/cc).`;
            } else if (!isNaN(starost) && starost < 65) {
              z += `Svetujem ciljano biopsijo (PI-RADS 3, starost < 65 let).`;
            } else {
              z += `Svetujem klinično kontrolo in MRI sledenje (PI-RADS 3, nizek PSAD).`;
            }
          }
          if (z.endsWith(": ")) z = "";
          else zakljuckiLezij.push(z);
        }
      });

      izpis += `\n${lezijeOdstavki.join("\n\n")}`;

      // Pogojni izpis con glede na lokacijo lezij
      const coneLezij = Array.from(lezijeDivs).map(d => d.querySelector(".lez-cona")?.value || "");
      const imaLezijoPZ = coneLezij.some(c => c === "PZ");
      const imaLezijTZ = coneLezij.some(c => c === "TZ");

      const perifernaTekst = imaLezijoPZ
        ? periferna.replace(/^V periferni coni/, "Drugje v periferni coni")
        : periferna;
      const prehodnaTekst = imaLezijTZ
        ? prehodna.replace(/^V prehodni coni so vidni inkapsulirani noduli, PI-RADS 1\./, "V prehodni coni so vidni še inkapsulirani noduli.")
        : prehodna;

      izpis += `\n\n${perifernaTekst}\n${prehodnaTekst}`;

      const epe = document.getElementById("epe").value;
      const semenske = document.getElementById("semenske").value;
      const snopa = document.getElementById("snopa").value;
      izpis += `\n\nEkstrakapsularno širjenje: ${epe}`;
      izpis += `\nSeminalni vezikuli: ${semenske}`;
      izpis += `\nNevrovaskularna snopa: ${snopa}`;

      izpis += `\n\n${limfne}\n${skelet}`;
      if (ostalo) izpis += `\n\n${ostalo}`;

      if (zakljuckiLezij.length > 0) {
        izpis += `\n\nZaključek:\n${zakljuckiLezij.join("\n")}`;
      }
    }
  }

  // ─── Tab 2: Aktivno spremljanje ───
  else if (aktivniTab === "aktivno") {
    const datBazalni = document.getElementById("as-datum-bazalni").value;
    const datPrejsnji = document.getElementById("as-datum-prejsnji").value;
    const biopsija = document.getElementById("as-biopsija").value.trim();
    const asPeriferna = document.getElementById("as-periferna").value;
    const asPrehodna = document.getElementById("as-prehodna").value;
    const asEpe = document.getElementById("as-epe").value;
    const asSemenske = document.getElementById("as-semenske").value;
    const asOstalo = document.getElementById("as-ostalo").value.trim();

    if (datBazalni) izpis += `\nOsnovni MR: ${formatDatum(datBazalni)}`;
    if (datPrejsnji) izpis += `\nPrejšnji MR: ${formatDatum(datPrejsnji)}`;
    if (biopsija) izpis += `\nHistološki izvid: ${biopsija}`;

    // Lezije
    const asDivs = document.querySelectorAll("#as-lezije-container .lezija-kartica");
    let vidneLezije = [];      // lezije z meritvami
    let nevidneLezije = [];    // lezije brez meritev (3-NonV)
    let maxPreciseScore = 0;
    let maxPreciseLabel = "";
    let preciseZakljucki = [];

    const preciseVrstni = { "1": 1, "2": 2, "3-NonV": 3, "3-V": 3.5, "4": 4, "5": 5 };

    asDivs.forEach((div, idx) => {
      const n = div.dataset.id;
      const bazVelikost = div.querySelector(".as-baz-velikost")?.value;
      const bazPirads = div.querySelector(".as-baz-pirads")?.value;
      const cona = div.querySelector(".as-cona")?.value || "";
      const tretjina = div.querySelector(".as-tretjina")?.value || "";
      const stran = div.querySelector(".as-stran")?.value || "";
      const curVelikost = div.querySelector(".as-cur-velikost")?.value;
      const curPirads = div.querySelector(".as-cur-pirads")?.value;
      const badge = document.getElementById(`as-precise-badge-${n}`);
      const zakljucekEl = document.getElementById(`as-zakljucek-${n}`);
      const scoreText = badge ? badge.textContent.replace("PRECISE ", "") : "";
      const zakljucekTekst = zakljucekEl ? zakljucekEl.textContent : "";

      const jenevidna = !bazVelikost && !curVelikost;

      if (jenevidna) {
        // Nevidna lezija — ne generiramo vrstice lezije, samo zaključek
        nevidneLezije.push(scoreText);
      } else {
        // Vidna lezija
        let tekst = `Lezija ${idx + 1}: ${cona}, ${tretjina} tretjina, ${stran}`;
        if (bazVelikost && curVelikost) tekst += ` — velikost: ${bazVelikost} mm → ${curVelikost} mm`;
        else if (curVelikost) tekst += `, ${curVelikost} mm`;
        if (bazPirads && curPirads) tekst += `; PI-RADS: ${bazPirads} → ${curPirads}`;
        if (scoreText && scoreText !== "—") tekst += `; PRECISE ${scoreText}`;
        vidneLezije.push(tekst);

        if (zakljucekTekst) preciseZakljucki.push(`Lezija ${idx + 1}: ${zakljucekTekst}`);
      }

      // Max PRECISE score
      const v = preciseVrstni[scoreText] || 0;
      if (v > maxPreciseScore) {
        maxPreciseScore = v;
        maxPreciseLabel = scoreText;
      }
    });

    // Izpis vidnih lezij (samo če obstajajo)
    if (vidneLezije.length > 0) {
      izpis += `\n\n${vidneLezije.join("\n")}`;
    }

    // Periferna/prehodna — prilagojeno glede na cone vidnih lezij
    const conVideLezij = vidneLezije.map((_, i) => {
      const div = document.querySelectorAll("#as-lezije-container .lezija-kartica")[i];
      return div?.querySelector(".as-cona")?.value || "";
    });
    const imaVidnoPZ = conVideLezij.some(c => c === "PZ");
    const imaVidnoTZ = conVideLezij.some(c => c === "TZ");

    const perifernaAS = imaVidnoPZ
      ? asPeriferna.replace(/^V periferni coni/, "Drugje v periferni coni")
      : asPeriferna;
    const prehodnaAS = imaVidnoTZ
      ? asPrehodna.replace(/^V prehodni coni so vidni inkapsulirani noduli, stabilnega videza\./, "V prehodni coni so vidni še inkapsulirani noduli, stabilnega videza.")
      : asPrehodna;

    izpis += `\n\n${perifernaAS}\n${prehodnaAS}`;

    // EPE in seminalne vezikule — čist izpis
    const asEpeJeOk = asEpe.includes("Ni znakov");
    const asSemenskeJeOk = asSemenske.includes("Brez vidne infiltracije");
    if (asEpeJeOk) izpis += `\nNi znakov ekstrakapsularnega širjenja.`;
    else izpis += `\nEkstrakapsularno širjenje: ${asEpe}.`;
    if (asSemenskeJeOk) izpis += `\nBrez vidne infiltracije seminalnih vezikul.`;
    else izpis += `\n${asSemenske}.`;

    // Bezgavke, skelet, prosta tekočina
    izpis += `\nNi patološko povečanih bezgavk v mali medenici.`;
    izpis += `\nBrez sprememb v prikazanem skeletu.`;

    if (asOstalo) izpis += `\n\n${asOstalo}`;

    // Zaključek
    const vol = parseFloat(volumen);
    const bhp = !isNaN(vol) && vol > 30;
    izpis += `\n\nZaključek:`;

    if (maxPreciseLabel === "3-NonV" && vidneLezije.length === 0) {
      // Vse lezije nevidne
      izpis += `\nV prostati ne vidim za tumor oz. signifikantno lezijo suspektnih sprememb — stabilno stanje, PRECISE 3-NonV.`;
    } else if (preciseZakljucki.length > 0) {
      izpis += `\n${preciseZakljucki.join("\n")}`;
    }
    if (bhp) izpis += `\nProstata je povečana, spremenjena v sklopu BHP.`;
  }

  // ─── Tab 3: Lokalni recidiv (PI-RR) ───
  else if (aktivniTab === "recidiv") {
    const zdravljenje = document.querySelector('input[name="zdravljenje"]:checked').value;
    const datZdravljenja = document.getElementById("pirr-datum-zdravljenja").value;
    const psaNadir = document.getElementById("pirr-psa-nadir").value;
    const bezgavke = document.getElementById("pirr-bezgavke").value;
    const skelet = document.getElementById("pirr-skelet").value;
    const ostalo = document.getElementById("pirr-ostalo").value.trim();

    izpis += `\nPredhodno zdravljenje: ${zdravljenje === "rrp" ? "Radikalna prostatektomija" : "Radioterapija"}`;
    if (datZdravljenja) izpis += `, ${formatDatum(datZdravljenja)}`;
    if (psaNadir) izpis += `\nPSA nadir po zdravljenju: ${psaNadir} ng/ml`;

    const jeRrp = zdravljenje === "rrp";
    const containerId = jeRrp ? "pirr-rrp-lezije-container" : "pirr-rt-lezije-container";
    const pirrDivs = document.querySelectorAll(`#${containerId} .lezija-kartica`);

    let pirrLezijeOdstavki = [];
    let pirrZakljucki = [];
    let maxPirrScore = 0;

    pirrDivs.forEach((div, idx) => {
      const prefix = div.querySelector(".pirr-dwi")?.dataset.prefix || "";
      const lokacija = div.querySelector(".pirr-lokacija")?.value || "";
      const velikost = div.querySelector(".pirr-velikost")?.value || "";
      const dwi = div.querySelector(".pirr-dwi")?.value || "";
      const dce = div.querySelector(".pirr-dce")?.value || "";
      const opis = div.querySelector(".pirr-opis")?.value?.trim() || "";
      const badge = document.getElementById(`pirr-badge-${prefix}`);
      const zakljucekEl = document.getElementById(`pirr-zakljucek-${prefix}`);
      const scoreText = badge ? badge.textContent.replace("PI-RR ", "") : "";
      const zakljucekTekst = zakljucekEl ? zakljucekEl.textContent : "";

      let tekst = `Lezija ${idx + 1}: ${lokacija}`;
      if (velikost) tekst += `, ${velikost} mm`;
      if (dwi) tekst += `; DWI ${dwi}`;
      if (dce) tekst += `, DCE ${dce}`;
      if (scoreText && scoreText !== "—") tekst += ` → PI-RR ${scoreText}`;
      if (opis) tekst += `\n${opis}`;
      pirrLezijeOdstavki.push(tekst);

      if (zakljucekTekst) pirrZakljucki.push(`Lezija ${idx + 1}: ${zakljucekTekst}`);

      const s = parseInt(scoreText);
      if (!isNaN(s) && s > maxPirrScore) maxPirrScore = s;
    });

    if (jeRrp) {
      const anastomoza = document.getElementById("pirr-rrp-anastomoza").value;
      const semenske = document.getElementById("pirr-rrp-semenske").value;
      izpis += `\n\nVezikourethralna anastomoza: ${anastomoza}`;
      izpis += `\nPreostanki seminalnih vezikul: ${semenske}`;
    }

    if (pirrLezijeOdstavki.length > 0) {
      izpis += `\n\n${pirrLezijeOdstavki.join("\n\n")}`;
    }

    izpis += `\n\n${bezgavke}\n${skelet}`;
    if (ostalo) izpis += `\n\n${ostalo}`;

    if (maxPirrScore > 0) izpis += `\n\nSkupni PI-RR score: ${maxPirrScore}`;

    if (pirrZakljucki.length > 0) {
      izpis += `\n\nZaključek:\n${pirrZakljucki.join("\n")}`;
    }
  }

  const izpisEl = document.getElementById("izpis");
  izpisEl.value = izpis.trim();
  izpisEl.style.height = "auto";
  izpisEl.style.height = izpisEl.scrollHeight + "px";
}

function formatDatum(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
}

document.getElementById("btn-generiraj").addEventListener("click", generirajPorocilo);

document.getElementById("btn-kopiraj").addEventListener("click", () => {
  const izpis = document.getElementById("izpis");
  if (!izpis.value) { generirajPorocilo(); }
  navigator.clipboard.writeText(izpis.value)
    .catch(() => alert("Kopiranje ni uspelo."));
});

document.getElementById("btn-pocisti").addEventListener("click", () => {
  if (confirm("Počistiti vse podatke?")) {
    localStorage.removeItem("stanje");
    location.reload();
  }
});


// ═══════════════════════════════════════════════════════════
// LOCALSTORAGE
// ═══════════════════════════════════════════════════════════

function shraniStanje() {
  const skupna = {
    protokol: document.getElementById("protokol").value,
    psa: document.getElementById("psa").value,
    starost: document.getElementById("starost").value,
    sirina: document.getElementById("sirina").value,
    visina: document.getElementById("visina").value,
    dolzina: document.getElementById("dolzina").value,
    piqual: document.getElementById("piqual").value,
    indikacija: document.getElementById("indikacija").value,
    klinika: document.getElementById("klinika").value,
    dre: document.getElementById("dre").value,
    aktivniTab,
  };
  localStorage.setItem("stanje", JSON.stringify(skupna));
}

function naložiStanje() {
  const raw = localStorage.getItem("stanje");
  if (!raw) return;
  try {
    const s = JSON.parse(raw);
    const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
    set("protokol", s.protokol);
    set("psa", s.psa);
    set("starost", s.starost);
    set("sirina", s.sirina);
    set("visina", s.visina);
    set("dolzina", s.dolzina);
    set("piqual", s.piqual);
    set("indikacija", s.indikacija);
    set("klinika", s.klinika);
    set("dre", s.dre);
    izracunajVolumenInPSAD();

    // Nastavi tab
    if (s.aktivniTab) {
      const btn = document.querySelector(`.tab-btn[data-tab="${s.aktivniTab}"]`);
      if (btn) btn.click();
    }
  } catch (e) {}
}

// Avtomatsko shranjevanje ob spremembi kateregakoli polja v skupnih poljih
document.querySelectorAll("#skupna-polja select, #skupna-polja input, #skupna-polja textarea").forEach(el => {
  el.addEventListener("input", shraniStanje);
  el.addEventListener("change", shraniStanje);
});

naložiStanje();
