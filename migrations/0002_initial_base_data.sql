-- Migration: Initial data

-- --------------------------------
-- Admin user & role initial data
-- --------------------------------

-- Insert a default admin user with a temporary password 'pass12345', change this after first login
INSERT INTO users (email, password_hash, name, created_at, updated_at)
VALUES ('admin@xeocast.com', '$2a$12$Nxa2dwJEPDSlhd6AocP8n.I0wu7tFqGE7/WU1R6bMR2osp9o.UGci', 'Admin User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert a default admin role with full access to all features and settings
INSERT INTO roles (name, description, permissions) VALUES ('admin', 'Administrator role with full access to all features and settings', '["*"]'), ('editor', 'Editor role with limited access to content management', '["*"]');

-- Assign 'admin' role to the default admin user
INSERT INTO user_roles (user_id, role_id)
SELECT users.id, roles.id
FROM users, roles
WHERE users.email = 'admin@xeocast.com' AND roles.name = 'admin';

-- --------------------------------
-- Categories initial data
-- --------------------------------

INSERT INTO categories (name, description, default_source_background_bucket_key, default_source_thumbnail_bucket_key, prompt_template_to_gen_evergreen_titles, prompt_template_to_gen_news_titles, prompt_template_to_gen_series_titles, prompt_template_to_gen_article_content, prompt_template_to_gen_description, prompt_template_to_gen_short_description, prompt_template_to_gen_tag_list, prompt_template_to_gen_audio_podcast, prompt_template_to_gen_video_thumbnail, prompt_template_to_gen_article_image, language_code, created_at, updated_at) VALUES
('Dev & Cloud', 
'A daily podcast diving into the vast world of software development and technology. With a new episode every day, it covers critical topics like design patterns, programming languages, frontend and backend frameworks, DevOps, SRE practices, and emerging trends such as AI, blockchain, and quantum computing. From tools like Docker and Kubernetes to insights on soft skills, career growth, and ethical considerations in tech, this podcast offers developers, engineers, and tech enthusiasts actionable knowledge to stay ahead in the fast-evolving industry. Whether you''re a beginner or a seasoned professional, tune in for bite-sized, expert-driven content to fuel your tech journey.', 
'initial-dev-cloud-video-bg.png', 'initial-dev-cloud-thumbnail.jpeg', 
'', '', '', '', '', '', '', '', '', '', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('History', 
'A captivating podcast that brings the past to life through engaging storytelling and deep dives into the moments, people, and ideas that shaped our world. Each episode explores a unique topic, from the rise and fall of great civilizations like the Roman Empire and Ancient Egypt to pivotal wars, revolutionary movements, and daring explorations. Uncover mysteries like the Voynich Manuscript, celebrate cultural milestones like the Renaissance, and ponder intriguing "what-ifs" that reimagine history. With a focus on lesser-known stories, influential figures, and iconic objects like the Rosetta Stone, it offers a fresh perspective on the events and innovations that continue to define humanity. Perfect for history buffs and curious minds alike!', 
'initial-history-video-bg.png', 'initial-history-thumbnail.jpeg', 
'', '', '', '', '', '', '', '', '', '', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AI & Tech', 
'Dive into the fascinating world of artificial intelligence and technology with a daily podcast that explores how AI is transforming every facet of our lives. We cover a wide range of topics, including AI''s role in everyday life, the future of work, ethical dilemmas, healthcare innovations, education, creativity, environmental solutions, business strategies, societal impacts, and the historical evolution of AI. Each episode delivers concise, engaging insights into the opportunities, challenges, and implications of AI, making complex concepts accessible to all. Whether you''re a tech enthusiast, professional, or curious learner, join us to discover how AI is shaping the present and defining the future.', 
'initial-ai-tech-video-bg.png', 'initial-ai-tech-thumbnail.jpeg', 
'', '', '', '', '', '', '', '', '', '', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Science', 
'A daily podcast that brings the wonders of science to your ears in bite-sized episodes. Covering a vast array of topics from classical mechanics to cosmology, each episode dives into a specific scientific concept, discovery, or mystery with engaging titles like "Newton’s Laws Unpacked," "Spooky Entanglement," and "Black Hole Wonders." Explore the forces shaping our universe, the chemistry of everyday life, the intricacies of human biology, and the tools and minds behind groundbreaking discoveries. Perfect for curious minds, this podcast makes complex ideas accessible, sparking wonder and understanding one day at a time.', 
'initial-science-video-bg.png', 'initial-science-thumbnail.jpeg', 
'', '', '', '', '', '', '', '', '', '', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Learn English', 
'A dynamic podcast designed to help English learners of all levels improve their language skills through engaging, bite-sized episodes. With a diverse range of series like Accent Adventure, Pronunciation Pro, Conversation Corner, and Word of the Day, each episode offers practical tips, cultural insights, and focused lessons on speaking, listening, reading, and writing. From mastering tricky sounds to navigating real-world conversations, this podcast provides daily doses of learning to boost fluency, confidence, and cultural understanding in English. Perfect for learners seeking structured yet flexible language improvement!', 
'initial-learn-english-video-bg.png', 'initial-learn-english-thumbnail.jpeg', 
'', '', '', '', '', '', '', '', '', '', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Places & Travel', 
'Embark on a daily journey with a podcast that whisks you away to the world’s most captivating destinations and experiences. Each episode explores a unique travel topic, from awe-inspiring Wonders of the World and hidden gems to vibrant cultural celebrations, epic journeys, and thrilling adventure destinations. Dive into the stories behind architectural marvels, natural phenomena, culinary delights, historical mysteries, literary locations, artistic havens, spiritual sites, idyllic island escapes, and dynamic urban explorations. Perfect for wanderlust-driven listeners, this podcast delivers bite-sized travel inspiration, blending history, culture, and adventure to fuel your next trip or armchair exploration. Join us daily to discover the globe, one story at a time!', 
'initial-places-travel-video-bg.png', 'initial-places-travel-thumbnail.jpeg', 
'', '', '', '', '', '', '', '', '', '', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Aprende Español', 
'Un podcast que ofrece una amplia variedad de series temáticas diseñadas para estudiantes de español de todos los niveles. Con series que cubre desde gramática, vocabulario y pronunciación hasta cultura, estrategias de aprendizaje y contextos específicos como negocios o turismo. Incluye historias adaptadas, y análisis de errores comunes, además de explorar la historia y la influencia global del español. Cada serie, con episodios prácticos y estructurados, fomenta la mejora en comprensión auditiva, expresión oral, lectura y escritura, adaptándose a diferentes necesidades y contextos culturales.', 
'initial-aprende-espanol-video-bg.png', 'initial-aprende-espanol-thumbnail.jpeg', 
'', '', '', '', '', '', '', '', '', '', 'es', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Business', 
'A daily podcast designed to empower entrepreneurs, small business owners, and aspiring professionals with actionable insights and strategies. Covering a wide range of topics, from starting and scaling a business to mastering personal finance, marketing, and leadership, each episode delivers concise, practical advice in areas like entrepreneurship, cryptocurrency, e-commerce, venture capital, and more. With a focus on real-world applications, the podcast explores everything from basic economic concepts to cutting-edge innovation and technology, helping listeners navigate the complexities of business with confidence. Tune in daily for bite-sized lessons to grow your business, sharpen your skills, and achieve your goals.', 
'initial-business-video-bg.png', 'initial-business-thumbnail.jpeg', 
'', '', '', '', '', '', '', '', '', '', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------
-- YouTube channels initial data
-- --------------------------------

INSERT INTO youtube_channels (category_id, youtube_platform_id, youtube_platform_category_id, title, description, video_description_template, first_comment_template, language_code, created_at, updated_at) VALUES
((SELECT id FROM categories WHERE name = 'Dev & Cloud'), 'EIuaYnhJ0UMejAz3YN-2xw', '28', 
'Dev & Cloud Podcast by XEOCAST', 
'A daily podcast diving into the vast world of software development and technology. With a new episode every day, it covers critical topics like design patterns, programming languages, frontend and backend frameworks, DevOps, SRE practices, and emerging trends such as AI, blockchain, and quantum computing. From tools like Docker and Kubernetes to insights on soft skills, career growth, and ethical considerations in tech, this podcast offers developers, engineers, and tech enthusiasts actionable knowledge to stay ahead in the fast-evolving industry. Whether you''re a beginner or a seasoned professional, tune in for bite-sized, expert-driven content to fuel your tech journey.', 
'', 
'', 
'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM categories WHERE name = 'History'), 'UCwA9ryCEHUh0-zELjxQVwsQ', '27', 
'History Podcast by XEOCAST', 
'A captivating podcast that brings the past to life through engaging storytelling and deep dives into the moments, people, and ideas that shaped our world. Each episode explores a unique topic, from the rise and fall of great civilizations like the Roman Empire and Ancient Egypt to pivotal wars, revolutionary movements, and daring explorations. Uncover mysteries like the Voynich Manuscript, celebrate cultural milestones like the Renaissance, and ponder intriguing "what-ifs" that reimagine history. With a focus on lesser-known stories, influential figures, and iconic objects like the Rosetta Stone, it offers a fresh perspective on the events and innovations that continue to define humanity. Perfect for history buffs and curious minds alike!', 
'', 
'', 
'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM categories WHERE name = 'AI & Tech'), 'UC5Yp_XXu1hUcSQs6QG6nrIA', '28', 
'AI & Tech Podcast by XEOCAST', 
'Dive into the fascinating world of artificial intelligence and technology with a daily podcast that explores how AI is transforming every facet of our lives. We cover a wide range of topics, including AI''s role in everyday life, the future of work, ethical dilemmas, healthcare innovations, education, creativity, environmental solutions, business strategies, societal impacts, and the historical evolution of AI. Each episode delivers concise, engaging insights into the opportunities, challenges, and implications of AI, making complex concepts accessible to all. Whether you''re a tech enthusiast, professional, or curious learner, join us to discover how AI is shaping the present and defining the future.', 
'', 
'', 
'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM categories WHERE name = 'Science'), 'UC3LCGhFEDfF8ggZmlZl7IPQ', '28', 
'Science Podcast by XEOCAST', 
'A daily podcast that brings the wonders of science to your ears in bite-sized episodes. Covering a vast array of topics from classical mechanics to cosmology, each episode dives into a specific scientific concept, discovery, or mystery with engaging titles like "Newton’s Laws Unpacked," "Spooky Entanglement," and "Black Hole Wonders." Explore the forces shaping our universe, the chemistry of everyday life, the intricacies of human biology, and the tools and minds behind groundbreaking discoveries. Perfect for curious minds, this podcast makes complex ideas accessible, sparking wonder and understanding one day at a time.', 
'', 
'', 
'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM categories WHERE name = 'Learn English'), 'UCjjpKF7JqcyRqhJVC5rw2PA', '27', 
'Learn English Podcast by XEOCAST', 
'A dynamic podcast designed to help English learners of all levels improve their language skills through engaging, bite-sized episodes. With a diverse range of series like Accent Adventure, Pronunciation Pro, Conversation Corner, and Word of the Day, each episode offers practical tips, cultural insights, and focused lessons on speaking, listening, reading, and writing. From mastering tricky sounds to navigating real-world conversations, this podcast provides daily doses of learning to boost fluency, confidence, and cultural understanding in English. Perfect for learners seeking structured yet flexible language improvement!', 
'', 
'', 
'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM categories WHERE name = 'Places & Travel'), 'UCazJL82CaJU5K6zwTZAtIXw', '19', 
'Places & Travel Podcast by XEOCAST', 
'Embark on a daily journey with a podcast that whisks you away to the world’s most captivating destinations and experiences. Each episode explores a unique travel topic, from awe-inspiring Wonders of the World and hidden gems to vibrant cultural celebrations, epic journeys, and thrilling adventure destinations. Dive into the stories behind architectural marvels, natural phenomena, culinary delights, historical mysteries, literary locations, artistic havens, spiritual sites, idyllic island escapes, and dynamic urban explorations. Perfect for wanderlust-driven listeners, this podcast delivers bite-sized travel inspiration, blending history, culture, and adventure to fuel your next trip or armchair exploration. Join us daily to discover the globe, one story at a time!', 
'', 
'', 
'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM categories WHERE name = 'Aprende Español'), 'UC4YsbpZ7FAJGDuV6eUhmgSw', '27', 
'Aprende Español Podcast by XEOCAST', 
'Un podcast que ofrece una amplia variedad de series temáticas diseñadas para estudiantes de español de todos los niveles. Con series que cubre desde gramática, vocabulario y pronunciación hasta cultura, estrategias de aprendizaje y contextos específicos como negocios o turismo. Incluye historias adaptadas, y análisis de errores comunes, además de explorar la historia y la influencia global del español. Cada serie, con episodios prácticos y estructurados, fomenta la mejora en comprensión auditiva, expresión oral, lectura y escritura, adaptándose a diferentes necesidades y contextos culturales.', 
'', 
'', 
'es', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM categories WHERE name = 'Business'), 'UCqTBpbCinalNAnBTlXrsZ9w', '27', 
'Business Podcast by XEOCAST', 
'A daily podcast designed to empower entrepreneurs, small business owners, and aspiring professionals with actionable insights and strategies. Covering a wide range of topics, from starting and scaling a business to mastering personal finance, marketing, and leadership, each episode delivers concise, practical advice in areas like entrepreneurship, cryptocurrency, e-commerce, venture capital, and more. With a focus on real-world applications, the podcast explores everything from basic economic concepts to cutting-edge innovation and technology, helping listeners navigate the complexities of business with confidence. Tune in daily for bite-sized lessons to grow your business, sharpen your skills, and achieve your goals.', 
'', 
'', 
'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
