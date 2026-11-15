/*
 * Fuente única de contenido de la web, espejo del perfil de LinkedIn
 * (https://www.linkedin.com/in/sebastian-salas/).
 * Para actualizar la web: editar este archivo. Cada texto traducible
 * es un objeto { es, en, ca }; las fechas van en formato "AAAA-MM"
 * y `end: null` significa "actualidad".
 * Última sincronización con LinkedIn: 2026-11.
 */
window.SITE = {
  updated: "2026-11",

  profile: {
    name: "Sebastian",
    surname: "Salas",
    location: { es: "Barcelona, España", en: "Barcelona, Spain", ca: "Barcelona, Catalunya" },
    email: "sebaasalas14@gmail.com",
    linkedin: "https://www.linkedin.com/in/sebastian-salas/",
    github: "https://github.com/SebaSalas14",
    roles: [
      { es: "Data Engineer", en: "Data Engineer", ca: "Data Engineer" },
      { es: "Data Analyst", en: "Data Analyst", ca: "Data Analyst" },
      { es: "Ingeniero Biomédico", en: "Biomedical Engineer", ca: "Enginyer Biomèdic" },
      { es: "Builder con IA", en: "AI Builder", ca: "Builder amb IA" }
    ],
    intro: {
      es: "Convierto datos dispersos en modelos, pipelines y dashboards que mueven decisiones. Con raíces en la ingeniería biomédica.",
      en: "I turn scattered data into models, pipelines and dashboards that drive decisions, with roots in biomedical engineering.",
      ca: "Converteixo dades disperses en models, pipelines i dashboards que impulsen decisions. Amb arrels en l'enginyeria biomèdica."
    },
    // Fecha desde la que se cuentan los "años en datos" del contador.
    dataSince: "2023-05"
  },

  ui: {
    "nav.home": { es: "Inicio", en: "Home", ca: "Inici" },
    "nav.profile": { es: "Perfil", en: "Profile", ca: "Perfil" },
    "nav.experience": { es: "Experiencia", en: "Experience", ca: "Experiència" },
    "nav.education": { es: "Formación", en: "Education", ca: "Formació" },
    "nav.skills": { es: "Habilidades", en: "Skills", ca: "Habilitats" },
    "nav.certs": { es: "Certificaciones", en: "Certifications", ca: "Certificacions" },
    "nav.contact": { es: "Contacto", en: "Contact", ca: "Contacte" },

    "hero.hello": { es: "// hola, soy", en: "// hi, I'm", ca: "// hola, soc" },
    "hero.cta.exp": { es: "Ver trayectoria", en: "See my journey", ca: "Veure trajectòria" },
    "hero.cta.contact": { es: "Hablemos", en: "Let's talk", ca: "Parlem" },
    "hero.term.status": { es: "1 fila · 4 ms", en: "1 row · 4 ms", ca: "1 fila · 4 ms" },
    "kpi.years": { es: "años en datos", en: "years in data", ca: "anys en dades" },
    "kpi.roles": { es: "roles", en: "roles", ca: "rols" },
    "kpi.masters": { es: "másters", en: "master's degrees", ca: "màsters" },
    "kpi.certs": { es: "certificaciones", en: "certifications", ca: "certificacions" },

    "profile.title": { es: "Perfil", en: "Profile", ca: "Perfil" },
    "profile.pipeline": { es: "Cómo fluye el dato conmigo", en: "How data flows with me", ca: "Com flueixen les dades amb mi" },
    "profile.pipeline.caption": {
      es: "Del dato crudo a la decisión: el recorrido que diseño en cada proyecto.",
      en: "From raw data to decision: the path I design in every project.",
      ca: "De la dada en brut a la decisió: el recorregut que dissenyo a cada projecte."
    },

    "exp.title": { es: "Experiencia", en: "Experience", ca: "Experiència" },
    "exp.gantt": { es: "Trayectoria en el tiempo", en: "Career over time", ca: "Trajectòria en el temps" },
    "exp.legend.data": { es: "Datos", en: "Data", ca: "Dades" },
    "exp.legend.health": { es: "Salud y biomédica", en: "Health & biomedical", ca: "Salut i biomèdica" },
    "exp.present": { es: "actualidad", en: "present", ca: "actualitat" },
    "exp.current": { es: "actual", en: "current", ca: "actual" },
    "exp.promoted": { es: "promoción", en: "promoted", ca: "promoció" },

    "edu.title": { es: "Formación", en: "Education", ca: "Formació" },
    "skills.title": { es: "Habilidades", en: "Skills", ca: "Habilitats" },
    "skills.languages": { es: "Idiomas", en: "Languages", ca: "Idiomes" },

    "certs.title": { es: "Certificaciones", en: "Certifications", ca: "Certificacions" },
    "certs.all": { es: "Todas", en: "All", ca: "Totes" },
    "certs.ai": { es: "IA", en: "AI", ca: "IA" },
    "certs.data": { es: "Datos", en: "Data", ca: "Dades" },
    "certs.dev": { es: "Desarrollo", en: "Dev", ca: "Desenvolupament" },

    "contact.title": { es: "¿Construimos algo con datos?", en: "Shall we build something with data?", ca: "Construïm alguna cosa amb dades?" },
    "contact.text": {
      es: "Abierto a conversar sobre data engineering, analytics engineering, gobierno del dato y datos en salud.",
      en: "Open to talk about data engineering, analytics engineering, data governance and healthcare data.",
      ca: "Obert a parlar de data engineering, analytics engineering, governança de dades i dades en salut."
    },
    "contact.email": { es: "Escríbeme", en: "Email me", ca: "Escriu-me" },
    "contact.offline": { es: "Fuera del pipeline", en: "Outside the pipeline", ca: "Fora del pipeline" },
    "footer.made": {
      es: "Hecho con datos, café y Claude",
      en: "Built with data, coffee and Claude",
      ca: "Fet amb dades, cafè i Claude"
    },
    "footer.updated": { es: "Sincronizado con LinkedIn", en: "Synced with LinkedIn", ca: "Sincronitzat amb LinkedIn" }
  },

  about: {
    es: [
      "Soy ingeniero biomédico y trabajo en datos. Me muevo en la intersección entre ingeniería, negocio y salud: diseño los modelos y pipelines que convierten datos dispersos en decisiones fiables.",
      "Hoy trabajo como Data Analyst / Data Engineer en Vibia, cubriendo el dato de punta a punta: desde los pipelines con Databricks y dbt hasta los dashboards en Power BI. Además soy owner del área operativa de Scalability, donde defino los modelos de datos y aplico prácticas DevOps (CI/CD, control de versiones) a todo el ciclo de vida del dato.",
      "Antes, en NTT DATA, crecí de Business Data Analyst a Data Engineer en menos de dos años: pipelines ETL desde el Data Lake hasta el reporting, optimización de bases de datos para analítica a gran escala y dashboards en Qlik Sense para clientes de media, retail y banca.",
      "Mi origen (equipamiento hospitalario, ingeniería clínica e investigación en electrofisiología) me da algo poco común en datos: entiendo qué significa el dato antes de que llegue al pipeline, y sé hablar con quien lo genera.",
      "Y construyo con IA: uso herramientas como Claude para automatizar tareas y crear soluciones a medida que devuelven tiempo a las personas."
    ],
    en: [
      "I'm a biomedical engineer working in data. I operate where engineering, business and healthcare meet: I design the models and pipelines that turn scattered data into decisions people can trust.",
      "Today I work as a Data Analyst / Data Engineer at Vibia, covering data end to end: from Databricks and dbt pipelines to Power BI dashboards. I'm also the owner of the Scalability operational area, where I define the data models and bring DevOps practices (CI/CD, version control) to the whole data lifecycle.",
      "Before that, at NTT DATA, I grew from Business Data Analyst to Data Engineer in under two years: ETL pipelines from the Data Lake to reporting layers, database tuning for large-scale analytics and Qlik Sense dashboards for media, retail and banking clients.",
      "My background (hospital equipment, clinical engineering and electrophysiology research) gives me something rare in data: I understand what the data means before it reaches the pipeline, and I can talk to the people who generate it.",
      "And I build with AI: I use tools like Claude to automate tasks and create tailored solutions that give people their time back."
    ],
    ca: [
      "Soc enginyer biomèdic i treballo en dades. Em moc a la intersecció entre enginyeria, negoci i salut: dissenyo els models i pipelines que converteixen dades disperses en decisions fiables.",
      "Avui treballo com a Data Analyst / Data Engineer a Vibia, cobrint la dada de punta a punta: des dels pipelines amb Databricks i dbt fins als dashboards a Power BI. A més, soc owner de l'àrea operativa de Scalability, on defineixo els models de dades i aplico pràctiques DevOps (CI/CD, control de versions) a tot el cicle de vida de la dada.",
      "Abans, a NTT DATA, vaig créixer de Business Data Analyst a Data Engineer en menys de dos anys: pipelines ETL des del Data Lake fins al reporting, optimització de bases de dades per a analítica a gran escala i dashboards a Qlik Sense per a clients de mitjans, retail i banca.",
      "El meu origen (equipament hospitalari, enginyeria clínica i recerca en electrofisiologia) em dona una cosa poc habitual en dades: entenc què significa la dada abans que arribi al pipeline, i sé parlar amb qui la genera.",
      "I construeixo amb IA: faig servir eines com Claude per automatitzar tasques i crear solucions a mida que retornen temps a les persones."
    ]
  },

  pipeline: [
    { icon: "fa-database", name: { es: "Fuentes", en: "Sources", ca: "Fonts" }, tools: ["ERP", "APIs", "Data Lake"] },
    { icon: "fa-file-import", name: { es: "Ingesta", en: "Ingest", ca: "Ingesta" }, tools: ["Python", "Spark", "GCP"] },
    { icon: "fa-cogs", name: { es: "Transformación", en: "Transform", ca: "Transformació" }, tools: ["dbt", "SQL", "Databricks"] },
    { icon: "fa-sitemap", name: { es: "Modelo y gobierno", en: "Model & govern", ca: "Model i governança" }, tools: ["Data modeling", "Ownership", "CI/CD"] },
    { icon: "fa-chart-line", name: { es: "Decisión", en: "Decision", ca: "Decisió" }, tools: ["Power BI", "Qlik Sense", "KPIs"] }
  ],

  // Agrupado por empresa; cada empresa puede tener varios roles (promociones).
  experience: [
    {
      company: "Vibia",
      place: { es: "Gavà · Híbrido", en: "Gavà · Hybrid", ca: "Gavà · Híbrid" },
      roles: [
        {
          title: "Data Analyst / Data Engineer",
          team: "Data & Analytics · Scalability",
          start: "2026-04", end: null, domain: "data",
          summary: {
            es: "Trabajo el dato end-to-end, de la ingesta al dashboard, y soy owner del área operativa de Scalability: diseño los modelos de datos que sostienen la planificación y la estrategia de crecimiento del negocio.",
            en: "I work on data end to end, from ingestion to dashboard, and own the Scalability operational area: I design the data models that support business planning and growth strategy.",
            ca: "Treballo la dada end-to-end, de la ingesta al dashboard, i soc owner de l'àrea operativa de Scalability: dissenyo els models de dades que sostenen la planificació i l'estratègia de creixement del negoci."
          },
          bullets: {
            es: [
              "Definición y mantenimiento de modelos de datos alineados con la planificación operativa y de escalabilidad",
              "Construcción y orquestación de pipelines con Databricks y dbt",
              "Dashboards e informes en Power BI para la toma de decisiones estratégicas",
              "Prácticas DevOps (CI/CD y control de versiones) aplicadas a los flujos de datos",
              "Colaboración transversal con negocio e ingeniería para garantizar calidad y disponibilidad del dato"
            ],
            en: [
              "Defining and maintaining data models aligned with scalability and operational planning needs",
              "Building and orchestrating data pipelines with Databricks and dbt",
              "Developing Power BI dashboards and reports for strategic decision-making",
              "Applying DevOps practices (CI/CD and version control) to data workflows",
              "Collaborating cross-functionally with business and engineering teams to ensure data quality and availability"
            ],
            ca: [
              "Definició i manteniment de models de dades alineats amb la planificació operativa i d'escalabilitat",
              "Construcció i orquestració de pipelines amb Databricks i dbt",
              "Dashboards i informes a Power BI per a la presa de decisions estratègiques",
              "Pràctiques DevOps (CI/CD i control de versions) aplicades als fluxos de dades",
              "Col·laboració transversal amb negoci i enginyeria per garantir la qualitat i la disponibilitat de la dada"
            ]
          },
          skills: ["Azure Databricks", "dbt", "Apache Spark", "Power BI", "DevOps", "Git", "Jira"]
        }
      ]
    },
    {
      company: "NTT DATA Europe & Latam",
      place: { es: "Barcelona · Híbrido", en: "Barcelona · Hybrid", ca: "Barcelona · Híbrid" },
      roles: [
        {
          title: "Data Engineer",
          team: "MAPPS DATA · Modern Application Services",
          start: "2025-03", end: "2026-05", domain: "data", promoted: true,
          bullets: {
            es: [
              "Diseño y automatización de pipelines ETL desde el Data Lake hasta las capas de reporting",
              "Optimización del rendimiento de bases de datos para analítica a gran escala",
              "Dashboards en Qlik Sense con las métricas clave del negocio",
              "Integración y procesamiento de datos estructurados y no estructurados"
            ],
            en: [
              "Designed and automated ETL pipelines from the Data Lake to reporting layers",
              "Optimized database performance for large-scale analytics",
              "Built Qlik Sense dashboards for key business metrics",
              "Integrated and processed structured and unstructured data for advanced insights"
            ],
            ca: [
              "Disseny i automatització de pipelines ETL des del Data Lake fins a les capes de reporting",
              "Optimització del rendiment de bases de dades per a analítica a gran escala",
              "Dashboards a Qlik Sense amb les mètriques clau del negoci",
              "Integració i processament de dades estructurades i no estructurades"
            ]
          },
          skills: ["Data Engineering", "GCP", "BigQuery", "Qlik Sense", "ETL"]
        },
        {
          title: "Junior Analyst",
          team: "DNA · Data & Analytics",
          start: "2024-03", end: "2025-03", domain: "data", promoted: true,
          bullets: {
            es: [
              "Procesos ETL desde el Data Lake a bases de datos estructuradas",
              "Informes de KPIs y dashboards en Qlik Sense",
              "Análisis funcional para mejorar la calidad y la eficiencia del dato",
              "Gestión y optimización de bases de datos Oracle SQL para reporting"
            ],
            en: [
              "Developed ETL processes from the Data Lake to structured databases",
              "Designed KPI reports and dashboards in Qlik Sense",
              "Performed functional analysis to improve data quality and efficiency",
              "Managed and optimized Oracle SQL databases for reporting"
            ],
            ca: [
              "Processos ETL des del Data Lake a bases de dades estructurades",
              "Informes de KPI i dashboards a Qlik Sense",
              "Anàlisi funcional per millorar la qualitat i l'eficiència de la dada",
              "Gestió i optimització de bases de dades Oracle SQL per a reporting"
            ]
          },
          skills: ["DWH", "KPI Reporting", "Qlik Sense", "Oracle SQL"]
        },
        {
          title: "Business Data Analyst",
          start: "2023-10", end: "2024-03", domain: "data",
          bullets: {
            es: [
              "Construcción y mantenimiento de procesos de integración (ETL) en sistemas de BI",
              "Modelado y gestión de bases de datos",
              "Carga y visualización de datos con analítica guiada",
              "Gestión de incidencias y automatización de procesos"
            ],
            en: [
              "Built and maintained data integration (ETL) processes in BI systems",
              "Database modeling and management",
              "Data loading and visualization with guided analytics",
              "Incident management and process automation jobs"
            ],
            ca: [
              "Construcció i manteniment de processos d'integració (ETL) en sistemes de BI",
              "Modelatge i gestió de bases de dades",
              "Càrrega i visualització de dades amb analítica guiada",
              "Gestió d'incidències i automatització de processos"
            ]
          },
          skills: ["ETL", "Oracle SQL Developer", "Data modeling"]
        }
      ]
    },
    {
      company: "QDQmedia",
      place: { es: "Madrid · Remoto", en: "Madrid · Remote", ca: "Madrid · Remot" },
      roles: [
        {
          title: "Business Intelligence Analyst",
          start: "2023-05", end: "2023-10", domain: "data",
          bullets: {
            es: [
              "ETL: extracción, transformación y carga de datos",
              "Optimización y gestión de bases de datos",
              "Preparación de datos, reporting y visualización",
              "Automatización de procesos de envío de datos"
            ],
            en: [
              "ETL: data extraction, transformation and loading",
              "Database optimization and management",
              "Data preparation, reporting and visualization",
              "Automated data submission processes"
            ],
            ca: [
              "ETL: extracció, transformació i càrrega de dades",
              "Optimització i gestió de bases de dades",
              "Preparació de dades, reporting i visualització",
              "Automatització de processos d'enviament de dades"
            ]
          },
          skills: ["Power BI", "Python", "SQL", "ETL"]
        }
      ]
    },
    {
      company: "Centro de Salud Dr. Zenón J. Santillán",
      place: { es: "Tucumán, Argentina", en: "Tucumán, Argentina", ca: "Tucumán, Argentina" },
      roles: [
        {
          title: { es: "Ingeniero Biomédico", en: "Biomedical Engineer", ca: "Enginyer Biomèdic" },
          start: "2022-05", end: "2023-05", domain: "health",
          bullets: {
            es: [
              "Control y mantenimiento del equipamiento médico del hospital",
              "Mantenimiento de infraestructura crítica: sala de máquinas y grupos electrógenos",
              "Gestión de tecnologías y equipamiento médico"
            ],
            en: [
              "Control and maintenance of the hospital's medical equipment",
              "Critical infrastructure maintenance: machine room and generators",
              "Medical equipment and technology management"
            ],
            ca: [
              "Control i manteniment de l'equipament mèdic de l'hospital",
              "Manteniment d'infraestructura crítica: sala de màquines i grups electrògens",
              "Gestió de tecnologies i equipament mèdic"
            ]
          },
          skills: ["Medical devices", "Problem solving"]
        }
      ]
    },
    {
      company: "SM Medical · Alpinion Medical Systems",
      place: { es: "Tucumán, Argentina", en: "Tucumán, Argentina", ca: "Tucumán, Argentina" },
      roles: [
        {
          title: { es: "Ventas y Servicio Técnico", en: "Sales & Technical Service", ca: "Vendes i Servei Tècnic" },
          start: "2022-06", end: "2023-03", domain: "health",
          bullets: {
            es: [
              "Venta y servicio técnico de ecógrafos Alpinion de última generación",
              "Especialidades: anestesia, ginecología, cardiología y flebología"
            ],
            en: [
              "Sales and technical service for state-of-the-art Alpinion ultrasound systems",
              "Specialties: anaesthesia, gynecology, cardiology and phlebology"
            ],
            ca: [
              "Venda i servei tècnic d'ecògrafs Alpinion d'última generació",
              "Especialitats: anestèsia, ginecologia, cardiologia i flebologia"
            ]
          },
          skills: ["Business analysis", "Customer experience"]
        }
      ]
    },
    {
      company: "Consejo Interuniversitario Nacional",
      place: { es: "Tucumán, Argentina", en: "Tucumán, Argentina", ca: "Tucumán, Argentina" },
      roles: [
        {
          title: { es: "Becario de Investigación EVC-CIN", en: "EVC-CIN Research Fellow", ca: "Becari de Recerca EVC-CIN" },
          start: "2021-09", end: "2022-09", domain: "health",
          bullets: {
            es: [
              "Laboratorio de Ingeniería de Tejidos, Universidad Nacional de Tucumán",
              "Trabajo final de grado: análisis del potencial de acción en nervio ciático de rana",
              "Póster presentado en el congreso SABI 2022"
            ],
            en: [
              "Tissue Engineering Laboratory, National University of Tucumán",
              "Final degree project: action potential analysis in frog sciatic nerve",
              "Poster presented at the SABI 2022 conference"
            ],
            ca: [
              "Laboratori d'Enginyeria de Teixits, Universitat Nacional de Tucumán",
              "Treball final de grau: anàlisi del potencial d'acció en nervi ciàtic de granota",
              "Pòster presentat al congrés SABI 2022"
            ]
          },
          skills: ["Research", "Statistics", "Signal processing"]
        }
      ]
    },
    {
      company: "Instituto de Maternidad Nuestra Señora de las Mercedes",
      place: { es: "Tucumán, Argentina", en: "Tucumán, Argentina", ca: "Tucumán, Argentina" },
      roles: [
        {
          title: { es: "Ingeniería Clínica (prácticas)", en: "Clinical Engineering Intern", ca: "Enginyeria Clínica (pràctiques)" },
          start: "2021-03", end: "2021-06", domain: "health",
          bullets: {
            es: [
              "Gestión de equipamiento médico y relevamiento de servicios hospitalarios",
              "Mantenimiento preventivo, predictivo y correctivo",
              "Instalación de nuevas tecnologías y formación del personal médico"
            ],
            en: [
              "Medical equipment management and hospital services survey",
              "Preventive, predictive and corrective maintenance",
              "Installation of new technologies and training of medical staff"
            ],
            ca: [
              "Gestió d'equipament mèdic i inventari de serveis hospitalaris",
              "Manteniment preventiu, predictiu i correctiu",
              "Instal·lació de noves tecnologies i formació del personal mèdic"
            ]
          },
          skills: ["Biomedicine", "Problem solving"]
        }
      ]
    }
  ],

  education: [
    {
      school: "EAE Business School",
      degree: { es: "Máster en Big Data & Analytics", en: "Master's in Big Data & Analytics", ca: "Màster en Big Data & Analytics" },
      start: "2023", end: "2024", kind: "master"
    },
    {
      school: "Universitat Politècnica de Catalunya (UPC)",
      degree: {
        es: "Máster en Business Intelligence e Innovación Tecnológica, Big Data & Analytics",
        en: "Master's in Business Intelligence & Technological Innovation, Big Data & Analytics",
        ca: "Màster en Business Intelligence i Innovació Tecnològica, Big Data & Analytics"
      },
      start: "2022", end: "2023", kind: "master"
    },
    {
      school: "Universidad Nacional de Tucumán",
      degree: { es: "Ingeniería Biomédica", en: "Biomedical Engineering", ca: "Enginyeria Biomèdica" },
      start: "2015", end: "2022", kind: "degree"
    },
    {
      school: "Escuela Técnica Ing. Herminio Arrieta",
      degree: { es: "Técnico Químico", en: "Chemical Technician", ca: "Tècnic Químic" },
      start: "2009", end: "2014", kind: "school"
    }
  ],

  skills: [
    { icon: "fa-project-diagram", name: { es: "Ingeniería de datos", en: "Data engineering", ca: "Enginyeria de dades" }, items: ["Databricks", "Apache Spark", "dbt", "ETL / ELT", "Data Lake", "DWH", "Data modeling"] },
    { icon: "fa-chart-bar", name: { es: "BI y analítica", en: "BI & analytics", ca: "BI i analítica" }, items: ["Power BI", "Qlik Sense", "KPI reporting", "Google Analytics"] },
    { icon: "fa-code", name: { es: "Lenguajes", en: "Languages", ca: "Llenguatges" }, items: ["Python", "SQL", "Oracle SQL", "Pandas"] },
    { icon: "fa-cloud", name: { es: "Cloud y DevOps", en: "Cloud & DevOps", ca: "Cloud i DevOps" }, items: ["Azure Databricks", "GCP", "BigQuery", "Git", "CI/CD", "Jira"] },
    { icon: "fa-brain", name: { es: "IA", en: "AI", ca: "IA" }, items: ["Generative AI", "Claude", "Deep Learning"] },
    { icon: "fa-heartbeat", name: { es: "Salud", en: "Healthcare", ca: "Salut" }, items: ["Medical devices", "Clinical engineering", "HL7", "Biosignals"] }
  ],

  // level: escala de LinkedIn de 1 (básica) a 5 (nativa).
  languages: [
    { name: { es: "Español", en: "Spanish", ca: "Castellà" }, level: 5, label: { es: "Nativo", en: "Native", ca: "Natiu" } },
    { name: { es: "Inglés", en: "English", ca: "Anglès" }, level: 3, label: { es: "Profesional", en: "Professional working", ca: "Professional" } },
    { name: { es: "Catalán", en: "Catalan", ca: "Català" }, level: 1, label: { es: "Básico · comprensión", en: "Elementary · understanding", ca: "Bàsic · comprensió" } }
  ],

  // cat: ai | data | dev
  certs: [
    { name: "GenAI Academy: Yellow Belt Level 2 for Engineers", issuer: "NTT DATA", date: "2025-08", cat: "ai" },
    { name: "Curso IA Generativa: ChatGPT, Midjourney", issuer: "Udemy", date: "2025-02", cat: "ai" },
    { name: "GenAI Academy: Yellow Belt Level 1", issuer: "NTT DATA", date: "2025-01", cat: "ai" },
    { name: "GenAI Academy: White Belt", issuer: "NTT DATA", date: "2025-01", cat: "ai" },
    { name: "Fonaments de programació en Python (PCAP)", issuer: "PUEDATA · Python Institute", date: "2024-11", cat: "data" },
    { name: "Máster de especialista en Ciencia de Datos con Python", issuer: "Udemy", date: "2024-07", cat: "data" },
    { name: "Power BI: Análisis de Datos y Business Intelligence", issuer: "Udemy", date: "2023-08", cat: "data" },
    { name: "Desarrollo Web: HTML y CSS", issuer: "Google España", date: "2023-07", cat: "dev" },
    { name: "Full Stack Developer", issuer: "RollingCode School", date: "2020-06", cat: "dev" },
    { name: "Talleres Ingetrónica: Plataforma Arduino", issuer: "UNT · FACET", date: "2019-09", cat: "dev" }
  ],

  interests: {
    es: ["Viajar y conocer culturas", "Deporte al aire libre", "IA aplicada", "Emprender", "Documentales de innovación"],
    en: ["Travel & new cultures", "Outdoor sports", "Applied AI", "Entrepreneurship", "Innovation documentaries"],
    ca: ["Viatjar i conèixer cultures", "Esport a l'aire lliure", "IA aplicada", "Emprendre", "Documentals d'innovació"]
  }
};
