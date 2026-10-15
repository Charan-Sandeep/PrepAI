export type RoadmapSection = {
  id: string;
  label: string;
  title: string;
  intro: string;
  concepts?: string[];
  prerequisites?: string[];
  exercises?: string[];
  projects?: string[];
};

export const roadmapCatalog = [
  {
    slug: "full-stack-development",
    title: "Full Stack Development",
    summary:
      "Build complete web applications by learning the UI, backend, database, API, and deployment layers together.",
    tags: ["Frontend", "Backend", "Databases"],
  },
  {
    slug: "game-development",
    title: "Game Development",
    summary:
      "Learn the fundamentals of gameplay systems, engines, math, physics, and interactive design to create playable experiences.",
    tags: ["Programming", "Game Engines", "Game Design"],
  },
] as const;

export const fullStackRoadmapSections: RoadmapSection[] = [
  {
    id: "overview",
    label: "Overview",
    title: "What is full stack development?",
    intro:
      "Full stack development is the practice of building complete digital products across both the frontend and backend layers. A frontend developer shapes the experience users see, while backend development powers data flow, logic, authentication, and business rules. Together with databases, APIs, and deployment, these layers form a complete application that runs reliably in production.",
    concepts: [
      "Frontend development focuses on the interface, responsiveness, and user interactions.",
      "Backend development handles application logic, request processing, and secure data handling.",
      "Databases store and organize structured data that applications need to load and update.",
      "APIs connect separate systems and allow frontend and backend services to exchange information.",
      "Deployment transforms a working local project into an accessible product for real users.",
    ],
    exercises: [
      "Map a simple application architecture and identify where each layer belongs.",
      "Compare a frontend-only project with a full stack project and list the added responsibilities.",
    ],
  },
  {
    id: "prerequisites",
    label: "Prerequisites",
    title: "Foundation setup",
    intro:
      "Before diving into frameworks, focus on the basics that make every technology easier to learn: how computers and browsers work, how files are organized, and how programming logic is structured.",
    prerequisites: [
      "Basic computer and browser concepts, including tabs, folders, and developer tools.",
      "Understanding files and folders, including local project structure and relative paths.",
      "Basic programming ideas such as variables, control flow, functions, and loops.",
      "Installing a reliable code editor and using the terminal or command line.",
      "Setting up a local environment with Node.js or a similar runtime for web projects.",
    ],
    exercises: [
      "Create a local folder structure for a mini project and describe each file's purpose.",
      "Write a short script that reads input, makes a decision, and prints a result.",
    ],
  },
  {
    id: "html",
    label: "HTML",
    title: "HTML and semantic structure",
    intro:
      "HTML gives structure to web content. It defines what appears on the page and how the browser understands the information it contains.",
    concepts: [
      "Document structure: html, head, body, metadata, and titles.",
      "Semantic elements such as header, main, nav, section, article, and footer.",
      "Headings, paragraphs, links, images, forms, inputs, and lists.",
      "Tables for tabular data and accessibility conventions for screen readers.",
    ],
    exercises: [
      "Build a personal profile page with semantic sections and accessible labels.",
      "Create a contact form with text inputs, radio buttons, and a submit action.",
    ],
  },
  {
    id: "css",
    label: "CSS",
    title: "CSS for layout and styling",
    intro:
      "CSS controls visual design: color, spacing, layout, typography, and responsiveness. Styling is what turns a plain HTML document into a polished user interface.",
    concepts: [
      "Selectors and specificity to target the right elements.",
      "The box model: margins, padding, borders, and dimensions.",
      "Flexbox and CSS Grid to organize layouts.",
      "Positioning strategies, with careful attention to stacking and flow.",
      "Responsive design using breakpoints, fluid sizing, and media queries.",
      "Transitions and subtle animations that improve polish without distracting the user.",
    ],
    exercises: [
      "Create a responsive card grid that adapts from mobile to desktop layouts.",
      "Rebuild a landing page using Flexbox and Grid for alignment and spacing.",
    ],
  },
  {
    id: "javascript",
    label: "JavaScript",
    title: "JavaScript fundamentals",
    intro:
      "JavaScript adds behavior to web pages. It enables dynamic content, interactions, asynchronous data fetching, and logic that responds to user actions.",
    concepts: [
      "Variables, data types, operators, and control flow.",
      "Functions, arrays, objects, and common data structures.",
      "DOM manipulation to update content and structure on the page.",
      "Events such as clicks, keyboard input, and form changes.",
      "Promises, async/await, fetch, and error handling.",
      "Modules that help organize larger applications into reusable pieces.",
    ],
    exercises: [
      "Build a counter app with button interactions and a reset action.",
      "Fetch JSON data from an API and render it into the DOM.",
    ],
  },
  {
    id: "git-and-github",
    label: "Git and GitHub",
    title: "Version control and collaboration",
    intro:
      "Version control allows you to track changes, build confidence in updates, and collaborate with other engineers. Git makes it easier to revert mistakes and work on features safely.",
    concepts: [
      "Repositories, commits, and branches.",
      "Merging, pull requests, and code review workflows.",
      "Collaborative team practices with shared branches and issue tracking.",
      "Conflict resolution and maintaining a clean project history.",
    ],
    exercises: [
      "Initialize a repository and make a small sequence of commits with meaningful messages.",
      "Create a feature branch, merge it, and resolve a simulated merge conflict.",
    ],
  },
  {
    id: "frontend-development",
    label: "Frontend Development",
    title: "Frontend engineering practice",
    intro:
      "Frontend development moves from static HTML and CSS to interactive systems that connect interfaces with data. Modern frontend work usually involves component architecture, structured state, and reusable patterns.",
    concepts: [
      "Component-based architectures and reusable UI systems.",
      "State, props, and how data flows through interface components.",
      "Routing, forms, API integration, and thinking about user journeys.",
      "State management basics and design decisions for more complex applications.",
    ],
    exercises: [
      "Build a dashboard card layout with reusable components and sample data.",
      "Model a controlled form that validates input before submission.",
    ],
  },
  {
    id: "react",
    label: "React",
    title: "React for interactive user interfaces",
    intro:
      "React is a popular UI library for creating structured, component-driven interfaces. It helps you build modular features while managing state and rendering updates efficiently.",
    concepts: [
      "Components, JSX, props, and composition patterns.",
      "State management with hooks such as useState and useEffect.",
      "Event handling, forms, and conditional rendering.",
      "Context for shared data and component composition for cleaner architecture.",
    ],
    exercises: [
      "Build a todo application with local state and task filtering.",
      "Create a small dashboard using reusable components and sample JSON data.",
    ],
  },
  {
    id: "backend-development",
    label: "Backend Development",
    title: "Server-side application logic",
    intro:
      "Backend development powers application behavior behind the scenes. It receives requests, executes logic, talks to databases, and returns structured responses that the frontend can use.",
    concepts: [
      "Server-side programming and an understanding of request and response cycles.",
      "Routing, middleware, validation, and error handling.",
      "Environment variables and secure configuration.",
      "Application structure that scales as features grow.",
    ],
    exercises: [
      "Create a simple API that stores and returns a list of resources.",
      "Add validation and error handling for invalid requests.",
    ],
  },
  {
    id: "apis",
    label: "APIs",
    title: "Working with APIs",
    intro:
      "Application Programming Interfaces connect different systems and let frontend experiences access data and behavior from backend services. Learning APIs is critical for building real-world products.",
    concepts: [
      "HTTP fundamentals, REST conventions, and request methods.",
      "Status codes, JSON payloads, and response handling.",
      "Authentication, validation, and consistent error responses.",
      "Testing API behavior with practical request examples.",
    ],
    exercises: [
      "Call a public API and render the returned data in a UI.",
      "Design an endpoint contract for a simple blog or task management feature.",
    ],
  },
  {
    id: "databases",
    label: "Databases",
    title: "Data storage and retrieval",
    intro:
      "Databases are the structured home for application data. They let applications store users, content, records, and relationships reliably across time and sessions.",
    concepts: [
      "Relational databases, tables, and relationships.",
      "SQL fundamentals such as SELECT, INSERT, UPDATE, and DELETE.",
      "Primary and foreign keys, joins, and basic indexing strategies.",
      "Designing data models for real application needs.",
    ],
    exercises: [
      "Design a schema for a simple blog or task tracker.",
      "Write queries that join related records and summarize results.",
    ],
  },
  {
    id: "authentication",
    label: "Authentication",
    title: "Authentication and security",
    intro:
      "Security is a fundamental requirement for production software. Authentication proves who a user is, while authorization controls what they are allowed to do.",
    concepts: [
      "Authentication versus authorization.",
      "Sessions, cookies, and secure password handling.",
      "Access control, environment variables, and secure configuration.",
      "Common risks such as input validation issues, unsafe data flow, and leaked secrets.",
    ],
    exercises: [
      "Compare a secure login flow with a weak one and identify the key differences.",
      "Implement a protected route pattern in a small app.",
    ],
  },
  {
    id: "testing",
    label: "Testing",
    title: "Quality and debugging",
    intro:
      "Testing helps you catch issues before they reach users. Reliable software is built through a mix of unit tests, integration coverage, and thoughtful debugging.",
    concepts: [
      "Unit testing and integration testing.",
      "API testing and end-to-end checks.",
      "Debugging workflows, logs, and observability basics.",
      "Error handling and validation as part of a healthy development loop.",
    ],
    exercises: [
      "Write a small test suite around a utility function.",
      "Debug a failing frontend or API flow and document the root cause and fix.",
    ],
  },
  {
    id: "deployment",
    label: "Deployment",
    title: "Shipping to production",
    intro:
      "Deployment is the step where a working application becomes available to users. It includes configuration, environment management, hosting, and monitoring.",
    concepts: [
      "Production builds and environment configuration.",
      "Frontend hosting, backend hosting, and database setup.",
      "Domain configuration, logs, and monitoring best practices.",
      "Deployment pipelines for reliable release management.",
    ],
    exercises: [
      "Deploy a static frontend to a hosting platform and verify the live site.",
      "Configure an app for staging and production environment variables.",
    ],
  },
  {
    id: "projects",
    label: "Projects",
    title: "Project-based learning",
    intro:
      "Projects convert theory into practical experience. Building small but realistic applications teaches you how the pieces fit together and helps you recognize where design decisions matter.",
    projects: [
      "Beginner: personal portfolio, responsive landing page, or to-do application.",
      "Intermediate: blog platform, authentication-based task manager, or weather app using an API.",
      "Advanced: full stack interview preparation platform, e-commerce application, or collaborative project management tool.",
    ],
    exercises: [
      "Choose one beginner project and scope it into clear milestones.",
      "Add feature expansion tasks to turn a simple app into a more complete product.",
    ],
  },
  {
    id: "further-learning",
    label: "Further Learning",
    title: "Next steps after the fundamentals",
    intro:
      "Once you can build a complete feature, the next challenge is learning how larger products remain fast, secure, and maintainable. Explore patterns for architecture, performance, cloud services, and accessibility.",
    concepts: [
      "Advanced architecture patterns and scalable application boundaries.",
      "Performance optimization, caching, lazy loading, and maintaining smooth user journeys.",
      "Accessibility, progressive enhancement, and inclusive interface design.",
      "Cloud infrastructure, deployment automation, and production monitoring.",
    ],
    exercises: [
      "Audit a small application for accessibility and usability improvements.",
      "Review a production architecture and identify where scale and reliability concerns emerge.",
    ],
  },
];

