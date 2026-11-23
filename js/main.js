"use strict";
(() => {
  const config = window.SITE_CONFIG;
  const supported = Object.keys(window.I18N).filter((language) =>
    window.GAMES.every((game) => Object.hasOwn(game.translations, language))
  );
  const byId = (id) => document.getElementById(id);
  const fallbackLanguage = supported.includes("en") ? "en" : supported[0];

  function initialLanguage() {
    // 隐私模式或存储被禁用时，仍可正常访问和切换语言。
    try {
      const saved = localStorage.getItem(config.languageStorageKey);
      if (supported.includes(saved)) return saved;
    } catch (_) { /* 无法持久化时采用浏览器语言。 */ }
    const browserLanguage = (navigator.language || "en").toLowerCase();
    if (browserLanguage.startsWith("zh")) {
      const subtags = browserLanguage.split("-");
      if (subtags.includes("hant")) return "zh-Hant";
      if (subtags.includes("hans")) return "zh-Hans";
      return subtags.some((part) => ["tw", "hk", "mo"].includes(part)) ? "zh-Hant" : "zh-Hans";
    }
    if (browserLanguage.startsWith("ja")) return "ja";
    return "en";
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // 图片加载成功后才显示；加载失败时留空，不显示编辑提示或破图。
  function media(path, alt) {
    const box = element("div", "media");
    if (typeof path !== "string" || !path.trim()) return box;
    const img = new Image();
    img.alt = alt;
    img.onload = () => { box.replaceChildren(img); };
    img.onerror = () => { /* 保持空白，避免破损图片图标。 */ };
    img.src = path;
    return box;
  }

  function safeLink(value) {
    if (!value || !value.trim()) return "";
    try {
      const url = new URL(value, document.baseURI);
      return ["https:", "http:"].includes(url.protocol) ? value : "";
    } catch (_) { return ""; }
  }

  function setLink(link, value, label) {
    const url = safeLink(value);
    link.removeAttribute("href");
    link.removeAttribute("aria-disabled");
    link.removeAttribute("role");
    link.removeAttribute("tabindex");
    link.setAttribute("aria-label", label);
    if (url) link.setAttribute("href", url);
    else { link.setAttribute("aria-disabled", "true"); link.setAttribute("role", "link"); }
  }

  function render(language) {
    // 忽略过期选项或无效存储值，避免读取不存在的翻译。
    if (!supported.includes(language)) {
      const current = document.documentElement.lang;
      language = supported.includes(current) ? current : fallbackLanguage;
    }
    const t = window.I18N[language];
    document.documentElement.lang = language;
    document.title = t.pageTitle;
    document.querySelector('meta[name="description"]').content = t.description;
    byId("language").value = language;
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t[node.dataset.i18n]; });
    byId("studio-logo").replaceChildren(media(config.studioLogo, config.studioName));

    const featured = window.GAMES.find((game) => game.id === config.featuredGameId) || window.GAMES[0];
    document.querySelector(".featured").hidden = !featured;
    if (featured) {
      const text = featured.translations[language];
      byId("featured-icon").replaceChildren(media(featured.icon, text.name));
      // 标题图未配置或加载失败时，回退到当前语言文字标题。
      const heading = byId("featured-title");
      heading.textContent = text.name;
      const titlePath = featured.titleImages?.[language];
      if (titlePath) {
        const titleImage = new Image();
        titleImage.alt = text.name;
        titleImage.onload = () => {
          if (document.documentElement.lang !== language) return;
          const wrapper = element("span", "media");
          wrapper.append(titleImage);
          heading.replaceChildren(wrapper);
        };
        titleImage.onerror = () => { /* 保留文字标题。 */ };
        titleImage.src = titlePath;
      }
      byId("featured-description").textContent = text.description;
      byId("play-image").replaceChildren(media(featured.playImages?.[language], "Google Play"));
      setLink(byId("play-link"), featured.storeUrl, t.playLabel);
    }

    const cards = window.GAMES.map((game) => {
      const text = game.translations[language];
      const card = element("article", "game-card");
      const icon = element("div", "card-icon");
      icon.append(media(game.icon, text.name));
      const copy = element("div", "card-copy");
      const tags = element("div", "tags");
      text.tags.forEach((tag) => tags.append(element("span", "tag", tag)));
      const link = element("a", "card-link", t.details);
      setLink(link, game.detailsUrl || game.storeUrl, t.details);
      copy.append(element("h3", "", text.name), tags, element("p", "", text.shortDescription), link);
      card.append(icon, copy);
      return card;
    });
    const coming = element("article", "game-card coming-soon");
    const icon = element("div", "card-icon");
    const comingSymbol = element("div", "coming-symbol", "+");
    comingSymbol.setAttribute("aria-hidden", "true");
    icon.append(comingSymbol);
    const copy = element("div", "card-copy");
    copy.append(element("h3", "", t.comingTitle), element("span", "tag", t.comingTag), element("p", "", t.comingDescription));
    coming.append(icon, copy);
    byId("game-list").replaceChildren(...cards, coming);

    const contact = byId("contact");
    const email = config.email.trim();
    contact.replaceChildren();
    if (email) {
      const link = element("a", "", email);
      link.href = `mailto:${email}`;
      contact.append(document.createTextNode(t.contactLabel), link);
    }
    contact.closest(".contact").hidden = !email;
    byId("year").textContent = new Date().getFullYear();
    return language;
  }

  // Favicon 没有页面内展示区域；失败时保留空图标，不额外添加草图外的区域。
  if (config.favicon) {
    const icon = new Image();
    icon.onload = () => { byId("favicon").href = config.favicon; };
    icon.onerror = () => { /* 使用默认空图标。 */ };
    icon.src = config.favicon;
  }
  byId("language").addEventListener("change", (event) => {
    const language = render(event.target.value);
    try { localStorage.setItem(config.languageStorageKey, language); } catch (_) { /* 切换仍然生效。 */ }
  });
  render(initialLanguage());
})();
