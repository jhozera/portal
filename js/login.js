 let mode = "login";
  let onStep2 = false;

  function setTab(t) {
    mode = t;
    document
      .getElementById("tabLogin")
      .classList.toggle("active", t === "login");
    document.getElementById("tabCPF").classList.toggle("active", t === "cpf");
    document.getElementById("pwField").style.display =
      t === "login" ? "" : "none";
    document.getElementById("btnTxt").textContent =
      t === "login" ? "Entrar e consultar" : "Consultar dívidas";
    hideErr();
  }

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

  function showErr(msg) {
    const el = document.getElementById("errMsg");
    document.getElementById("errTxt").textContent = msg;
    el.classList.add("err");
  }
  function hideErr() {
    document.getElementById("errMsg").classList.remove("err");
  }

  function togglePw() {
    const inp = document.getElementById("pw");
    const showing = inp.type === "text";
    inp.type = showing ? "password" : "text";
    document.getElementById("eyeIcon").innerHTML = showing
      ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
      : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  }

  function handleStep1() {
    hideErr();
    const cpf = document.getElementById("cpf").value;
    if (!cpf || cpf.replace(/\D/g, "").length < 11) {
      showErr("Informe um CPF válido (000.000.000-00).");
      document.getElementById("cpf").focus();
      return;
    }
    // Redireciona para a página de dívidas passando o CPF sem formatação
    const raw = cpf.replace(/\D/g, "");
    window.location.href = 'dividas.html?cpf=' + encodeURIComponent(raw);
  }

  function goToStep2(cpf) {
    onStep2 = true;
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").classList.add("show");
    document.getElementById("tabRow").style.display = "none";
    document.getElementById("divRow").style.display = "none";
    document.getElementById("altBtn").style.display = "none";
    document.getElementById("backBtn").style.opacity = "1";
    document.getElementById("backBtn").style.pointerEvents = "auto";
    document.getElementById("d1").classList.remove("active");
    document.getElementById("d1").classList.add("done");
    document.getElementById("d2").classList.add("active");
    document.getElementById("welcomeLabel").textContent = "Verificação";
    document.getElementById("formTitle").textContent =
      "Confirme sua identidade";
    document.getElementById("formSub").textContent =
      "Por segurança, enviaremos um código para confirmar o acesso.";
    document.getElementById("cpfDisplay").textContent = "CPF: " + cpf;
    setTimeout(() => document.getElementById("token").focus(), 100);
  }

  function goBack() {
    onStep2 = false;
    document.getElementById("step1").style.display = "";
    document.getElementById("step2").classList.remove("show");
    document.getElementById("tabRow").style.display = "";
    document.getElementById("divRow").style.display = "";
    document.getElementById("altBtn").style.display = "";
    document.getElementById("backBtn").style.opacity = "0";
    document.getElementById("backBtn").style.pointerEvents = "none";
    document.getElementById("d1").classList.add("active");
    document.getElementById("d1").classList.remove("done");
    document.getElementById("d2").classList.remove("active");
    document.getElementById("welcomeLabel").textContent = "Consultar dívidas";
    document.getElementById("formTitle").textContent = "Identifique-se";
    document.getElementById("formSub").textContent =
      "Informe seu CPF para encontrarmos seus débitos em aberto.";
    hideErr();
  }

  function handleStep2() {
    hideErr();
    const t = document.getElementById("token").value;
    if (!t || t.length < 6) {
      showErr("Informe o código de 6 dígitos recebido.");
      document.getElementById("token").focus();
      return;
    }
    alert("Acesso autorizado!\n(Redirecione para o painel de dívidas aqui)");
  }

  function handleAlt() {
    alert(
      "Integração com Gov.br / Certificado Digital\n(Implemente o OAuth aqui)",
    );
  }