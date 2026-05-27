const DEBTS = [
  {
    id: 1,
    name: "Banco nubank",
    type: "Cartão de crédito",
    val: 3480.9,
    due: "Vencida há 8 meses",
    s: "overdue",
    sl: "Em atraso",
  },
  {
    id: 4,
    name: "Banco Bradesco",
    type: "Empréstimo pessoal",
    val: 7850.0,
    due: "Vencida há 14 meses",
    s: "overdue",
    sl: "Atraso grave",
  },
  {
    id: 5,
    name: "Banco Digio",
    type: "Empréstimo pessoal",
    val: 7850.0,
    due: "Vencida há 14 meses",
    s: "overdue",
    sl: "Atraso grave",
  },
];

const PLANS = [
  { id: "av", name: "À vista", n: 1, disc: 0.4, best: false },
  { id: "p3", name: "3× sem juros", n: 3, disc: 0.25, best: true },
  { id: "p6", name: "6× sem juros", n: 6, disc: 0.15, best: false },
  { id: "p12", name: "12× com juros", n: 12, disc: 0.05, best: false },
];

const fmt = (v) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

let sel = null;
let plan = null;

const total = () => {
  if (!sel) return 0;

  const debt = DEBTS.find((d) => d.id === sel);
  return debt ? debt.val : 0;
};

function renderDebts() {
  document.getElementById("debtList").innerHTML = DEBTS.map(
    (d) => `
    <div class="debt-row ${sel === d.id ? "selected" : ""}" data-id="${d.id}">
      <div class="dr-check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <div class="dr-info">
        <div class="dr-name">${d.name}</div>
        <div class="dr-type">${d.type}</div>
      </div>

      <span class="dr-badge ${d.s}">${d.sl}</span>

      <div class="dr-amount">
        <div class="dr-val">${fmt(d.val)}</div>
        <div class="dr-due">${d.due}</div>
      </div>
    </div>
  `,
  ).join("");

  document.querySelectorAll(".debt-row").forEach((el) =>
    el.addEventListener("click", () => {
      const id = +el.dataset.id;

      sel = sel === id ? null : id;

      plan = null;

      renderDebts();
      renderSide();
    }),
  );
}

function renderSide() {
  const t = total();
  const has = sel !== null;

  document.getElementById("sumEmpty").style.display = has
    ? "none"
    : "block";

  document.getElementById("sumLines").style.display = has
    ? "block"
    : "none";

  document.getElementById("sumTotal").style.display = has
    ? "flex"
    : "none";

  document.getElementById("plansCard").style.display = has
    ? "block"
    : "none";

  document.getElementById("confirmCard").style.display =
    has && plan ? "block" : "none";

  document.getElementById("errMsg").classList.remove("show");

  if (!has) return;

  const debt = DEBTS.find((d) => d.id === sel);

  document.getElementById("sumLines").innerHTML = `
    <div class="sum-line">
      <span class="sl-label">${debt.name}</span>
      <span class="sl-val red">${fmt(debt.val)}</span>
    </div>
  `;

  document.getElementById("sumTotalVal").textContent = fmt(t);

  document.getElementById("planList").innerHTML = PLANS.map((p) => {
    const fin = t * (1 - p.disc);
    const parc = fin / p.n;

    return `
      <div class="plan-item ${p.best ? "best" : ""} ${
        plan === p.id ? "selected" : ""
      }" data-plan="${p.id}">

        <div>
          <div class="plan-name">${p.name}</div>

          <div class="plan-parcel">
            ${p.n}× de ${fmt(parc)}
          </div>

          ${
            p.best
              ? '<span class="plan-badge">Recomendado</span>'
              : ""
          }
        </div>

        <div class="plan-right">
          <div class="plan-total">${fmt(fin)}</div>

          <div class="plan-disc">
            -${Math.round(p.disc * 100)}% desconto
          </div>
        </div>

        <div class="plan-radio">
          <div class="plan-dot"></div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".plan-item").forEach((el) =>
    el.addEventListener("click", () => {
      plan = el.dataset.plan;
      renderSide();
    }),
  );
}

document.getElementById("cpfInput").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 11);

  if (v.length > 9)
    v = v.replace(
      /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
      "$1.$2.$3-$4",
    );
  else if (v.length > 6)
    v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  else if (v.length > 3)
    v = v.replace(/(\d{3})(\d{1,3})/, "$1.$2");

  this.value = v;
});

document.getElementById("btnConfirm").addEventListener("click", () => {
  const cpf = document.getElementById("cpfInput").value;
  const err = document.getElementById("errMsg");

  if (cpf.replace(/\D/g, "").length !== 11) {
    err.textContent = "Informe um CPF válido.";
    err.classList.add("show");
    return;
  }

  err.classList.remove("show");

  const t = total();

  const p = PLANS.find((x) => x.id === plan);

  const fin = t * (1 - p.disc);
  const parc = fin / p.n;

  document.getElementById("receiptBody").innerHTML = [
    ["Protocolo", "AGR" + Date.now().toString().slice(-8)],
    ["Data", new Date().toLocaleDateString("pt-BR")],
    ["CPF", cpf],
    ["Plano", p.name],
    ["Parcelas", `${p.n}× de ${fmt(parc)}`],
    ["Desconto", `-${Math.round(p.disc * 100)}%`],
    ["Total a pagar", fmt(fin)],
  ]
    .map(
      ([l, v], i) => `
      <div class="receipt-row">
        <span class="rl">${l}</span>
        <span class="rv ${i === 6 ? "green" : ""}">${v}</span>
      </div>
    `,
    )
    .join("");

  document.getElementById("modal").classList.add("show");
});

document.getElementById("btnClear").addEventListener("click", () => {
  sel = null;
  plan = null;

  document.getElementById("cpfInput").value = "";

  renderDebts();
  renderSide();
});

document
  .getElementById("btnDl")
  .addEventListener("click", () => {
    alert("Comprovante enviado por e-mail! ✅");
  });

document.getElementById("btnRe").addEventListener("click", () => {
  document.getElementById("modal").classList.remove("show");

  sel = null;
  plan = null;

  document.getElementById("cpfInput").value = "";

  renderDebts();
  renderSide();
});

renderDebts();
renderSide();