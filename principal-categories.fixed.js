document.addEventListener("DOMContentLoaded", () => {
  function slugify(name) {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }

  function renderServiceCards() {
    const rows = document.querySelectorAll(".service-row");
    rows.forEach((row) => {
      const labelEl = row.querySelector(".service-label");
      // 1) remover qualquer imagem anterior inserida (remove hardcoded e geradas antes)
      row.querySelectorAll("img").forEach((el) => el.remove());
      // esvaziar o container .service-icon (se existir) para garantir que nenhum placeholder fique
      const iconContainer = row.querySelector(".service-icon");
      if (iconContainer) iconContainer.innerHTML = "";
      // remover qualquer elemento com classe placeholder dentro do card
      row.querySelectorAll(".placeholder").forEach((el) => el.remove());
      const serviceName = labelEl
        ? labelEl.textContent.trim()
        : row.textContent.trim();

      const img = document.createElement("img");

      // Regra 2: forçar nome minúsculo e sem espaços
      const filename = `categoria-${serviceName.toLowerCase().replace(/\s+/g, "-")}.png`;

      // Regra 1: usar caminho relativo simples
      const caminhoDaImagem = `${filename}`;

      img.src = caminhoDaImagem;
      img.alt = serviceName;
      img.loading = "lazy";
      img.className = "categoria-img";

      // Regra 4: manipulador de erro (evita loop se placeholder também falhar)
      img.onerror = () => {
        if (!img.src.includes("placeholder")) {
          img.onerror = null;
          img.src = "placeholder.png";
          console.error("Falha ao carregar:", img.src);
        }
      };

      // Regra 2/5: inserir a tag <img> dentro do container .service-icon se existir, senão como primeiro filho do card
      if (iconContainer) {
        iconContainer.prepend(img);
      } else {
        row.prepend(img);
      }
    });
  }

  renderServiceCards();
});
