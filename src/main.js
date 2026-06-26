const CLOUDINARY_CLOUD_NAME = "disj9fs8m";
    const CLOUDINARY_UPLOAD_PRESET = "get_uploads";
    const CLOUDINARY_UPLOAD_FOLDER = "get/instituciones";

    const imageBank = {
      campus: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
      students: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
      classroom: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
      lab: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
      graduation: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
      fair: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
      video: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      design: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      santa: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
      siglo: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
      ies: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?auto=format&fit=crop&w=1200&q=80"
    };

    const defaultInstitutions = [
      {
        name: "Universidad Siglo 21",
        logo: "US21",
        type: "Privada",
        city: ["ConcepciÃ³n", "Monteros", "Aguilares"],
        plan: "Premium",
        slogan: "EstudiÃ¡ con flexibilidad y proyectÃ¡ tu carrera desde TucumÃ¡n.",
        desc: "EducaciÃ³n innovadora, profesional y conectada con el mundo.",
        address: "San MartÃ­n 124, ConcepciÃ³n",
        whatsapp: "3865 41 2020",
        image: imageBank.siglo,
        media: "Video institucional",
        careers: [
          ["AbogacÃ­a", "FormaciÃ³n jurÃ­dica con modalidad flexible y acompaÃ±amiento tutorial.", imageBank.classroom],
          ["Contador PÃºblico", "Herramientas contables, impositivas y financieras para empresas.", imageBank.students],
          ["Lic. en AdministraciÃ³n", "GestiÃ³n, liderazgo y estrategia para organizaciones actuales.", imageBank.design],
          ["Higiene y Seguridad", "PrevenciÃ³n, normativa y seguridad aplicada al trabajo.", imageBank.lab]
        ]
      },
      {
        name: "Instituto Santa BÃ¡rbara",
        logo: "ISB",
        type: "Terciario Privado",
        city: ["ConcepciÃ³n", "Aguilares"],
        plan: "Premium",
        slogan: "FormaciÃ³n tÃ©cnica para integrarte rÃ¡pido al mundo laboral.",
        desc: "FormaciÃ³n terciaria con valores, prÃ¡cticas y salida laboral.",
        address: "Belgrano 810, Aguilares",
        whatsapp: "3865 55 1188",
        image: imageBank.santa,
        media: "Video institucional",
        careers: [
          ["InstrumentaciÃ³n QuirÃºrgica", "CapacitaciÃ³n para asistir procedimientos en Ã¡mbitos de salud.", imageBank.lab],
          ["Laboratorio de AnÃ¡lisis ClÃ­nicos", "TÃ©cnicas de laboratorio, muestras y protocolos de calidad.", imageBank.classroom],
          ["DiagnÃ³stico por ImÃ¡genes", "FormaciÃ³n en tecnologÃ­a aplicada a estudios mÃ©dicos.", imageBank.students]
        ]
      },
      {
        name: "Instituto del Sur",
        logo: "IDS",
        type: "Terciario",
        city: ["Monteros"],
        plan: "Profesional",
        slogan: "Tecnicaturas orientadas a una salida laboral concreta.",
        desc: "FormaciÃ³n tÃ©cnica y profesional en Ã¡reas comerciales, administrativas y digitales.",
        address: "Av. Mitre 420, ConcepciÃ³n",
        whatsapp: "3865 44 8712",
        image: imageBank.students,
        media: "Video de carreras",
        careers: [
          ["Marketing", "PlanificaciÃ³n comercial, comunicaciÃ³n y campaÃ±as digitales.", imageBank.design],
          ["Recursos Humanos", "SelecciÃ³n, capacitaciÃ³n y gestiÃ³n de equipos.", imageBank.fair],
          ["AdministraciÃ³n de Empresas", "OrganizaciÃ³n, procesos y gestiÃ³n operativa.", imageBank.classroom]
        ]
      },
      {
        name: "Centro de FormaciÃ³n TucumÃ¡n",
        logo: "CFT",
        type: "CapacitaciÃ³n",
        city: ["Monteros", "Aguilares"],
        plan: "BÃ¡sico",
        slogan: "Cursos cortos para fortalecer tu perfil laboral.",
        desc: "Capacitaciones prÃ¡cticas para jÃ³venes y adultos que buscan ampliar oportunidades.",
        address: "Rivadavia 295, Monteros",
        whatsapp: "3863 40 2100",
        image: imageBank.fair,
        media: "Imagen superior",
        careers: [
          ["Auxiliar Administrativo", "Tareas de oficina, atenciÃ³n y documentaciÃ³n comercial.", imageBank.classroom],
          ["Secretariado", "OrganizaciÃ³n, comunicaciÃ³n y soporte administrativo.", imageBank.students],
          ["Operador de PC", "Herramientas digitales esenciales para el trabajo.", imageBank.design]
        ]
      },
      {
        name: "Instituto San Miguel",
        logo: "ISM",
        type: "Instituto",
        city: ["Monteros"],
        plan: "Profesional",
        slogan: "EducaciÃ³n cercana para acompaÃ±ar vocaciones de servicio.",
        desc: "Propuestas presenciales y a distancia vinculadas a educaciÃ³n, salud y comunidad.",
        address: "Laprida 660, Monteros",
        whatsapp: "3863 47 6400",
        image: imageBank.classroom,
        media: "Imagen superior",
        careers: [
          ["Profesorado", "FormaciÃ³n pedagÃ³gica con prÃ¡cticas y acompaÃ±amiento.", imageBank.classroom],
          ["GestiÃ³n Educativa", "Herramientas para coordinar proyectos institucionales.", imageBank.students],
          ["AcompaÃ±ante TerapÃ©utico", "IntervenciÃ³n, apoyo y seguimiento en contextos de cuidado.", imageBank.lab]
        ]
      },
      {
        name: "Academia Profesional Norte",
        logo: "APN",
        type: "Academia",
        city: ["Aguilares"],
        plan: "BÃ¡sico",
        slogan: "Capacitaciones digitales para empezar a trabajar.",
        desc: "Cursos prÃ¡cticos de diseÃ±o, redes sociales, ventas y herramientas digitales.",
        address: "Moreno 575, Aguilares",
        whatsapp: "3865 60 7711",
        image: imageBank.design,
        media: "Video de alumnos",
        careers: [
          ["DiseÃ±o GrÃ¡fico", "Piezas visuales, identidad y herramientas de diseÃ±o.", imageBank.design],
          ["Community Manager", "PlanificaciÃ³n de contenido, redes y mÃ©tricas.", imageBank.video],
          ["Ventas Digitales", "Embudo comercial, atenciÃ³n online y cierre de ventas.", imageBank.fair]
        ]
      },
      {
        name: "IES ConcepciÃ³n",
        logo: "IES",
        type: "PÃºblico",
        city: ["ConcepciÃ³n"],
        plan: "BÃ¡sico",
        slogan: "EducaciÃ³n pÃºblica, gratuita y de calidad para todos.",
        desc: "EducaciÃ³n pÃºblica, gratuita y de calidad para todos.",
        address: "EspaÃ±a 320, ConcepciÃ³n",
        whatsapp: "3865 50 3300",
        image: imageBank.ies,
        media: "Imagen superior",
        careers: [
          ["Profesorado de EducaciÃ³n Primaria", "FormaciÃ³n docente para nivel primario.", imageBank.classroom],
          ["Tecnicatura en AdministraciÃ³n", "GestiÃ³n administrativa para organizaciones pÃºblicas y privadas.", imageBank.students],
          ["Profesorado de InglÃ©s", "FormaciÃ³n pedagÃ³gica y prÃ¡ctica del idioma.", imageBank.fair]
        ]
      }
    ];

    function readStoredData(key, fallback) {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
      } catch (error) {
        return fallback;
      }
    }

    function normalizeInstitution(inst) {
      const fallbackGallery = [
        inst.image,
        imageBank.students,
        imageBank.classroom,
        imageBank.graduation
      ].filter(Boolean);
      return {
        ...inst,
        logoImage: inst.logoImage || "",
        logoPublicId: inst.logoPublicId || "",
        imagePublicId: inst.imagePublicId || "",
        featuredImage: inst.featuredImage || inst.image || imageBank.campus,
        featuredPublicId: inst.featuredPublicId || "",
        videoUrl: inst.videoUrl || "",
        videoPublicId: inst.videoPublicId || "",
        gallery: Array.isArray(inst.gallery) && inst.gallery.length ? inst.gallery : fallbackGallery,
        careers: (inst.careers || []).map(career => normalizeCareer(career, inst))
      };
    }

    function normalizeCareer(career, inst = {}) {
      const legacy = Array.isArray(career);
      const name = legacy ? career[0] : career.name;
      const description = legacy ? career[1] : career.description;
      const originalImage = (legacy ? career[2] : career.image) || imageBank.classroom;
      const image = originalImage.includes("photo-1581093458791-9f3c3900df7b") ? imageBank.lab : originalImage;
      return {
        id: legacy ? slugifyCareer(name) + "-" + Math.random().toString(36).slice(2, 7) : (career.id || slugifyCareer(name) + "-" + Math.random().toString(36).slice(2, 7)),
        name: name || "",
        description: description || "",
        image,
        publicId: (legacy ? career[3] : career.publicId) || "",
        duration: legacy ? "3 aÃ±os" : (career.duration || "3 aÃ±os"),
        modality: legacy ? "Presencial" : (career.modality || "Presencial"),
        campus: legacy ? (inst.address || "Sede principal") : (career.campus || inst.address || "Sede principal"),
        shifts: legacy ? "Consultar" : (career.shifts || "Consultar"),
        degree: legacy ? (name || "") : (career.degree || name || ""),
        nationalValidity: legacy ? "SÃ­" : (career.nationalValidity || "SÃ­"),
        about: legacy ? (description || "") : (career.about || description || ""),
        workField: legacy ? "Ãmbitos pÃºblicos y privados relacionados con la formaciÃ³n profesional." : (career.workField || ""),
        graduateProfile: legacy ? "Profesional preparado para aplicar conocimientos y desarrollarse en su Ã¡rea." : (career.graduateProfile || ""),
        studyPlan: legacy ? ["Primer aÃ±o", "Segundo aÃ±o", "Tercer aÃ±o"] : (Array.isArray(career.studyPlan) ? career.studyPlan : splitLines(career.studyPlan)),
        requirements: legacy ? ["DNI", "TÃ­tulo secundario", "Formulario de inscripciÃ³n"] : (Array.isArray(career.requirements) ? career.requirements : splitLines(career.requirements)),
        faq: legacy ? [
          { question: "Â¿CuÃ¡ndo comienzan las inscripciones?", answer: "ConsultÃ¡ con la instituciÃ³n para conocer las prÃ³ximas fechas." },
          { question: "Â¿CÃ³mo solicito mÃ¡s informaciÃ³n?", answer: "PodÃ©s utilizar WhatsApp o el formulario de esta pÃ¡gina." }
        ] : (Array.isArray(career.faq) ? career.faq : []),
        whatsapp: legacy ? (inst.whatsapp || "") : (career.whatsapp || inst.whatsapp || ""),
        formEnabled: legacy ? true : career.formEnabled !== false
      };
    }

    function slugifyCareer(value) {
      return normalizeCityText(value || "carrera").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    function splitLines(value) {
      return String(value || "").split(/\r?\n/).map(item => item.trim()).filter(Boolean);
    }

    function mediaItemUrl(item) {
      return typeof item === "string" ? item : (item && item.url) || "";
    }

    function mediaItemPublicId(item) {
      return typeof item === "object" && item ? item.publicId || "" : "";
    }

    let institutions = readStoredData("guiaEducativaInstitutions", JSON.parse(JSON.stringify(defaultInstitutions))).map(normalizeInstitution);
    let leads = readStoredData("guiaEducativaLeads", []);

    const newsTemplates = [
      ["Evento", "Jornada abierta para conocer carreras, docentes y modalidades de cursado.", imageBank.fair, "Imagen"],
      ["Feria", "ParticipaciÃ³n en expo educativa con asesoramiento para estudiantes.", imageBank.students, "Video"],
      ["GraduaciÃ³n", "Nueva promociÃ³n de egresados celebrada junto a familias y docentes.", imageBank.graduation, "Imagen"],
      ["Noticias", "Inscripciones abiertas, beneficios vigentes y novedades acadÃ©micas.", imageBank.video, "Video"]
    ];

    let currentCity = "ConcepciÃ³n";
    let currentInstitution = institutions[0];
    let currentCareer = null;
    let featuredIndex = 0;
    let featuredSource = [];
    let featuredTouchStart = 0;
    let featuredTimer;
    let featuredPaused = false;
    let institutionSearchResults = null;
    let adminInstitutionIndex = 0;
    let currentAdminView = "dashboard";
    let adminCities = readStoredData("guiaEducativaCities", ["ConcepciÃ³n", "Monteros", "Aguilares"]);

    const pages = ["cityPage", "detailPage", "careerPage", "coursesPage", "aboutPage", "eventsPage", "contactPage", "loginPage", "adminPage"];

    function setHeaderMode(homeVisible) {
      document.getElementById("homeHeader").classList.toggle("hidden", !homeVisible);
      document.getElementById("siteHeader").classList.toggle("visible", !homeVisible);
      document.querySelector(".admin-fab").classList.toggle("hidden", !homeVisible);
      if (homeVisible) closeSiteMenu();
    }

    function openSiteMenu() {
      document.getElementById("siteMenu").classList.add("open");
    }

    function closeSiteMenu() {
      document.getElementById("siteMenu").classList.remove("open");
    }

    function applyTheme(theme) {
      const darkMode = theme === "dark";
      document.body.classList.toggle("dark-theme", darkMode);
      localStorage.setItem("guiaEducativaTheme", darkMode ? "dark" : "light");

      const toggle = document.getElementById("themeToggle");
      if (toggle) {
        const label = darkMode ? "Activar modo claro" : "Activar modo oscuro";
        toggle.setAttribute("aria-label", label);
        toggle.setAttribute("title", label);
      }
    }

    function toggleTheme() {
      applyTheme(document.body.classList.contains("dark-theme") ? "light" : "dark");
    }

    function setFooterVisible(visible) {
      document.getElementById("siteFooter").classList.toggle("hidden", !visible);
    }

    function footerComingSoon(item) {
      alert(item + " estarÃ¡ disponible prÃ³ximamente.");
    }

    function hidePages() {
      clearInterval(featuredTimer);
      pages.forEach(id => document.getElementById(id).classList.remove("active"));
      document.getElementById("home").classList.add("hidden");
      setHeaderMode(false);
    }

    function setActiveNav(name) {
      document.querySelectorAll("nav button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.nav === name);
      });
    }

    function goHome() {
      pages.forEach(id => document.getElementById(id).classList.remove("active"));
      document.getElementById("home").classList.remove("hidden");
      setHeaderMode(true);
      setFooterVisible(false);
      setActiveNav("inicio");
      clearCitySearch();
      window.scrollTo(0, 0);
    }

    function normalizeCityText(value) {
      return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    function filterCities(value) {
      const query = normalizeCityText(value);
      let visibleCount = 0;
      document.querySelectorAll(".city-card").forEach(card => {
        const matches = normalizeCityText(card.dataset.city).includes(query);
        card.classList.toggle("hidden", !matches);
        if (matches) visibleCount++;
      });
      document.getElementById("cityEmptyState").classList.toggle("hidden", visibleCount !== 0);
    }

    function renderCityStats() {
      return;
      document.querySelectorAll("[data-city-stats]").forEach(container => {
        const city = container.dataset.cityStats;
        const localInstitutions = institutions.filter(inst => (inst.city || []).includes(city));
        let careers = 0;
        let courses = 0;

        localInstitutions.forEach(inst => {
          const quantity = (inst.careers || []).length;
          if (/academia|capacitaci[oÃ³]n|curso/i.test(inst.type || "")) {
            courses += quantity;
          } else {
            careers += quantity;
          }
        });

        container.innerHTML = `
          <span class="city-stat"><b>${localInstitutions.length}</b> instituciones</span>
          <span class="city-stat"><b>${careers}</b> carreras</span>
          <span class="city-stat"><b>${courses}</b> cursos</span>
        `;
      });
    }

    function firstVisibleCity() {
      return [...document.querySelectorAll(".city-card")].find(card => !card.classList.contains("hidden"));
    }

    function openSearchedCity() {
      const card = firstVisibleCity();
      if (card) showCity(card.dataset.city);
    }

    function handleCitySearchKey(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        openSearchedCity();
      }
    }

    function clearCitySearch() {
      const input = document.getElementById("citySearchInput");
      if (!input) return;
      input.value = "";
      filterCities("");
    }

    function cityInstitutions() {
      return institutions.filter(inst => inst.city.includes(currentCity));
    }

    function institutionModality(inst) {
      if (inst.plan === "Premium") return "Presencial y Online";
      if (/online|distancia|virtual/i.test(inst.desc + " " + inst.slogan)) return "Online";
      return "Presencial";
    }

    function institutionLevel(inst) {
      const text = (inst.type + " " + inst.name).toLowerCase();
      if (text.includes("universidad")) return "universidad";
      if (/curso|capacitaci|academia/.test(text)) return "curso";
      return "terciario";
    }

    function institutionAreas(inst) {
      const text = (inst.careers || []).map(career => career.name).join(" ").toLowerCase();
      const areas = [];
      if (/salud|quir|laboratorio|diagnÃ³stico|terapÃ©utico|higiene/.test(text)) areas.push("salud");
      if (/administr|contador|marketing|recursos humanos|ventas|secretariado/.test(text)) areas.push("administracion");
      if (/profesor|educaciÃ³n|inglÃ©s|gestiÃ³n educativa/.test(text)) areas.push("educacion");
      if (/diseÃ±o|community|pc|digital|program/.test(text)) areas.push("tecnologia");
      if (/abogac|derecho/.test(text)) areas.push("derecho");
      return areas;
    }

    function activeCityInstitutions() {
      return institutionSearchResults || cityInstitutions();
    }

    function showCity(city) {
      currentCity = city;
      hidePages();
      setActiveNav("");
      document.getElementById("cityPage").classList.add("active");
      setFooterVisible(true);
      document.getElementById("cityTitle").textContent = "Instituciones de " + city;
      institutionSearchResults = null;
      const searchForm = document.querySelector(".institution-search-bar");
      if (searchForm) searchForm.reset();
      featuredIndex = 0;
      featuredPaused = false;
      renderFeatured();
      renderCards();
      window.scrollTo(0, 0);
    }

    function renderFeatured() {
      const localPremium = cityInstitutions().filter(inst => inst.plan === "Premium");
      const otherPremium = institutions.filter(inst => inst.plan === "Premium" && !localPremium.includes(inst));
      const privateFallback = institutions.filter(inst => {
        const privateType = /privad|instituto|terciario/i.test(inst.type);
        return privateType && !localPremium.includes(inst) && !otherPremium.includes(inst);
      });
      featuredSource = [...localPremium, ...otherPremium, ...privateFallback].slice(0, 3);
      const track = document.getElementById("featuredTrack");
      track.innerHTML = "";

      featuredSource.forEach(inst => {
        const slide = document.createElement("article");
        slide.className = "featured-slide";
        slide.innerHTML = `
          <div class="featured-copy">
            <div class="featured-brand">
              <span class="featured-plan">â˜… InstituciÃ³n destacada</span>
            </div>
            <h3>${inst.name}</h3>
            <p>${inst.desc}</p>
            <button class="btn" type="button">Ver instituciÃ³n</button>
          </div>
          <div class="featured-media">
            <img src="${cloudinaryImage(inst.featuredImage || inst.image, 1600)}" alt="${inst.name}" />
          </div>
          <div class="featured-facts">
            <div class="featured-fact">
              <span class="featured-fact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 3v4M16 3v4M8 11h8"></path></svg>
              </span>
              <span><strong>Modalidad</strong><small>${institutionModality(inst)}</small></span>
            </div>
            <div class="featured-fact">
              <span class="featured-fact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 21V5l11-2v16"></path><path d="M5 7h11l3 3-3 3H5"></path></svg>
              </span>
              <span><strong>Carreras</strong><small>${(inst.careers || []).length} opciones</small></span>
            </div>
            <div class="featured-fact">
              <span class="featured-fact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>
              </span>
              <span><strong>Sedes</strong><small>${(inst.city || []).length} ciudades</small></span>
            </div>
          </div>
        `;
        slide.querySelector(".btn").onclick = () => showDetail(inst.name);
        track.appendChild(slide);
      });

      const viewport = document.getElementById("featuredViewport");
      viewport.ontouchstart = event => {
        featuredTouchStart = event.touches[0].clientX;
      };
      viewport.ontouchend = event => {
        const distance = event.changedTouches[0].clientX - featuredTouchStart;
        if (Math.abs(distance) > 45) changeFeatured(distance < 0 ? 1 : -1);
      };
      const slider = document.querySelector(".featured-slider");
      slider.onmouseenter = () => {
        featuredPaused = true;
        slider.dataset.autoplayPaused = "true";
        stopFeaturedAutoplay();
      };
      slider.onmouseleave = () => {
        featuredPaused = false;
        slider.dataset.autoplayPaused = "false";
        startFeaturedAutoplay();
      };
      slider.dataset.autoplayPaused = "false";
      updateFeatured();
      startFeaturedAutoplay();
    }

    function setFeatured(index) {
      if (!featuredSource.length) return;
      featuredIndex = (index + featuredSource.length) % featuredSource.length;
      updateFeatured();
    }

    function changeFeatured(direction) {
      setFeatured(featuredIndex + direction);
      startFeaturedAutoplay();
    }

    function stopFeaturedAutoplay() {
      clearInterval(featuredTimer);
    }

    function startFeaturedAutoplay() {
      clearInterval(featuredTimer);
      if (featuredPaused || featuredSource.length < 2) return;
      featuredTimer = setInterval(() => {
        featuredIndex = (featuredIndex + 1) % featuredSource.length;
        updateFeatured();
      }, 5200);
    }

    function updateFeatured() {
      if (!featuredSource.length) return;
      document.getElementById("featuredCount").textContent = `${featuredIndex + 1} / ${featuredSource.length}`;
      document.querySelectorAll(".featured-slide").forEach((slide, index) => {
        slide.classList.toggle("active", index === featuredIndex);
        slide.setAttribute("aria-hidden", index === featuredIndex ? "false" : "true");
      });
    }

    function applyInstitutionSearch() {
      const query = normalizeCityText(document.getElementById("institutionSearchInput").value);
      const modality = document.getElementById("institutionModalityFilter").value;
      const level = document.getElementById("institutionLevelFilter").value;
      institutionSearchResults = cityInstitutions().filter(inst => {
        const searchable = normalizeCityText([
          inst.name,
          inst.desc,
          ...(inst.careers || []).map(career => career.name)
        ].join(" "));
        const modalityText = normalizeCityText(institutionModality(inst));
        const modalityMatch = !modality
          || (modality === "mixta" && modalityText.includes("presencial") && modalityText.includes("online"))
          || (modality === "presencial" && modalityText.includes("presencial"))
          || (modality === "online" && modalityText.includes("online"));
        return (!query || searchable.includes(query))
          && modalityMatch
          && (!level || institutionLevel(inst) === level);
      });
      renderCards();
      document.getElementById("institutionCards").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderCards() {
      const container = document.getElementById("institutionCards");
      container.innerHTML = "";
      const source = activeCityInstitutions();
      document.getElementById("institutionSearchEmpty").classList.toggle("hidden", source.length !== 0);
      source.forEach(inst => {
        const card = document.createElement("article");
        card.className = "card";
        card.tabIndex = 0;
        card.setAttribute("role", "link");
        card.setAttribute("aria-label", `Ver instituciÃ³n ${inst.name}`);
        card.onclick = () => showDetail(inst.name);
        card.onkeydown = event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showDetail(inst.name);
          }
        };
        card.innerHTML = `
          <div class="card-media">
            <img src="${cloudinaryImage(inst.image, 900)}" alt="${inst.name}" />
            <span>${inst.media}</span>
          </div>
          <div class="card-body">
            <span class="badge">${inst.type}</span>
            <h3>${inst.name}</h3>
            <p>${inst.desc}</p>
            <button class="card-cta" type="button">
              Ver instituciÃ³n
              <svg viewBox="0 0 22 15" fill="none" aria-hidden="true">
                <path d="M4.583 7.5h12.834M11 3.125 17.417 7.5 11 11.875" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
          </div>
        `;
        card.querySelector(".card-cta").onclick = event => {
          event.stopPropagation();
          showDetail(inst.name);
        };
        container.appendChild(card);
      });
    }

    function showDetail(name) {
      const inst = institutions.find(item => item.name === name) || cityInstitutions()[0] || institutions[0];
      currentInstitution = inst;
      hidePages();
      setActiveNav("");
      document.getElementById("detailPage").classList.add("active");
      setFooterVisible(true);
      document.getElementById("detailCover").style.backgroundImage = `url("${cloudinaryImage(inst.image, 1800)}")`;
      document.getElementById("detailLogo").innerHTML = institutionLogoMarkup(inst, "detail-logo-image");
      document.getElementById("detailType").textContent = inst.type + " | " + currentCity;
      document.getElementById("instName").textContent = inst.name;
      document.getElementById("instSlogan").textContent = inst.slogan;
      renderInstitutionGallery(inst);
      renderCareers(inst);
      window.scrollTo(0, 0);
    }

    function renderInstitutionGallery(inst) {
      const gallery = document.getElementById("institutionGallery");
      if (!gallery) return;
      const items = (inst.gallery && inst.gallery.length ? inst.gallery : [inst.image, imageBank.students, imageBank.classroom])
        .map(mediaItemUrl)
        .filter(Boolean)
        .slice(0, 8);
      const repeatedItems = [...items, ...items];
      gallery.innerHTML = `
        <div class="creation-marquee" style="animation-duration:${Math.max(items.length, 1) * 2500}ms">
          <div class="creation-marquee-group">
            ${repeatedItems.map((url, index) => `
              <article class="creation-card" tabindex="0">
                <img src="${escapeHtml(cloudinaryImage(url, 700))}" alt="Foto ${index + 1} de ${escapeHtml(inst.name)}" />
                <div class="creation-card-overlay"><p>${escapeHtml(inst.name)}</p></div>
              </article>
            `).join("")}
          </div>
        </div>
      `;
    }

    function renderCareers(inst) {
      const careerGrid = document.getElementById("careerGrid");
      careerGrid.innerHTML = "";
      inst.careers.forEach((career, index) => {
        const card = document.createElement("article");
        card.className = "career-summary-card";
        const badge = careerCardBadge(career, index);
        const degree = career.degree && normalizeCityText(career.degree) !== normalizeCityText(career.name)
          ? `<p class="career-summary-degree">TÃ­tulo: ${escapeHtml(career.degree)}</p>`
          : `<p class="career-summary-degree">Propuesta acadÃ©mica con ficha completa disponible.</p>`;
        card.innerHTML = `
          <div class="career-summary-image-wrap">
            <img src="${cloudinaryImage(career.image, 700)}" alt="${escapeHtml(career.name)}" />
            <span class="career-summary-badge">${escapeHtml(badge)}</span>
          </div>
          <div class="career-summary-body">
            <p class="career-summary-overline">${escapeHtml(inst.name)} Â· ${escapeHtml(currentCity)}</p>
            <h3>${escapeHtml(career.name)}</h3>
            <div class="career-summary-meta">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>${escapeHtml(career.duration)}</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5h16v12H4z"></path><path d="M9 21h6"></path></svg>${escapeHtml(career.modality)}</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21s7-5 7-12a7 7 0 1 0-14 0c0 7 7 12 7 12Z"></path></svg>${escapeHtml(currentCity)}</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3 8 4-8 4-8-4 8-4Z"></path><path d="M6 10v5c3 2 9 2 12 0v-5"></path></svg>${escapeHtml(inst.type || "InstituciÃ³n")}</span>
            </div>
            ${degree}
            <div class="career-summary-actions">
              <button class="btn light career-view-button" type="button">Ver carrera</button>
              <button class="btn career-consult-button" type="button">Consultar</button>
            </div>
          </div>
        `;
        card.querySelector(".career-view-button").onclick = () => showCareer(career.id);
        card.querySelector(".career-consult-button").onclick = () => consultCareer(career);
        careerGrid.appendChild(card);
      });
    }

    function careerCardBadge(career, index) {
      if (career.status) return career.status;
      const badges = ["Inscripciones abiertas", "Nueva carrera", "PrÃ³ximo ingreso"];
      return badges[index % badges.length];
    }

    function consultCareer(career) {
      const number = (career.whatsapp || currentInstitution.whatsapp || "").replace(/\D/g, "");
      if (!number) {
        showCareer(career.id);
        return;
      }
      const international = number.startsWith("54") ? number : "54" + number;
      const text = "Hola, quiero consultar por la carrera " + career.name + " en " + currentInstitution.name;
      window.open("https://wa.me/" + international + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    }

    function showCareer(careerId) {
      const career = (currentInstitution.careers || []).find(item => item.id === careerId);
      if (!career) return;
      currentCareer = career;
      hidePages();
      setActiveNav("");
      document.getElementById("careerPage").classList.add("active");
      setFooterVisible(true);
      document.getElementById("careerPageInstitution").textContent = currentInstitution.name + " Â· " + currentCity;
      document.getElementById("careerPageName").textContent = career.name;
      document.getElementById("careerPageTitle").textContent = career.degree;
      document.getElementById("careerPageImage").src = cloudinaryImage(career.image, 1400);
      document.getElementById("careerPageImage").alt = career.name;
      document.getElementById("careerFacts").innerHTML = [
        ["DuraciÃ³n", career.duration],
        ["Sede", career.campus],
        ["TÃ­tulo", career.degree],
        ["Validez", career.nationalValidity],
        ["Turnos", career.shifts],
        ["Modalidad", career.modality]
      ].map(([label, value]) => `<div class="career-fact"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("");
      document.getElementById("careerHeroDescription").textContent = career.description;
      document.getElementById("careerAbout").textContent = career.about;
      document.getElementById("careerField").textContent = career.workField;
      document.getElementById("careerProfile").textContent = career.graduateProfile;
      document.getElementById("careerFieldChips").innerHTML = careerFieldOptions(career).map(item => `<span class="career-field-chip">${escapeHtml(item)}</span>`).join("");
      document.getElementById("careerStudyPlan").innerHTML = career.studyPlan.map((item, index) => `<li><strong>${index + 1}Â° AÃ±o</strong>${escapeHtml(item)}</li>`).join("");
      document.getElementById("careerRequirements").innerHTML = career.requirements.map(item => `<li>${escapeHtml(item)}</li>`).join("");
      document.getElementById("careerFaq").innerHTML = career.faq.map(item => `<div class="career-faq-item"><strong>${escapeHtml(item.question)}</strong><p>${escapeHtml(item.answer)}</p></div>`).join("");
      document.getElementById("careerQuickInstitution").textContent = currentInstitution.name;
      document.getElementById("careerQuickCampus").textContent = career.campus;
      document.getElementById("careerQuickDegree").textContent = career.degree;
      document.getElementById("careerQuickValidity").textContent = career.nationalValidity;
      const number = (career.whatsapp || currentInstitution.whatsapp).replace(/\D/g, "");
      const international = number.startsWith("54") ? number : "54" + number;
      document.getElementById("careerWhatsappButton").href = "https://wa.me/" + international + "?text=" + encodeURIComponent("Hola, quiero informaciÃ³n sobre " + career.name);
      document.getElementById("careerLeadForm").classList.toggle("hidden", !career.formEnabled);
      document.getElementById("careerFormMessage").classList.add("hidden");
      window.scrollTo(0, 0);
    }

    function careerFieldOptions(career) {
      const items = String(career.workField || "").split(/[.;]/).map(item => item.trim()).filter(item => item.length > 8);
      return items.length > 1 ? items.slice(0, 5) : [
        "Instituciones pÃºblicas y privadas",
        "Organizaciones vinculadas al sector",
        "Ejercicio profesional y consultorÃ­a"
      ];
    }

    function scrollCareerSection(id) {
      document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function backToInstitution() {
      showDetail(currentInstitution.name);
    }

    function saveCareerLead() {
      leads.unshift({
        date: new Date().toISOString(),
        institution: currentInstitution.name,
        name: document.getElementById("careerLeadName").value.trim(),
        phone: document.getElementById("careerLeadPhone").value.trim(),
        email: document.getElementById("careerLeadEmail").value.trim(),
        career: currentCareer.name,
        shift: document.getElementById("careerLeadShift").value,
        query: document.getElementById("careerLeadQuery").value.trim()
      });
      localStorage.setItem("guiaEducativaLeads", JSON.stringify(leads));
      document.getElementById("careerFormMessage").classList.remove("hidden");
      document.getElementById("careerLeadForm").reset();
    }

    function cleanText(value) {
      return String(value || "").replace(/[<>]/g, "").trim();
    }

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function cloudinaryImage(url, width = 1400) {
      if (!url || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url;
      return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
    }

    function cloudinaryVideo(url) {
      if (!url || !url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) return url;
      return url.replace("/video/upload/", "/video/upload/q_auto/");
    }

    function institutionLogoMarkup(inst, imageClass = "") {
      return inst.logoImage
        ? `<img class="${imageClass}" src="${escapeHtml(cloudinaryImage(inst.logoImage, 300))}" alt="Logo de ${escapeHtml(inst.name)}" />`
        : escapeHtml(inst.logo);
    }

    function validateUpload(file, resourceType) {
      const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (resourceType === "video") {
        if (file.type !== "video/mp4") throw new Error("El video debe estar en formato MP4.");
        if (file.size > 100 * 1024 * 1024) throw new Error("El video supera el lÃ­mite de 100 MB.");
        return;
      }
      if (!imageTypes.includes(file.type)) throw new Error("UsÃ¡ una imagen JPG, PNG, WebP o GIF.");
      if (file.size > 10 * 1024 * 1024) throw new Error("La imagen supera el lÃ­mite de 10 MB.");
    }

    function uploadToCloudinary(file, resourceType = "image", onProgress = () => {}) {
      validateUpload(file, resourceType);
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", CLOUDINARY_UPLOAD_FOLDER);

        const request = new XMLHttpRequest();
        request.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`);
        request.upload.onprogress = event => {
          if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
        };
        request.onload = () => {
          try {
            const response = JSON.parse(request.responseText);
            if (request.status < 200 || request.status >= 300) {
              throw new Error(response.error?.message || "Cloudinary rechazÃ³ el archivo.");
            }
            resolve({
              url: response.secure_url,
              publicId: response.public_id,
              resourceType: response.resource_type
            });
          } catch (error) {
            reject(error);
          }
        };
        request.onerror = () => reject(new Error("No se pudo conectar con Cloudinary."));
        request.send(formData);
      });
    }

    function renderUploadPreview(previewId, url, resourceType = "image", alt = "Vista previa") {
      const preview = document.getElementById(previewId);
      if (!preview) return;
      if (!url) {
        preview.innerHTML = resourceType === "video" ? "Sin video cargado" : "Sin imagen cargada";
        return;
      }
      preview.innerHTML = resourceType === "video"
        ? `<video src="${escapeHtml(cloudinaryVideo(url))}" controls muted playsinline preload="metadata"></video>`
        : `<img src="${escapeHtml(cloudinaryImage(url, 500))}" alt="${escapeHtml(alt)}" />`;
    }

    async function handleAdminUpload(event, targetId, previewId, resourceType) {
      const file = event.target.files[0];
      const target = document.getElementById(targetId);
      const status = document.getElementById(targetId + "Status");
      if (!file || !target || !status) return;
      status.className = "upload-status uploading";
      status.textContent = "Preparando archivo...";
      try {
        const uploaded = await uploadToCloudinary(file, resourceType, progress => {
          status.textContent = `Subiendo a Cloudinary: ${progress}%`;
        });
        target.value = uploaded.url;
        target.dataset.publicId = uploaded.publicId;
        target.dataset.resourceType = uploaded.resourceType;
        renderUploadPreview(previewId, uploaded.url, resourceType, file.name);
        status.className = "upload-status success";
        status.textContent = "Archivo subido correctamente.";
      } catch (error) {
        status.className = "upload-status error";
        status.textContent = error.message;
      }
      event.target.value = "";
    }

    function renderAdminGallery(items = []) {
      const list = document.getElementById("adminGalleryList");
      if (!list) return;
      list.innerHTML = items.map((item, index) => {
        const url = mediaItemUrl(item);
        return `
          <div class="gallery-editor-item" data-url="${escapeHtml(url)}" data-public-id="${escapeHtml(mediaItemPublicId(item))}">
            <img src="${escapeHtml(cloudinaryImage(url, 500))}" alt="Imagen ${index + 1} de la galerÃ­a" />
            <button class="gallery-remove" type="button" onclick="this.parentElement.remove()" aria-label="Eliminar imagen">Ã—</button>
          </div>
        `;
      }).join("");
    }

    async function handleGalleryUpload(event) {
      const files = [...event.target.files];
      const status = document.getElementById("adminGalleryStatus");
      if (!files.length || !status) return;
      status.className = "upload-status uploading";
      try {
        for (let index = 0; index < files.length; index++) {
          const uploaded = await uploadToCloudinary(files[index], "image", progress => {
            status.textContent = `Subiendo imagen ${index + 1} de ${files.length}: ${progress}%`;
          });
          const list = document.getElementById("adminGalleryList");
          list.insertAdjacentHTML("beforeend", `
            <div class="gallery-editor-item" data-url="${escapeHtml(uploaded.url)}" data-public-id="${escapeHtml(uploaded.publicId)}">
              <img src="${escapeHtml(cloudinaryImage(uploaded.url, 500))}" alt="Nueva imagen de la galerÃ­a" />
              <button class="gallery-remove" type="button" onclick="this.parentElement.remove()" aria-label="Eliminar imagen">Ã—</button>
            </div>
          `);
        }
        status.className = "upload-status success";
        status.textContent = "GalerÃ­a actualizada. GuardÃ¡ los cambios para confirmar.";
      } catch (error) {
        status.className = "upload-status error";
        status.textContent = error.message;
      }
      event.target.value = "";
    }

    function collectGalleryEditor() {
      return [...document.querySelectorAll("#adminGalleryList .gallery-editor-item")].map(item => ({
        url: item.dataset.url,
        publicId: item.dataset.publicId || ""
      })).filter(item => item.url);
    }

    async function handleCareerImageUpload(event, editor) {
      const file = event.target.files[0];
      const input = editor.querySelector(".career-image-input");
      const preview = editor.querySelector(".career-upload-preview");
      const status = editor.querySelector(".career-upload-status");
      if (!file) return;
      status.className = "upload-status uploading career-upload-status";
      try {
        const uploaded = await uploadToCloudinary(file, "image", progress => {
          status.textContent = `Subiendo: ${progress}%`;
        });
        input.value = uploaded.url;
        input.dataset.publicId = uploaded.publicId;
        preview.innerHTML = `<img src="${escapeHtml(cloudinaryImage(uploaded.url, 400))}" alt="${escapeHtml(file.name)}" />`;
        status.className = "upload-status success career-upload-status";
        status.textContent = "Imagen lista.";
      } catch (error) {
        status.className = "upload-status error career-upload-status";
        status.textContent = error.message;
      }
      event.target.value = "";
    }

    function persistInstitutions() {
      localStorage.setItem("guiaEducativaInstitutions", JSON.stringify(institutions));
      renderCityStats();
    }

    function isAdminAuthenticated() {
      return sessionStorage.getItem("guiaEducativaAdminSession") === "active";
    }

    function showAdmin() {
      if (!isAdminAuthenticated()) {
        showAdminLogin();
        return;
      }
      openAdminPanel();
    }

    function showAdminLogin() {
      hidePages();
      setActiveNav("");
      setFooterVisible(false);
      document.getElementById("loginPage").classList.add("active");
      document.getElementById("adminLoginError").textContent = "";
      document.getElementById("adminLoginUser").focus();
      window.scrollTo(0, 0);
    }

    function submitAdminLogin() {
      const username = document.getElementById("adminLoginUser").value.trim();
      const password = document.getElementById("adminLoginPassword").value;
      const error = document.getElementById("adminLoginError");

      if (username === "Hernan Sanchez" && password === "Nube") {
        sessionStorage.setItem("guiaEducativaAdminSession", "active");
        error.textContent = "";
        document.getElementById("adminLoginPassword").value = "";
        openAdminPanel();
        return;
      }

      error.textContent = "Usuario o contraseÃ±a incorrectos.";
    }

    function toggleAdminPassword(visible) {
      document.getElementById("adminLoginPassword").type = visible ? "text" : "password";
    }

    function logoutAdmin() {
      sessionStorage.removeItem("guiaEducativaAdminSession");
      document.getElementById("adminLoginUser").value = "";
      document.getElementById("adminLoginPassword").value = "";
      showAdminLogin();
    }

    function openAdminPanel() {
      hidePages();
      setActiveNav("");
      document.getElementById("adminPage").classList.add("active");
      document.getElementById("siteHeader").classList.remove("visible");
      setFooterVisible(false);
      adminInstitutionIndex = Math.min(adminInstitutionIndex, Math.max(0, institutions.length - 1));
      currentAdminView = "dashboard";
      renderAdmin();
      switchAdminView("dashboard");
      window.scrollTo(0, 0);
    }

    function renderAdmin() {
      renderAdminInstitutionList();
      loadAdminEditor(adminInstitutionIndex);
      renderAdminMetrics();
      renderLeads();
      renderAdminRecentLeads();
      renderAdminHierarchy();
      renderAdminCities();
      renderSliderInstitutionOptions();
    }

    function renderAdminMetrics() {
      const values = {
        metricInstitutions: institutions.length,
        metricCareers: institutions.reduce((total, item) => total + (item.careers || []).length, 0),
        metricPremium: institutions.filter(item => item.plan === "Premium").length,
        metricLeads: leads.length
      };
      Object.entries(values).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
      });
    }

    function switchAdminView(view) {
      currentAdminView = view;
      const viewIds = {
        dashboard: "adminViewDashboard",
        cities: "adminViewCities",
        institutions: "adminViewInstitutions",
        slider: "adminViewSlider",
        leads: "adminViewLeads",
        settings: "adminViewSettings"
      };
      document.querySelectorAll(".admin-view").forEach(section => {
        section.classList.toggle("active", section.id === viewIds[view]);
      });
      document.querySelectorAll("[data-admin-view]").forEach(button => {
        button.classList.toggle("active", button.dataset.adminView === view);
      });
      if (view === "leads") renderLeads();
      if (view === "dashboard") renderAdminRecentLeads();
      if (view === "cities") renderAdminCities();
      if (view === "slider") renderSliderInstitutionOptions();
      window.scrollTo(0, 0);
    }

    function renderAdminHierarchy() {
      const citySelect = document.getElementById("adminCitySelector");
      if (!citySelect) return;
      const selectedCity = citySelect.value || adminCities[0] || "";
      citySelect.innerHTML = adminCities.map(city => `<option>${escapeHtml(city)}</option>`).join("");
      citySelect.value = adminCities.includes(selectedCity) ? selectedCity : (adminCities[0] || "");
      updateAdminInstitutionSelector();
    }

    function updateAdminInstitutionSelector() {
      const city = document.getElementById("adminCitySelector").value;
      const select = document.getElementById("adminInstitutionSelector");
      const available = institutions.map((inst, index) => ({ inst, index })).filter(item => (item.inst.city || []).includes(city));
      select.innerHTML = available.length
        ? available.map(item => `<option value="${item.index}">${escapeHtml(item.inst.name)}</option>`).join("")
        : '<option value="">No hay instituciones</option>';
      if (available.length) {
        const selectedExists = available.some(item => item.index === adminInstitutionIndex);
        select.value = String(selectedExists ? adminInstitutionIndex : available[0].index);
        selectAdminHierarchyInstitution();
      } else {
        renderAdminSelectedSummary(null);
      }
    }

    function selectAdminHierarchyInstitution() {
      const value = document.getElementById("adminInstitutionSelector").value;
      if (value === "") return;
      adminInstitutionIndex = Number(value);
      loadAdminEditor(adminInstitutionIndex);
      renderAdminSelectedSummary(institutions[adminInstitutionIndex]);
    }

    function renderAdminSelectedSummary(inst) {
      const target = document.getElementById("adminSelectedSummary");
      if (!target) return;
      target.innerHTML = inst
        ? `<span class="mini-logo">${institutionLogoMarkup(inst, "detail-logo-image")}</span><span><strong>${escapeHtml(inst.name)}</strong><small>${escapeHtml(inst.type)} Â· ${escapeHtml((inst.city || []).join(", "))}</small></span>`
        : "<span><strong>Sin instituciones en esta ciudad</strong><small>AgregÃ¡ una instituciÃ³n desde el menÃº lateral.</small></span>";
    }

    function openInstitutionModule(module) {
      const inst = institutions[adminInstitutionIndex];
      if (!inst) return;
      switchAdminView("institutions");
      loadAdminEditor(adminInstitutionIndex);
      const targets = {
        general: "adminForm",
        careers: "adminCareersModule",
        featured: "adminFeaturedModule",
        gallery: "adminGalleryModule",
        contact: "adminContactModule"
      };
      if (module === "courses" || module === "events") {
        document.getElementById("adminStatus").textContent = module === "courses"
          ? "MÃ³dulo de cursos docentes seleccionado para " + inst.name + "."
          : "MÃ³dulo de eventos seleccionado para " + inst.name + ".";
        document.getElementById("adminForm").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      requestAnimationFrame(() => document.getElementById(targets[module]).scrollIntoView({ behavior: "smooth", block: "start" }));
    }

    function persistAdminCities() {
      localStorage.setItem("guiaEducativaCities", JSON.stringify(adminCities));
      renderAdminHierarchy();
      renderAdminCities();
    }

    function renderAdminCities() {
      const list = document.getElementById("adminCityList");
      if (!list) return;
      list.innerHTML = adminCities.map((city, index) => `
        <div class="admin-simple-row">
          <span><strong>${escapeHtml(city)}</strong><small>${institutions.filter(inst => (inst.city || []).includes(city)).length} instituciones</small></span>
          <span class="admin-simple-actions">
            <button class="btn light" type="button" onclick="moveAdminCity(${index}, -1)" aria-label="Subir ciudad">â†‘</button>
            <button class="btn light" type="button" onclick="moveAdminCity(${index}, 1)" aria-label="Bajar ciudad">â†“</button>
            <button class="btn light" type="button" onclick="editAdminCity(${index})">Editar</button>
            <button class="btn secondary" type="button" onclick="deleteAdminCity(${index})">Eliminar</button>
          </span>
        </div>
      `).join("");
    }

    function addAdminCity() {
      const name = cleanText(prompt("Nombre de la nueva ciudad:") || "");
      if (!name || adminCities.includes(name)) return;
      adminCities.push(name);
      persistAdminCities();
    }

    function editAdminCity(index) {
      const previous = adminCities[index];
      const name = cleanText(prompt("Editar ciudad:", previous) || "");
      if (!name || (adminCities.includes(name) && name !== previous)) return;
      adminCities[index] = name;
      institutions.forEach(inst => inst.city = (inst.city || []).map(city => city === previous ? name : city));
      persistInstitutions();
      persistAdminCities();
    }

    function deleteAdminCity(index) {
      const city = adminCities[index];
      if (!confirm("Â¿Eliminar " + city + "?")) return;
      adminCities.splice(index, 1);
      institutions.forEach(inst => inst.city = (inst.city || []).filter(item => item !== city));
      persistInstitutions();
      persistAdminCities();
    }

    function moveAdminCity(index, direction) {
      const target = index + direction;
      if (target < 0 || target >= adminCities.length) return;
      [adminCities[index], adminCities[target]] = [adminCities[target], adminCities[index]];
      persistAdminCities();
    }

    function renderSliderInstitutionOptions() {
      const select = document.getElementById("adminSliderInstitution");
      if (!select) return;
      select.innerHTML = institutions.map((inst, index) => `<option value="${index}">${escapeHtml(inst.name)}</option>`).join("");
      select.value = String(Math.min(adminInstitutionIndex, Math.max(0, institutions.length - 1)));
      loadSliderEditor();
    }

    function loadSliderEditor() {
      const select = document.getElementById("adminSliderInstitution");
      if (!select || !institutions.length) return;
      const inst = institutions[Number(select.value)];
      document.getElementById("adminSliderTitle").value = inst.name;
      document.getElementById("adminSliderText").value = inst.desc;
      document.getElementById("adminSliderCity").value = (inst.city || [adminCities[0]])[0] || adminCities[0];
      document.getElementById("adminSliderActive").checked = inst.plan === "Premium";
    }

    function saveSliderEditor() {
      const index = Number(document.getElementById("adminSliderInstitution").value);
      const inst = institutions[index];
      if (!inst) return;
      inst.name = cleanText(document.getElementById("adminSliderTitle").value) || inst.name;
      inst.desc = cleanText(document.getElementById("adminSliderText").value) || inst.desc;
      inst.plan = document.getElementById("adminSliderActive").checked ? "Premium" : "Profesional";
      const city = document.getElementById("adminSliderCity").value;
      if (city && !(inst.city || []).includes(city)) inst.city = [city, ...(inst.city || [])];
      persistInstitutions();
      alert("Slider actualizado.");
    }

    function renderAdminRecentLeads() {
      const list = document.getElementById("adminRecentLeads");
      if (!list) return;
      if (!leads.length) {
        list.innerHTML = '<div class="empty-state">TodavÃ­a no se recibieron consultas.</div>';
        return;
      }
      list.innerHTML = leads.slice().reverse().slice(0, 5).map(lead => {
        const initials = cleanText(lead.name || "Estudiante").split(" ").slice(0, 2).map(part => part.charAt(0)).join("").toUpperCase();
        return `
          <div class="admin-recent-item">
            <span class="admin-recent-initials">${escapeHtml(initials)}</span>
            <span><strong>${escapeHtml(lead.name)}</strong><small>${escapeHtml(lead.career)} Â· ${escapeHtml(lead.institution)}</small></span>
            <span class="admin-recent-date">${escapeHtml(new Date(lead.date).toLocaleDateString("es-AR"))}</span>
          </div>
        `;
      }).join("");
    }

    function renderAdminInstitutionList() {
      const list = document.getElementById("adminInstitutionList");
      if (!institutions.length) {
        list.innerHTML = '<div class="empty-state">TodavÃ­a no hay instituciones.</div>';
        return;
      }

      list.innerHTML = institutions.map((inst, index) => `
        <button class="admin-inst-item ${index === adminInstitutionIndex ? "active" : ""}" type="button" onclick="selectAdminInstitution(${index})">
          <span class="mini-logo">${institutionLogoMarkup(inst, "detail-logo-image")}</span>
          <span>
            <strong>${escapeHtml(inst.name)}</strong>
            <small>${escapeHtml(inst.plan)} Â· ${escapeHtml((inst.city || []).join(", "))}</small>
          </span>
        </button>
      `).join("");
    }

    function selectAdminInstitution(index) {
      adminInstitutionIndex = index;
      renderAdminInstitutionList();
      loadAdminEditor(index);
    }

    function loadAdminEditor(index) {
      const inst = institutions[index];
      const form = document.getElementById("adminForm");
      form.classList.toggle("hidden", !inst);
      if (!inst) return;

      document.getElementById("adminEditorTitle").textContent = "Editar " + inst.name;
      document.getElementById("adminName").value = inst.name;
      document.getElementById("adminLogo").value = inst.logo;
      document.getElementById("adminType").value = inst.type;
      document.getElementById("adminPlan").value = inst.plan;
      document.getElementById("adminImage").value = inst.image;
      document.getElementById("adminImage").dataset.publicId = inst.imagePublicId || "";
      document.getElementById("adminLogoImage").value = inst.logoImage || "";
      document.getElementById("adminLogoImage").dataset.publicId = inst.logoPublicId || "";
      document.getElementById("adminFeaturedImage").value = inst.featuredImage || inst.image;
      document.getElementById("adminFeaturedImage").dataset.publicId = inst.featuredPublicId || "";
      document.getElementById("adminVideoUrl").value = inst.videoUrl || "";
      document.getElementById("adminVideoUrl").dataset.publicId = inst.videoPublicId || "";
      document.getElementById("adminMedia").value = inst.media;
      document.getElementById("adminWhatsapp").value = inst.whatsapp;
      document.getElementById("adminSlogan").value = inst.slogan;
      document.getElementById("adminDesc").value = inst.desc;
      document.getElementById("adminAddress").value = inst.address;
      document.querySelectorAll('input[name="adminCity"]').forEach(input => {
        input.checked = (inst.city || []).includes(input.value);
      });
      renderUploadPreview("adminLogoPreview", inst.logoImage, "image", inst.name);
      renderUploadPreview("adminImagePreview", inst.image, "image", inst.name);
      renderUploadPreview("adminFeaturedPreview", inst.featuredImage || inst.image, "image", inst.name);
      renderUploadPreview("adminVideoPreview", inst.videoUrl, "video", inst.name);
      ["adminLogoImageStatus", "adminImageStatus", "adminFeaturedImageStatus", "adminVideoUrlStatus", "adminGalleryStatus"].forEach(id => {
        const status = document.getElementById(id);
        if (status) {
          status.className = "upload-status";
          status.textContent = "";
        }
      });
      renderAdminGallery(inst.gallery || []);
      renderAdminCareerList();
      document.getElementById("adminStatus").textContent = "Los cambios se guardan en este dispositivo.";
    }

    function renderAdminCareerList() {
      const list = document.getElementById("adminCareerList");
      const editor = document.getElementById("adminCareerEditor");
      if (!list) return;
      const careers = institutions[adminInstitutionIndex]?.careers || [];
      list.innerHTML = careers.length ? careers.map(career => `
        <button class="career-admin-item" type="button" onclick="editAdminCareer('${escapeHtml(career.id)}')">
          <img src="${escapeHtml(cloudinaryImage(career.image, 200))}" alt="${escapeHtml(career.name)}" />
          <span><strong>${escapeHtml(career.name)}</strong><small>${escapeHtml(career.duration)} Â· ${escapeHtml(career.modality)}</small></span>
          <span>Editar</span>
        </button>
      `).join("") : '<div class="empty-state">TodavÃ­a no hay carreras para esta instituciÃ³n.</div>';
      editor.classList.add("hidden");
    }

    function createAdminCareer() {
      const career = normalizeCareer({ name: "Nueva carrera", description: "", image: imageBank.classroom }, institutions[adminInstitutionIndex]);
      institutions[adminInstitutionIndex].careers.push(career);
      persistInstitutions();
      renderAdminCareerList();
      editAdminCareer(career.id);
    }

    function editAdminCareer(careerId) {
      const career = institutions[adminInstitutionIndex].careers.find(item => item.id === careerId);
      if (!career) return;
      document.getElementById("adminCareerEditor").classList.remove("hidden");
      document.getElementById("adminCareerId").value = career.id;
      document.getElementById("adminCareerName").value = career.name;
      document.getElementById("adminCareerDuration").value = career.duration;
      document.getElementById("adminCareerModality").value = career.modality;
      document.getElementById("adminCareerCampus").value = career.campus;
      document.getElementById("adminCareerShifts").value = career.shifts;
      document.getElementById("adminCareerDegree").value = career.degree;
      document.getElementById("adminCareerValidity").value = career.nationalValidity;
      document.getElementById("adminCareerWhatsapp").value = career.whatsapp;
      document.getElementById("adminCareerDescription").value = career.description;
      document.getElementById("adminCareerAbout").value = career.about;
      document.getElementById("adminCareerField").value = career.workField;
      document.getElementById("adminCareerProfile").value = career.graduateProfile;
      document.getElementById("adminCareerStudyPlan").value = career.studyPlan.join("\n");
      document.getElementById("adminCareerRequirements").value = career.requirements.join("\n");
      document.getElementById("adminCareerFaq").value = career.faq.map(item => item.question + " | " + item.answer).join("\n");
      document.getElementById("adminCareerImage").value = career.image;
      document.getElementById("adminCareerImage").dataset.publicId = career.publicId || "";
      document.getElementById("adminCareerFormEnabled").checked = career.formEnabled;
      renderUploadPreview("adminCareerImagePreview", career.image, "image", career.name);
      document.getElementById("adminCareerEditor").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function collectCareerFaq(value) {
      return splitLines(value).map(line => {
        const [question, ...answer] = line.split("|");
        return { question: question.trim(), answer: answer.join("|").trim() };
      }).filter(item => item.question);
    }

    function saveAdminCareer() {
      const id = document.getElementById("adminCareerId").value;
      const careers = institutions[adminInstitutionIndex].careers;
      const index = careers.findIndex(item => item.id === id);
      if (index < 0) return;
      careers[index] = {
        ...careers[index],
        name: cleanText(document.getElementById("adminCareerName").value),
        duration: cleanText(document.getElementById("adminCareerDuration").value),
        modality: document.getElementById("adminCareerModality").value,
        campus: cleanText(document.getElementById("adminCareerCampus").value),
        shifts: cleanText(document.getElementById("adminCareerShifts").value),
        degree: cleanText(document.getElementById("adminCareerDegree").value),
        nationalValidity: document.getElementById("adminCareerValidity").value,
        whatsapp: cleanText(document.getElementById("adminCareerWhatsapp").value),
        description: cleanText(document.getElementById("adminCareerDescription").value),
        about: cleanText(document.getElementById("adminCareerAbout").value),
        workField: cleanText(document.getElementById("adminCareerField").value),
        graduateProfile: cleanText(document.getElementById("adminCareerProfile").value),
        studyPlan: splitLines(document.getElementById("adminCareerStudyPlan").value),
        requirements: splitLines(document.getElementById("adminCareerRequirements").value),
        faq: collectCareerFaq(document.getElementById("adminCareerFaq").value),
        image: document.getElementById("adminCareerImage").value || imageBank.classroom,
        publicId: document.getElementById("adminCareerImage").dataset.publicId || "",
        formEnabled: document.getElementById("adminCareerFormEnabled").checked
      };
      persistInstitutions();
      renderAdminCareerList();
      editAdminCareer(id);
      document.getElementById("adminStatus").textContent = "Carrera guardada correctamente.";
    }

    function deleteAdminCareer() {
      const id = document.getElementById("adminCareerId").value;
      if (!confirm("Â¿Eliminar esta carrera?")) return;
      institutions[adminInstitutionIndex].careers = institutions[adminInstitutionIndex].careers.filter(item => item.id !== id);
      persistInstitutions();
      renderAdminCareerList();
    }

    function saveInstitution() {
      const selectedCities = [...document.querySelectorAll('input[name="adminCity"]:checked')].map(input => input.value);
      if (!selectedCities.length) {
        document.getElementById("adminStatus").textContent = "ElegÃ­ al menos una ciudad.";
        return;
      }

      const previousName = institutions[adminInstitutionIndex].name;
      institutions[adminInstitutionIndex] = {
        name: cleanText(document.getElementById("adminName").value),
        logo: cleanText(document.getElementById("adminLogo").value).toUpperCase(),
        type: cleanText(document.getElementById("adminType").value),
        city: selectedCities,
        plan: document.getElementById("adminPlan").value,
        slogan: cleanText(document.getElementById("adminSlogan").value),
        desc: cleanText(document.getElementById("adminDesc").value),
        address: cleanText(document.getElementById("adminAddress").value),
        whatsapp: cleanText(document.getElementById("adminWhatsapp").value),
        image: document.getElementById("adminImage").value.trim(),
        imagePublicId: document.getElementById("adminImage").dataset.publicId || "",
        logoImage: document.getElementById("adminLogoImage").value.trim(),
        logoPublicId: document.getElementById("adminLogoImage").dataset.publicId || "",
        featuredImage: document.getElementById("adminFeaturedImage").value.trim() || document.getElementById("adminImage").value.trim(),
        featuredPublicId: document.getElementById("adminFeaturedImage").dataset.publicId || "",
        videoUrl: document.getElementById("adminVideoUrl").value.trim(),
        videoPublicId: document.getElementById("adminVideoUrl").dataset.publicId || "",
        media: document.getElementById("adminMedia").value,
        gallery: collectGalleryEditor(),
        careers: institutions[adminInstitutionIndex].careers || []
      };

      if (currentInstitution && currentInstitution.name === previousName) {
        currentInstitution = institutions[adminInstitutionIndex];
      }
      persistInstitutions();
      renderAdminInstitutionList();
      renderAdminMetrics();
      document.getElementById("adminEditorTitle").textContent = "Editar " + institutions[adminInstitutionIndex].name;
      document.getElementById("adminStatus").textContent = "Cambios guardados correctamente.";
    }

    function addInstitution() {
      institutions.push({
        name: "Nueva instituciÃ³n",
        logo: "NI",
        type: "Instituto",
        city: ["ConcepciÃ³n"],
        plan: "BÃ¡sico",
        slogan: "Una nueva propuesta educativa en TucumÃ¡n.",
        desc: "CompletÃ¡ aquÃ­ una descripciÃ³n breve de la instituciÃ³n.",
        address: "TucumÃ¡n",
        whatsapp: "381 000 0000",
        image: imageBank.campus,
        imagePublicId: "",
        logoImage: "",
        logoPublicId: "",
        featuredImage: imageBank.campus,
        featuredPublicId: "",
        videoUrl: "",
        videoPublicId: "",
        gallery: [imageBank.campus, imageBank.students, imageBank.classroom],
        media: "Imagen superior",
        careers: [normalizeCareer({ name: "Nueva carrera", description: "DescripciÃ³n breve de la carrera.", image: imageBank.classroom })]
      });
      adminInstitutionIndex = institutions.length - 1;
      persistInstitutions();
      renderAdmin();
      document.getElementById("adminName").focus();
    }

    function deleteInstitution() {
      if (!institutions.length) return;
      if (!confirm("Â¿Eliminar esta instituciÃ³n? Esta acciÃ³n se puede revertir restaurando la demo.")) return;
      institutions.splice(adminInstitutionIndex, 1);
      adminInstitutionIndex = Math.max(0, adminInstitutionIndex - 1);
      persistInstitutions();
      renderAdmin();
    }

    function previewAdminInstitution() {
      const inst = institutions[adminInstitutionIndex];
      if (!inst) return;
      currentCity = inst.city[0] || "ConcepciÃ³n";
      showDetail(inst.name);
    }

    function renderLeads() {
      const wrap = document.getElementById("leadTableWrap");
      if (!leads.length) {
        wrap.innerHTML = '<div class="empty-state">Las consultas enviadas desde las fichas aparecerÃ¡n acÃ¡.</div>';
        return;
      }

      wrap.innerHTML = `
        <table class="lead-table">
          <thead><tr><th>Fecha</th><th>Estudiante</th><th>InstituciÃ³n</th><th>Carrera</th><th>Contacto</th></tr></thead>
          <tbody>
            ${leads.map(lead => `
              <tr>
                <td>${escapeHtml(new Date(lead.date).toLocaleDateString("es-AR"))}</td>
                <td>${escapeHtml(lead.name)}</td>
                <td>${escapeHtml(lead.institution)}</td>
                <td>${escapeHtml(lead.career)}</td>
                <td>${escapeHtml(lead.phone)}<br>${escapeHtml(lead.email)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }

    function clearLeads() {
      if (!leads.length || !confirm("Â¿Vaciar todas las consultas registradas?")) return;
      leads = [];
      localStorage.setItem("guiaEducativaLeads", "[]");
      renderAdminMetrics();
      renderLeads();
    }

    function exportData() {
      const backup = {
        exportedAt: new Date().toISOString(),
        institutions,
        leads
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "guia-educativa-respaldo.json";
      link.click();
      URL.revokeObjectURL(link.href);
    }

    function importData(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!Array.isArray(data.institutions)) throw new Error("Formato invÃ¡lido");
          institutions = data.institutions.map(normalizeInstitution);
          leads = Array.isArray(data.leads) ? data.leads : leads;
          persistInstitutions();
          localStorage.setItem("guiaEducativaLeads", JSON.stringify(leads));
          adminInstitutionIndex = 0;
          renderAdmin();
          document.getElementById("adminStatus").textContent = "Respaldo importado correctamente.";
        } catch (error) {
          alert("No se pudo importar el archivo. VerificÃ¡ que sea un respaldo vÃ¡lido.");
        }
        event.target.value = "";
      };
      reader.readAsText(file);
    }

    function resetDemoData() {
      if (!confirm("Â¿Restaurar todas las instituciones originales de la demo?")) return;
      institutions = JSON.parse(JSON.stringify(defaultInstitutions)).map(normalizeInstitution);
      persistInstitutions();
      adminInstitutionIndex = 0;
      renderAdmin();
      document.getElementById("adminStatus").textContent = "Contenido original restaurado.";
    }

    function backToCity() {
      showCity(currentCity);
    }

    function filterEvents() {
      const query = normalizeCityText(document.getElementById("eventSearch").value);
      const city = document.getElementById("eventCityFilter").value;
      const category = document.getElementById("eventCategoryFilter").value;
      const modality = document.getElementById("eventModalityFilter").value;
      const date = document.getElementById("eventDateFilter").value;
      let visible = 0;

      document.querySelectorAll(".event-card").forEach(card => {
        const searchable = normalizeCityText([
          card.dataset.title,
          card.dataset.category,
          card.dataset.city,
          card.textContent
        ].join(" "));
        const matches = (!query || searchable.includes(query))
          && (!city || card.dataset.city === city)
          && (!category || card.dataset.category === category)
          && (!modality || card.dataset.modality === modality)
          && (!date || card.dataset.date === date);
        card.classList.toggle("hidden", !matches);
        if (matches) visible++;
      });

      document.getElementById("eventEmpty").classList.toggle("hidden", visible !== 0);
      document.getElementById("eventResultsText").textContent = visible === 1
        ? "1 evento encontrado."
        : visible + " eventos encontrados.";
      document.querySelectorAll(".event-category").forEach(button => {
        button.classList.toggle("active", button.dataset.eventCategory === category);
      });
    }

    function setEventCategory(category, button) {
      const select = document.getElementById("eventCategoryFilter");
      const active = button.classList.contains("active");
      select.value = active ? "" : category;
      filterEvents();
      document.getElementById("upcomingEventsTitle").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function viewEvent(name) {
      alert("La ficha de â€œ" + name + "â€ estarÃ¡ disponible prÃ³ximamente.");
    }

    const teacherCourses = [
      { name: "Inteligencia artificial aplicada al aula", institution: "Universidad Siglo 21", city: "ConcepciÃ³n", modality: "Mixta", score: 40, weeks: 6, start: "2026-06-26", status: "Ãšltimos cupos", badge: "Destacado", urgency: "Inicia maÃ±ana", image: imageBank.design, featured: true },
      { name: "EvaluaciÃ³n formativa y nuevas estrategias", institution: "IES ConcepciÃ³n", city: "ConcepciÃ³n", modality: "Presencial", score: 30, weeks: 4, start: "2026-06-28", status: "Inscripciones abiertas", badge: "Recomendado", urgency: "Inicia en 3 dÃ­as", image: imageBank.classroom, featured: true },
      { name: "Herramientas digitales para docentes", institution: "Centro de FormaciÃ³n TucumÃ¡n", city: "Monteros", modality: "Virtual", score: 25, weeks: 5, start: "2026-07-02", status: "Inscripciones abiertas", badge: "Nuevo", urgency: "Inicia la prÃ³xima semana", image: imageBank.video, featured: true },
      { name: "EducaciÃ³n emocional y convivencia escolar", institution: "Instituto San Miguel", city: "Monteros", modality: "Presencial", score: 35, weeks: 8, start: "2026-07-06", status: "Inscripciones abiertas", badge: "Recomendado", urgency: "Inicia la prÃ³xima semana", image: imageBank.students, featured: true },
      { name: "DiseÃ±o de proyectos interdisciplinarios", institution: "Instituto Santa BÃ¡rbara", city: "Aguilares", modality: "Mixta", score: 45, weeks: 10, start: "2026-07-13", status: "Ãšltimos cupos", badge: "Destacado", urgency: "Inicia en 18 dÃ­as", image: imageBank.fair, featured: false },
      { name: "InclusiÃ³n educativa y trayectorias escolares", institution: "IES ConcepciÃ³n", city: "ConcepciÃ³n", modality: "Virtual", score: 40, weeks: 7, start: "2026-07-20", status: "Inscripciones abiertas", badge: "Nuevo", urgency: "Inicia en julio", image: imageBank.campus, featured: false },
      { name: "AlfabetizaciÃ³n inicial: enfoques actuales", institution: "Instituto San Miguel", city: "Monteros", modality: "Presencial", score: 30, weeks: 6, start: "2026-08-03", status: "PrÃ³ximamente", badge: "Nuevo", urgency: "Inicia en agosto", image: imageBank.classroom, featured: false },
      { name: "GamificaciÃ³n y aprendizaje basado en retos", institution: "Academia Profesional Norte", city: "Aguilares", modality: "Virtual", score: 20, weeks: 4, start: "2026-08-10", status: "Inscripciones abiertas", badge: "Recomendado", urgency: "Inicia en agosto", image: imageBank.design, featured: false },
      { name: "GestiÃ³n institucional y liderazgo pedagÃ³gico", institution: "Universidad Siglo 21", city: "TucumÃ¡n", modality: "Mixta", score: 50, weeks: 12, start: "2026-08-17", status: "PrÃ³ximamente", badge: "Destacado", urgency: "Inicia en agosto", image: imageBank.siglo, featured: false },
      { name: "Estrategias para la enseÃ±anza de matemÃ¡tica", institution: "Centro de FormaciÃ³n TucumÃ¡n", city: "Aguilares", modality: "Presencial", score: 25, weeks: 5, start: "2026-09-01", status: "PrÃ³ximamente", badge: "Nuevo", urgency: "Inicia en septiembre", image: imageBank.lab, featured: false }
    ];

    let courseVisibleLimit = 5;

    function courseDateLabel(date) {
      return new Date(date + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
    }

    function courseDetailIcons(course) {
      return `
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5h16v12H4zM9 21h6"></path></svg>${escapeHtml(course.modality)}</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"></path></svg>${course.score ? course.score + " puntos" : "Sin puntaje"}</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>${course.weeks} semanas</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M8 3v4M16 3v4"></path></svg>${courseDateLabel(course.start)}</span>
      `;
    }

    function teacherCourseCard(course, urgency = false) {
      return `
        <article class="teacher-course-card">
          <div class="teacher-course-card-image-wrap">
            <img src="${course.image}" alt="${escapeHtml(course.name)}" />
            <span class="${urgency ? "course-urgency" : "course-card-badge"}">${escapeHtml(urgency ? course.urgency : course.badge)}</span>
          </div>
          <div class="teacher-course-card-body">
            <h3>${escapeHtml(course.name)}</h3>
            <p class="course-institution">${escapeHtml(course.institution)} Â· ${escapeHtml(course.city)}</p>
            <div class="course-detail-grid">${courseDetailIcons(course)}</div>
            <div class="course-card-actions">
              <button class="btn light" type="button" onclick="viewTeacherCourse('${escapeHtml(course.name).replace(/'/g, "\\'")}')">Ver curso</button>
              <button class="btn" type="button" onclick="consultTeacherCourse('${escapeHtml(course.name).replace(/'/g, "\\'")}')">Consultar</button>
            </div>
          </div>
        </article>
      `;
    }

    function courseStatusClass(status) {
      return status === "Ãšltimos cupos" ? "warning" : status === "PrÃ³ximamente" ? "soon" : "";
    }

    function teacherCourseListCard(course) {
      return `
        <article class="course-list-card">
          <img src="${course.image}" alt="${escapeHtml(course.name)}" />
          <div class="course-list-title"><h3>${escapeHtml(course.name)}</h3><p>${escapeHtml(course.institution)} Â· ${escapeHtml(course.city)}</p></div>
          <div class="course-list-meta">
            <span><strong>Modalidad</strong>${escapeHtml(course.modality)}</span>
            <span><strong>Puntaje</strong>${course.score ? course.score + " puntos" : "Sin puntaje"}</span>
            <span><strong>DuraciÃ³n</strong>${course.weeks} semanas</span>
            <span><strong>Inicio</strong>${courseDateLabel(course.start)}</span>
            <span><strong>Ciudad</strong>${escapeHtml(course.city)}</span>
            <span><strong>InstituciÃ³n</strong>${escapeHtml(course.institution)}</span>
          </div>
          <div><span class="course-status ${courseStatusClass(course.status)}">${escapeHtml(course.status)}</span><button class="btn light" type="button" onclick="viewTeacherCourse('${escapeHtml(course.name).replace(/'/g, "\\'")}')">Ver curso</button></div>
        </article>
      `;
    }

    function populateCourseInstitutions() {
      const select = document.getElementById("courseInstitutionFilter");
      const current = select.value;
      const names = [...new Set(teacherCourses.map(course => course.institution))].sort();
      select.innerHTML = '<option value="">InstituciÃ³n</option>' + names.map(name => `<option>${escapeHtml(name)}</option>`).join("");
      select.value = current;
    }

    function matchingTeacherCourses() {
      const query = normalizeCityText(document.getElementById("courseSearch").value);
      const institution = document.getElementById("courseInstitutionFilter").value;
      const modality = document.getElementById("courseModalityFilter").value;
      const score = document.getElementById("courseScoreFilter").value;
      const date = document.getElementById("courseDateFilter").value;
      const duration = document.getElementById("courseDurationFilter").value;
      return teacherCourses.filter(course => {
        const searchable = normalizeCityText([course.name, course.institution, course.city, course.modality].join(" "));
        const scoreMatch = !score || (score === "0" ? course.score === 0 : course.score >= Number(score));
        const durationMatch = !duration
          || (duration === "short" && course.weeks <= 4)
          || (duration === "medium" && course.weeks >= 5 && course.weeks <= 8)
          || (duration === "long" && course.weeks > 8);
        return (!query || searchable.includes(query))
          && (!institution || course.institution === institution)
          && (!modality || course.modality === modality)
          && scoreMatch
          && (!date || course.start === date)
          && durationMatch;
      });
    }

    function renderTeacherCourses() {
      populateCourseInstitutions();
      document.getElementById("featuredCourses").innerHTML = teacherCourses.filter(course => course.featured).map(course => teacherCourseCard(course)).join("");
      document.getElementById("upcomingCourses").innerHTML = teacherCourses.slice().sort((a, b) => a.start.localeCompare(b.start)).slice(0, 5).map(course => teacherCourseCard(course, true)).join("");
      filterTeacherCourses();
    }

    function filterTeacherCourses() {
      const matches = matchingTeacherCourses();
      const visible = matches.slice(0, courseVisibleLimit);
      document.getElementById("courseCatalog").innerHTML = visible.map(teacherCourseListCard).join("");
      document.getElementById("courseEmpty").classList.toggle("hidden", matches.length !== 0);
      document.getElementById("courseLoadMore").classList.toggle("hidden", visible.length >= matches.length || matches.length === 0);
      document.getElementById("courseResultsText").textContent = matches.length === 1 ? "1 curso encontrado." : matches.length + " cursos encontrados.";
    }

    function clearCourseFilters() {
      document.querySelector(".course-filters").reset();
      courseVisibleLimit = 5;
      filterTeacherCourses();
    }

    function loadMoreCourses() {
      courseVisibleLimit += 4;
      filterTeacherCourses();
    }

    function scrollCourseCarousel(id, direction) {
      const carousel = document.getElementById(id);
      carousel.scrollBy({ left: direction * Math.max(300, carousel.clientWidth * 0.72), behavior: "smooth" });
    }

    function viewTeacherCourse(name) {
      alert("La ficha de â€œ" + name + "â€ estarÃ¡ disponible prÃ³ximamente.");
    }

    function consultTeacherCourse(name) {
      window.open("https://wa.me/5493865751273?text=" + encodeURIComponent("Hola, quiero consultar por el curso docente: " + name), "_blank", "noopener");
    }

    function showCoursesPage() {
      hidePages();
      document.getElementById("coursesPage").classList.add("active");
      setFooterVisible(true);
      setActiveNav("");
      closeSiteMenu();
      renderTeacherCourses();
      window.scrollTo(0, 0);
    }

    function initAboutReveal() {
      const elements = document.querySelectorAll(".about-reveal");
      if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elements.forEach(element => element.classList.add("visible"));
        return;
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      elements.forEach(element => observer.observe(element));
    }

    function showInfoPage(kind) {
      hidePages();
      const pageId = kind === "events" ? "eventsPage" : kind === "about" ? "aboutPage" : "contactPage";
      document.getElementById(pageId).classList.add("active");
      setFooterVisible(true);
      setActiveNav(kind === "events" ? "eventos" : kind === "about" ? "nosotros" : "");
      window.scrollTo(0, 0);
    }

    renderCityStats();
    renderTeacherCourses();
    initAboutReveal();
    applyTheme(localStorage.getItem("guiaEducativaTheme") === "dark" ? "dark" : "light");
