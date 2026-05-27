 function openM() {
    document.getElementById("ovl").classList.add("open");
    setTimeout(() => document.getElementById("cpf").focus(), 200);
  }
  function closeM() {
    document.getElementById("ovl").classList.remove("open");
  }
  function overlayClick(e) {
    if (e.target === document.getElementById("ovl")) closeM();
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeM();
  });
  function maskCPF(i) {
    let v = i.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 9)
      v =
        v.slice(0, 3) +
        "." +
        v.slice(3, 6) +
        "." +
        v.slice(6, 9) +
        "-" +
        v.slice(9);
    else if (v.length > 6)
      v = v.slice(0, 3) + "." + v.slice(3, 6) + "." + v.slice(6);
    else if (v.length > 3) v = v.slice(0, 3) + "." + v.slice(3);
    i.value = v;
  }
  function doLogin() {
    const c = document.getElementById("cpf").value,
      s = document.getElementById("pw").value;
    if (!c || c.length < 14) {
      alert("Informe seu CPF completo.");
      document.getElementById("cpf").focus();
      return;
    }
    if (!s) {
      alert("Informe sua senha.");
      document.getElementById("pw").focus();
      return;
    }
    alert("Redirecionando...\n(Integre com seu backend aqui)");
  }
  function doCPF() {
    const c = document.getElementById("cpf").value;
    if (!c || c.length < 14) {
      alert("Informe seu CPF antes de consultar.");
      document.getElementById("cpf").focus();
      return;
    }
    alert("Consultando CPF: " + c + "\n(Integre com sua API aqui)");
  }