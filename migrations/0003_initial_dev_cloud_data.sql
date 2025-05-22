-- Migration: Initial "Dev & Cloud" data

-- --------------------------------
-- Dev & Cloud channel initial data
-- --------------------------------

-- Design Patterns Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Design Patterns Series', 'Explores essential design patterns that help solve common software design problems, making code more flexible, reusable, and maintainable.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Programming Languages Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Programming Languages Series', 'Dives into the strengths, use cases, and unique features of popular programming languages, helping developers choose the right tool for the job.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Frontend Frameworks Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Frontend Frameworks Series', 'Covers popular frontend frameworks and libraries, focusing on building dynamic, responsive, and user-friendly web applications.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Backend Technologies Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Backend Technologies Series', 'Examines backend frameworks and tools that power server-side development, enabling scalable and efficient web services.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Database Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Database Series', 'Provides an in-depth look at relational and NoSQL databases, their architectures, and best practices for data management and optimization.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Cloud Providers Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Cloud Providers Series', 'Introduces major cloud platforms and their services, focusing on how to leverage cloud infrastructure for scalable and cost-effective solutions.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- DevOps Tools Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('DevOps Tools Series', 'Explores essential DevOps tools for automation, CI/CD, monitoring, and infrastructure management to streamline development workflows.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- SRE Practices Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('SRE Practices Series', 'Focuses on Site Reliability Engineering principles and practices to ensure system reliability, scalability, and performance in production environments.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Soft Skills Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Soft Skills Series', 'Highlights critical soft skills like communication, time management, and collaboration that are essential for success in software development teams.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Career Development Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Career Development Series', 'Offers guidance on career growth, from technical interviews to leadership roles, helping developers navigate their professional journey.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Industry Trends Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Industry Trends Series', 'Discusses the latest trends shaping the tech industry, from AI to remote work, and their impact on software development.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Security Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Security Series', 'Covers fundamental security practices, tools, and techniques to protect software applications from vulnerabilities and threats.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Performance Optimization Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Performance Optimization Series', 'Provides strategies and tools for optimizing software performance, from code efficiency to infrastructure scaling.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Accessibility Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Accessibility Series', 'Focuses on designing and developing software that is inclusive and accessible to all users, including those with disabilities.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Version Control Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Version Control Series', 'Explores version control systems like Git, covering workflows, best practices, and collaboration techniques for managing codebases.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Containerization and Orchestration Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Containerization and Orchestration Series', 'Introduces container technologies like Docker and orchestration tools like Kubernetes for building, deploying, and managing applications at scale.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Testing Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Testing Series', 'Covers various testing methodologies, from unit testing to end-to-end testing, ensuring software quality and reliability.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Agile Methodologies Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Agile Methodologies Series', 'Explores Agile practices like Scrum and Kanban, focusing on improving team collaboration, productivity, and project delivery.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Software Architecture Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Software Architecture Series', 'Discusses architectural patterns and principles for designing scalable, maintainable, and efficient software systems.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Programming Paradigms Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Programming Paradigms Series', 'Examines different programming paradigms, such as object-oriented and functional programming, and their applications in software development.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Data Structures and Algorithms Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Data Structures and Algorithms Series', 'Provides a deep dive into fundamental data structures and algorithms, essential for solving complex problems and optimizing code.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Web Development Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Web Development Series', 'Covers modern web development techniques, from HTML5 and CSS3 to JavaScript frameworks, for building dynamic web applications.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Mobile Development Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Mobile Development Series', 'Focuses on mobile app development for iOS and Android, including native and cross-platform frameworks like Flutter and React Native.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Desktop Application Development Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Desktop Application Development Series', 'Explores tools and frameworks for building cross-platform desktop applications, such as Electron and Qt.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Game Development Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Game Development Series', 'Introduces game development concepts, tools, and engines like Unity and Unreal Engine for creating interactive experiences.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- IoT and Embedded Systems Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('IoT and Embedded Systems Series', 'Covers the development of IoT and embedded systems, focusing on hardware-software integration and real-time applications.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Big Data and Analytics Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Big Data and Analytics Series', 'Explores big data technologies like Hadoop and Spark, and data analytics tools for processing and visualizing large datasets.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Machine Learning and AI Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Machine Learning and AI Series', 'Provides an introduction to machine learning and AI concepts, algorithms, and frameworks for building intelligent applications.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Blockchain and Cryptocurrency Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Blockchain and Cryptocurrency Series', 'Discusses blockchain technology, smart contracts, and cryptocurrencies, exploring their applications and impact on software development.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Quantum Computing Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Quantum Computing Series', 'Introduces quantum computing concepts, algorithms, and programming tools, exploring the future of computation.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Ethics in Technology Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Ethics in Technology Series', 'Explores ethical considerations in software development, including privacy, bias, and the social impact of technology.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- History of Computing Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('History of Computing Series', 'Provides a historical perspective on the evolution of computing, from early machines to modern software development.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Future of Technology Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Future of Technology Series', 'Discusses emerging technologies and trends that will shape the future of software development and the tech industry.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- API Development Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('API Development Series', 'Focuses on designing, building, and securing APIs, covering REST, GraphQL, and best practices for API development.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Microservices Architecture Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Microservices Architecture Series', 'Explores the principles of microservices, including design, deployment, and communication strategies for distributed systems.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Serverless Computing Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Serverless Computing Series', 'Introduces serverless architectures, focusing on building scalable applications without managing infrastructure.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Low-Code and No-Code Development Series
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Low-Code and No-Code Development Series', 'Discusses low-code and no-code platforms, their benefits, and how they are transforming software development.', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------
-- Dev & Cloud channel initial data
-- --------------------------------

-- Design Patterns Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Understanding the Singleton Pattern', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Factory Method Pattern Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Observer Pattern in Action', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Decorator Pattern: Enhancing Functionality', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Strategy Pattern for Flexible Algorithms', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Adapter Pattern: Bridging Incompatibilities', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Command Pattern: Encapsulating Actions', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Template Method Pattern Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('State Pattern: Managing Object Behavior', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chain of Responsibility: Passing the Baton', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Prototype Pattern: Cloning Objects', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Builder Pattern: Constructing Complex Objects', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Abstract Factory: Families of Objects', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Composite Pattern: Trees and Leaves', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Facade Pattern: Simplifying Interfaces', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Proxy Pattern: Controlling Access', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Iterator Pattern: Traversing Collections', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mediator Pattern: Centralizing Communication', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Memento Pattern: Capturing State', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Visitor Pattern: Extending Operations', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Design Patterns Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Programming Languages Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Why Learn Python?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Java: Still Relevant After All These Years', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Rise of Rust', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JavaScript: The Web''s Backbone', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Go: Simplicity and Performance', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('C++: Power and Control', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ruby: Developer Happiness', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('PHP: Powering the Web', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Swift: Apple''s Modern Language', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kotlin: Android''s Preferred Choice', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('TypeScript: JavaScript with Types', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('C#: Microsoft''s Versatile Language', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Scala: Functional Meets Object-Oriented', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Haskell: Pure Functional Programming', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Lua: Lightweight and Embeddable', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('R: Data Analysis and Visualization', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Perl: The Swiss Army Knife', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Elixir: Concurrency and Scalability', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dart: Beyond Flutter', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Groovy: Java''s Dynamic Friend', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Languages Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Frontend Frameworks Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('React: A Comprehensive Guide', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Frontend Frameworks Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vue.js for Beginners', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Frontend Frameworks Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Angular vs. React: Which to Choose?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Frontend Frameworks Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Svelte: The Compiler Approach', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Frontend Frameworks Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ember.js: Convention Over Configuration', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Frontend Frameworks Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Backbone.js: Lightweight Structure', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Frontend Frameworks Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Preact: A Faster React Alternative', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Frontend Frameworks Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Alpine.js: Minimalist Reactivity', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Frontend Frameworks Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mithril: Small but Mighty', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Frontend Frameworks Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Solid.js: Reactive Performance', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Frontend Frameworks Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Backend Technologies Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Building APIs with Node.js', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Django: Python''s Web Framework', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Microservices with Spring Boot', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Flask: Lightweight Python Web Apps', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Express.js: Fast Node.js Framework', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ruby on Rails: Full-Stack Power', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Laravel: PHP''s Elegant Framework', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('FastAPI: High-Performance Python', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ASP.NET Core: Cross-Platform Microsoft', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Koa.js: Next-Gen Node.js', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Phoenix: Elixir''s Web Framework', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('NestJS: Structured Node.js', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Play Framework: Scala and Java', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hapi.js: Robust Node.js APIs', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Symfony: PHP Enterprise Solution', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Backend Technologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Database Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('SQL vs. NoSQL: Understanding the Differences', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Database Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mastering PostgreSQL', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Database Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MongoDB for Developers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Database Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MySQL: The Open-Source Standard', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Database Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Redis: In-Memory Speed', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Database Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SQLite: Embedded Simplicity', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Database Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cassandra: Distributed Data', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Database Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('DynamoDB: AWS''s NoSQL', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Database Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MariaDB: MySQL''s Successor', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Database Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CouchDB: Document-Oriented Design', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Database Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Cloud Providers Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Getting Started with AWS', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Cloud Providers Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Azure Fundamentals', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Cloud Providers Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Google Cloud Platform Overview', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Cloud Providers Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AWS Lambda: Serverless Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Cloud Providers Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Azure DevOps: CI/CD in the Cloud', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Cloud Providers Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('GCP Kubernetes Engine: Containers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Cloud Providers Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AWS S3: Storage Solutions', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Cloud Providers Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Azure Functions: Event-Driven Code', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Cloud Providers Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Google Firebase: Real-Time Apps', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Cloud Providers Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('DigitalOcean: Simple Cloud Hosting', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Cloud Providers Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- DevOps Tools Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Jenkins: Automating Your CI/CD Pipeline', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ansible for Configuration Management', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Docker: Containerization Made Easy', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Terraform: Infrastructure as Code', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('GitLab CI: Integrated Pipelines', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Puppet: Server Automation', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chef: Configuration Consistency', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kubernetes: Orchestrating Containers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CircleCI: Continuous Deployment', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Travis CI: Open-Source Builds', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Prometheus: Monitoring Systems', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Grafana: Visualizing Metrics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vagrant: Development Environments', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nagios: Network Monitoring', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Helm: Kubernetes Package Manager', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'DevOps Tools Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- SRE Practices Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Introduction to Site Reliability Engineering', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'SRE Practices Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Monitoring with Prometheus and Grafana', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'SRE Practices Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Incident Response Best Practices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'SRE Practices Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Service Level Objectives (SLOs) Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'SRE Practices Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Postmortems: Learning from Failure', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'SRE Practices Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chaos Engineering: Breaking Things', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'SRE Practices Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Capacity Planning for Reliability', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'SRE Practices Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('On-Call Best Practices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'SRE Practices Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Error Budgets: Balancing Innovation', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'SRE Practices Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Automating Reliability with SRE', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'SRE Practices Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Soft Skills Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Effective Communication for Developers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Soft Skills Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Time Management Tips for Programmers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Soft Skills Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Building a Personal Brand in Tech', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Soft Skills Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Collaboration in Software Teams', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Soft Skills Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Problem-Solving Mindset', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Soft Skills Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Giving and Receiving Feedback', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Soft Skills Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Remote Work Strategies', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Soft Skills Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Leadership for Engineers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Soft Skills Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Managing Stress in Tech', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Soft Skills Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Networking in the Tech Industry', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Soft Skills Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Career Development Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('How to Prepare for a Technical Interview', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Career Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Navigating Your Career Path in Software Engineering', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Career Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Importance of Continuous Learning', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Career Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Building a Standout Resume', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Career Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Open Source Contributions', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Career Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Negotiating Your Salary', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Career Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('From Junior to Senior Developer', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Career Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Freelancing in Software Development', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Career Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mentorship: Giving and Receiving', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Career Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Certifications Worth Pursuing', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Career Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Industry Trends Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('The Evolution of Programming Languages', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Industry Trends Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Impact of AI on Software Development', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Industry Trends Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Open Source Software: Contributions and Communities', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Industry Trends Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cloud Computing: Past and Future', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Industry Trends Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('DevOps: A Cultural Shift', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Industry Trends Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Rise of Low-Code Platforms', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Industry Trends Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cybersecurity in Software Development', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Industry Trends Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Remote Work''s Lasting Impact', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Industry Trends Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Green Computing: Sustainability in Tech', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Industry Trends Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Role of Ethics in Technology', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Industry Trends Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Security Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('OWASP Top 10: What You Need to Know', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Security Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Secure Coding Practices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Security Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Encryption Basics for Developers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Security Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Authentication vs. Authorization', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Security Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cross-Site Scripting (XSS) Prevention', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Security Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SQL Injection: How to Avoid It', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Security Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Security in Microservices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Security Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('OAuth 2.0 Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Security Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Penetration Testing Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Security Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Secure DevOps: Integrating Security', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Security Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Performance Optimization Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Profiling Tools for Performance Analysis', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Performance Optimization Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Caching Strategies for Web Applications', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Performance Optimization Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Load Balancing Techniques', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Performance Optimization Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Database Query Optimization', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Performance Optimization Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Lazy Loading in Frontend', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Performance Optimization Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CDN: Speeding Up Content Delivery', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Performance Optimization Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Multithreading for Performance', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Performance Optimization Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Optimizing API Responses', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Performance Optimization Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Browser Performance Tips', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Performance Optimization Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Memory Management in Applications', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Performance Optimization Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Accessibility Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Web Accessibility Standards', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Accessibility Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tools for Testing Accessibility', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Accessibility Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Best Practices for Inclusive Design', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Accessibility Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ARIA: Enhancing Accessibility', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Accessibility Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Accessibility in Mobile Apps', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Accessibility Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Version Control Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Git Basics: A Beginner''s Guide', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Version Control Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Advanced Git Techniques', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Version Control Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('GitHub vs. GitLab: Which to Use?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Version Control Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Git Workflows: Branching Strategies', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Version Control Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Resolving Merge Conflicts', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Version Control Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Containerization and Orchestration Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Docker: From Development to Deployment', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Containerization and Orchestration Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kubernetes: Managing Containers at Scale', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Containerization and Orchestration Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Docker Compose for Multi-Container Apps', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Containerization and Orchestration Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Container Security Best Practices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Containerization and Orchestration Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Helm Charts: Simplifying Kubernetes', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Containerization and Orchestration Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Testing Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Unit Testing Best Practices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Testing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Integration Testing Strategies', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Testing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Test-Driven Development (TDD) Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Testing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('End-to-End Testing with Selenium', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Testing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mocking in Unit Tests', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Testing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Behavior-Driven Development (BDD)', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Testing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Performance Testing Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Testing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Test Automation Frameworks', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Testing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Testing Microservices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Testing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Code Coverage: How Much is Enough?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Testing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Agile Methodologies Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Scrum: A Practical Introduction', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Agile Methodologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kanban for Software Teams', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Agile Methodologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Extreme Programming (XP) Principles', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Agile Methodologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Agile Retrospectives: Improving Teams', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Agile Methodologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Scaling Agile with SAFe', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Agile Methodologies Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Software Architecture Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Monolithic vs. Microservices Architecture', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Software Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Event-Driven Architecture', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Software Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Designing Scalable Systems', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Software Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Domain-Driven Design Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Software Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hexagonal Architecture Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Software Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CQRS: Command Query Responsibility Segregation', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Software Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Serverless Architecture Patterns', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Software Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('REST vs. GraphQL Architectures', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Software Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Layered Architecture: Best Practices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Software Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Distributed Systems Challenges', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Software Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Programming Paradigms Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Object-Oriented Programming Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Paradigms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Functional Programming Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Paradigms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Procedural Programming: When to Use It', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Paradigms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Declarative vs. Imperative Programming', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Paradigms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Logic Programming with Prolog', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Programming Paradigms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Data Structures and Algorithms Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Arrays and Linked Lists', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Trees and Graphs', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sorting Algorithms: QuickSort and MergeSort', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Binary Search: Efficiency Matters', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hash Tables: Key-Value Power', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Stacks and Queues', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Depth-First Search (DFS)', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Breadth-First Search (BFS)', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dynamic Programming Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Greedy Algorithms: Optimal Choices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Recursion: Solving Problems', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Big O Notation Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Trie Data Structure', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Heaps: Priority Queues', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AVL Trees: Balanced Search', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dijkstra''s Algorithm: Shortest Paths', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Minimum Spanning Trees', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Backtracking Techniques', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Divide and Conquer Strategies', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Algorithm Optimization Tips', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Data Structures and Algorithms Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Web Development Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('HTML5: New Features and Best Practices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Web Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS3: Styling the Modern Web', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Web Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JavaScript ES6+: What''s New?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Web Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Responsive Design Techniques', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Web Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Web Performance Optimization', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Web Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Progressive Web Apps (PWAs)', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Web Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('WebSockets: Real-Time Communication', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Web Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CSS Grid vs. Flexbox', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Web Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Browser Developer Tools', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Web Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Web Security Essentials', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Web Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Mobile Development Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('iOS Development with Swift', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Mobile Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Android Development with Kotlin', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Mobile Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cross-Platform Development with Flutter', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Mobile Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('React Native: Mobile with JavaScript', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Mobile Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Native vs. Hybrid Apps', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Mobile Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mobile UI/UX Best Practices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Mobile Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Push Notifications in Mobile Apps', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Mobile Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mobile App Testing Strategies', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Mobile Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Optimizing Mobile Performance', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Mobile Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('App Store Deployment Tips', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Mobile Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Desktop Application Development Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Building Desktop Apps with Electron', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Desktop Application Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Qt for Cross-Platform Development', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Desktop Application Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('WPF: Windows Desktop Apps', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Desktop Application Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JavaFX: Rich Desktop Interfaces', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Desktop Application Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Desktop App Deployment', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Desktop Application Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Game Development Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Getting Started with Unity', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Game Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Unreal Engine: A Beginner\''s Guide', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Game Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Game Loops and Physics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Game Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2D vs. 3D Game Development', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Game Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Game Design Principles', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Game Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- IoT and Embedded Systems Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Arduino Programming Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'IoT and Embedded Systems Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Raspberry Pi Projects for Beginners', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'IoT and Embedded Systems Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('IoT Protocols: MQTT and CoAP', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'IoT and Embedded Systems Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Embedded Systems Design', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'IoT and Embedded Systems Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sensors and Actuators', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'IoT and Embedded Systems Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Big Data and Analytics Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Introduction to Hadoop', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Big Data and Analytics Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Apache Spark: Processing Big Data', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Big Data and Analytics Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Data Visualization with Tableau', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Big Data and Analytics Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ETL Processes Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Big Data and Analytics Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Big Data Storage Solutions', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Big Data and Analytics Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Machine Learning and AI Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Supervised Learning Algorithms', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Machine Learning and AI Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Unsupervised Learning Techniques', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Machine Learning and AI Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Neural Networks and Deep Learning', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Machine Learning and AI Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Natural Language Processing Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Machine Learning and AI Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Reinforcement Learning Concepts', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Machine Learning and AI Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Machine Learning Model Evaluation', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Machine Learning and AI Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Feature Engineering Tips', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Machine Learning and AI Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AI Ethics and Fairness', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Machine Learning and AI Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('TensorFlow vs. PyTorch', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Machine Learning and AI Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Deploying ML Models', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Machine Learning and AI Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Blockchain and Cryptocurrency Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Understanding Bitcoin and Blockchain', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Blockchain and Cryptocurrency Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ethereum and Smart Contracts', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Blockchain and Cryptocurrency Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Decentralized Apps (DApps)', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Blockchain and Cryptocurrency Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Blockchain Security', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Blockchain and Cryptocurrency Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cryptocurrency Use Cases', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Blockchain and Cryptocurrency Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Quantum Computing Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Quantum Computing Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Quantum Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quantum Algorithms for Developers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Quantum Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Qubits and Quantum Gates', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Quantum Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quantum Programming with Qiskit', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Quantum Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Future of Quantum in Software', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Quantum Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Ethics in Technology Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Privacy Concerns in Software Development', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Ethics in Technology Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Addressing Bias in AI', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Ethics in Technology Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Open Source Ethics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Ethics in Technology Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tech for Social Good', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Ethics in Technology Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ethical Dilemmas in Coding', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Ethics in Technology Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- History of Computing Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('The Evolution of Computers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'History of Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Key Figures in Computing History', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'History of Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Birth of the Internet', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'History of Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Programming Languages Over Time', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'History of Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hardware Milestones', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'History of Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Future of Technology Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Predictions for the Next Decade in Tech', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Future of Technology Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Emerging Technologies to Watch', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Future of Technology Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AI''s Role in Future Software', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Future of Technology Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quantum Computing''s Impact', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Future of Technology Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sustainable Tech Innovations', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Future of Technology Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- API Development Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('The Art of API Design: Crafting Intuitive and Efficient Interfaces', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'API Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Securing Your APIs: Best Practices for Authentication and Authorization', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'API Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('REST vs. GraphQL: Choosing the Right API Architecture', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'API Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('API Versioning Strategies: Managing Change Without Breaking Clients', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'API Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Testing APIs: Tools and Techniques for Reliable Integration', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'API Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Microservices Architecture Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Microservices: Breaking Down the Monolith for Agility and Scale', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Microservices Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Orchestration vs. Choreography: Coordinating Microservices', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Microservices Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Challenges of Microservices: Debugging and Monitoring Distributed Systems', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Microservices Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Microservices Security: Protecting Data Across Services', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Microservices Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Scaling with Microservices: Lessons from High-Traffic Applications', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Microservices Architecture Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Serverless Computing Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Serverless: The Future of Cloud Computing and Cost Efficiency', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Serverless Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Building Scalable Apps with Serverless: From Functions to Full Architectures', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Serverless Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Event-Driven Architectures: Leveraging Serverless for Real-Time Applications', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Serverless Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Serverless Security: Protecting Functions and Data in the Cloud', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Serverless Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hybrid Cloud with Serverless: Integrating On-Prem and Cloud Resources', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Serverless Computing Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Low-Code and No-Code Development Series
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Low-Code: Empowering Citizen Developers to Build Applications', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Low-Code and No-Code Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('No-Code: The Rise of Visual Programming and Its Impact on Development', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Low-Code and No-Code Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Integrating Low-Code Platforms with Enterprise Systems', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Low-Code and No-Code Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Future of Software Development: Will Low-Code Replace Traditional Coding?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Low-Code and No-Code Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Case Studies: Successful Applications Built with Low-Code and No-Code Tools', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Dev & Cloud'), (SELECT id FROM series WHERE title = 'Low-Code and No-Code Development Series'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