export const gameDevelopmentRoadmapSections: RoadmapSection[] = [
  {
    id: "overview",
    label: "Overview",
    title: "What is game development?",
    intro:
      "Game development combines programming, design, art, audio, and systems thinking. A successful game is more than code; it is a carefully designed experience that balances mechanics, player feedback, and technical performance.",
    concepts: [
      "Programming provides the logic behind movement, combat, UI, and gameplay states.",
      "Design shapes player progression, challenge, and the overall feel of the game.",
      "Graphics, animation, and audio create atmosphere and communicate feedback to the player.",
      "Physics and gameplay systems define how objects move, collide, and react in the world.",
    ],
    exercises: [
      "List the key systems in a simple game and describe how they interact.",
      "Describe why a good game loop matters more than a large codebase alone.",
    ],
  },
  {
    id: "programming-fundamentals",
    label: "Programming Fundamentals",
    title: "Core programming skills",
    intro:
      "Strong programming fundamentals are essential, no matter which engine or language you later use. Game programmers must reason clearly about state, logic, and iteration.",
    concepts: [
      "Variables, conditions, loops, functions, classes, and objects.",
      "Basic data structures and how they help manage game state.",
      "Debugging strategies and reading code traces logically.",
      "Simple algorithms that support AI, pathing, and level logic.",
    ],
    exercises: [
      "Write a script that tracks a player's health, score, and inventory state.",
      "Create a simple enemy spawn cycle using loops and conditionals.",
    ],
  },
  {
    id: "mathematics-for-games",
    label: "Mathematics",
    title: "Math for movement and design",
    intro:
      "Game math is about understanding movement, position, direction, and how objects change over time. Even if you do not write advanced math constantly, it informs many gameplay decisions.",
    concepts: [
      "Vectors, coordinates, and spatial relationships.",
      "Basic trigonometry for angles, direction, and rotation.",
      "Distance and direction calculations for aiming and movement.",
      "Transformations and the concept of local versus world space.",
    ],
    exercises: [
      "Calculate how a character changes position over time using velocity and direction.",
      "Model a projectile path and determine its direction and distance.",
    ],
  },
  {
    id: "game-development-concepts",
    label: "Game Concepts",
    title: "Core gameplay concepts",
    intro:
      "Before choosing an engine, understand the systems that make games feel responsive and coherent: timing, input, collisions, and game state transitions.",
    concepts: [
      "Game loops, input handling, and frame rates.",
      "Collision detection and response for movement and interaction.",
      "Game states such as menu, playing, paused, and game over.",
      "Events, triggers, and player feedback systems.",
    ],
    exercises: [
      "Build a minimal game loop that updates state every frame.",
      "Create a simple player movement system with input and boundary checks.",
    ],
  },
  {
    id: "game-engines",
    label: "Game Engines",
    title: "Game engines and tools",
    intro:
      "Game engines provide the framework for rendering, physics, input, scene management, and asset workflows. Different engines suit different goals, and learning the general ideas matters more than chasing a single title.",
    concepts: [
      "Unity, Unreal Engine, and Godot as common options for different workflows.",
      "General engine concepts such as scenes, objects, components, and assets.",
      "Trade-offs between ease of learning, complexity, and project scope.",
    ],
    exercises: [
      "Compare engine choices for a 2D platformer versus a 3D action game.",
      "Set up a blank scene and identify key components and assets needed for movement.",
    ],
  },
  {
    id: "2d-game-development",
    label: "2D Game Development",
    title: "2D worlds, animation, and tiles",
    intro:
      "2D games rely heavily on sprite sheets, simple animation cycles, tilemaps, and well-designed levels that teach the player quickly.",
    concepts: [
      "Sprites, animation states, tilemaps, and camera systems.",
      "Collision boundaries and level geometry.",
      "Player movement patterns and simple enemy behaviors.",
    ],
    exercises: [
      "Build a moving character with idle and run animations.",
      "Create a small 2D level with platforms, hazards, and a camera that follows the player.",
    ],
  },
  {
    id: "3d-game-development",
    label: "3D Game Development",
    title: "3D scenes and rendering basics",
    intro:
      "3D game development introduces a different spatial understanding. You work with models, materials, cameras, and scene composition to create immersive spaces.",
    concepts: [
      "3D models, materials, lighting, and rendering fundamentals.",
      "Cameras, scene management, and object transforms.",
      "Basic composition and understanding depth, perspective, and world scale.",
    ],
    exercises: [
      "Set up a small scene with a player object and a camera rig.",
      "Experiment with lighting and object placement to understand depth and readability.",
    ],
  },
  {
    id: "physics-and-animation",
    label: "Physics and Animation",
    title: "Movement and motion systems",
    intro:
      "Physics and animation help game objects feel alive. They turn raw logic into believable action, character motion, and responsive feedback.",
    concepts: [
      "Rigid bodies, colliders, gravity, and forces.",
      "Character movement and jump systems.",
      "Animation states and timing for attacks, movement, and reactions.",
    ],
    exercises: [
      "Create a simple jump and gravity system for a player character.",
      "Tune animation transitions so movement feels smooth and readable.",
    ],
  },
  {
    id: "game-ai",
    label: "Game AI",
    title: "AI behavior and decision-making",
    intro:
      "Game AI controls how enemies or NPCs respond to the player and the environment. Even simple AI can make a game feel more alive and believable.",
    concepts: [
      "State machines and decision trees.",
      "Pathfinding fundamentals and obstacle-aware movement.",
      "Enemy behaviors, pursuit logic, and simple decision systems.",
    ],
    exercises: [
      "Program an enemy that patrols and chases the player when close enough.",
      "Add a simple state machine for idle, alert, and attack behavior.",
    ],
  },
  {
    id: "level-design",
    label: "Level Design",
    title: "Designing interesting spaces",
    intro:
      "Levels are not just maps; they are gameplay experiences. Good level design teaches the player how to interact with systems and gradually increases challenge or complexity.",
    concepts: [
      "Gameplay flow, progression, difficulty balancing, and pacing.",
      "Environmental storytelling and player motivation.",
      "Layout decisions that encourage exploration and mastery.",
    ],
    exercises: [
      "Design a mini-level with a clear flow from tutorial to challenge.",
      "Add feedback loops that reward a player for solving a simple obstacle.",
    ],
  },
  {
    id: "audio",
    label: "Audio",
    title: "Sound and feedback",
    intro:
      "Audio adds meaning and energy to gameplay. It communicates impact, mood, and state transitions, making the experience more immediate and memorable.",
    concepts: [
      "Sound effects, music layers, and triggers.",
      "Audio cues for win states, damage, and pickups.",
      "Spatial audio basics and player attention design.",
    ],
    exercises: [
      "Add sound effects to jumps, pickups, and damage events.",
      "Design a scene where music and sound react to gameplay pace.",
    ],
  },
  {
    id: "optimization",
    label: "Optimization",
    title: "Performance and stability",
    intro:
      "Games need to remain responsive across hardware, especially when scenes become more detailed or crowded. Optimization is about keeping the experience smooth and stable.",
    concepts: [
      "Profiling, draw calls, memory management, and frame-rate stability.",
      "Asset optimization and reducing unnecessary work each frame.",
      "Balancing visuals and performance in project development.",
    ],
    exercises: [
      "Identify the most expensive systems in a simple game prototype.",
      "Reduce draw calls or object count in a scene and observe the result.",
    ],
  },
  {
    id: "testing-and-publishing",
    label: "Testing and Publishing",
    title: "Debugging, builds, and release",
    intro:
      "Before a game is shared with players, it needs repeated tests, build checks, and platform-specific preparation. Publishing is not just a final step; it is a quality process.",
    concepts: [
      "Gameplay testing and bug reporting.",
      "Build creation and platform considerations.",
      "Version control and release process management.",
    ],
    exercises: [
      "Make a release checklist for a small game project.",
      "Test a prototype across common gameplay states and document issues.",
    ],
  },
  {
    id: "projects",
    label: "Projects",
    title: "Hands-on game projects",
    intro:
      "Projects are the fastest way to learn game design and implementation. They force you to combine systems such as movement, UI, collisions, sound, and level progression into one playable experience.",
    projects: [
      "Beginner: number guessing game, simple 2D platformer, or basic puzzle game.",
      "Intermediate: top-down action game, multi-level platformer, or simple AI opponent.",
      "Advanced: 3D exploration game, multiplayer prototype, or a complete game with menus, audio, levels, and save functionality.",
    ],
    exercises: [
      "Create a mini-game scope document with mechanics, win states, and a difficulty plan.",
      "Add progression systems to turn a one-room prototype into a larger experience.",
    ],
  },
  {
    id: "further-learning",
    label: "Further Learning",
    title: "Advanced topics to explore",
    intro:
      "A strong game development foundation opens the door to advanced topics such as rendering, networking, procedural generation, and more complex AI systems.",
    concepts: [
      "Advanced gameplay architecture and project structure.",
      "Networking and multiplayer design patterns.",
      "Graphics programming, procedural generation, and advanced AI.",
    ],
    exercises: [
      "Review a simple game and identify which systems would become more complex in a larger project.",
      "Research one advanced system and explain how it influences gameplay feel and architecture.",
    ],
  },
];
