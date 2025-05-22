-- Migration: Initial "Science" data

-- ----------------------------
-- Science channel initial data
-- ----------------------------

-- Series: Classical Mechanics
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Classical Mechanics', 'Explore the principles of motion, forces, and energy that govern the physical world we experience every day.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Electromagnetism
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Electromagnetism', 'Dive into the forces of electricity and magnetism that power modern technology and nature alike.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Thermodynamics
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Thermodynamics', 'Discover how heat and energy flow through the universe, from engines to stars.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Quantum Mechanics
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Quantum Mechanics', 'Step into the weird world of tiny particles where the rules bend in surprising ways.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Relativity
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Relativity', 'Unravel Einstein''s ideas about space, time, and gravity that reshaped our view of the cosmos.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: General Chemistry
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('General Chemistry', 'Learn the building blocks of matter and how they interact in the world around us.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Organic Chemistry
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Organic Chemistry', 'Explore the chemistry of life, focusing on carbon compounds that make up everything from fuels to food.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Inorganic Chemistry
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Inorganic Chemistry', 'Investigate the elements beyond carbon, from metals to gases, and their roles in nature and industry.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Physical Chemistry
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Physical Chemistry', 'See how energy and physics shape chemical reactions and materials.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Cell Biology
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Cell Biology', 'Zoom into the tiny units of life that power plants, animals, and us.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Genetics
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Genetics', 'Decode the secrets of DNA and how traits pass through generations.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Evolution
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Evolution', 'Follow the story of how life adapts and changes over millions of years.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Ecology
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Ecology', 'Understand how living things connect with each other and their surroundings.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Human Biology
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Human Biology', 'Take a tour of the human body and how it works to keep us alive.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Geology
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Geology', 'Dig into the Earth''s history, rocks, and the forces that shape our planet.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Meteorology
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Meteorology', 'Look up to the skies and learn what drives weather and climate.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Oceanography
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Oceanography', 'Plunge into the science of the seas, from waves to underwater worlds.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Environmental Science
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Environmental Science', 'Tackle the big issues of how we live with and protect our planet.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: The Solar System
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('The Solar System', 'Travel through our planetary neighborhood, from the Sun to distant comets.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Stars and Galaxies
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Stars and Galaxies', 'Gaze at the stars and beyond to understand their lives and the galaxies they form.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Cosmology
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Cosmology', 'Ponder the big questions about the universe''s beginning and end.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Mathematics in Science
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Mathematics in Science', 'See how numbers and patterns unlock scientific secrets.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: The Scientific Method
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('The Scientific Method', 'Get the inside scoop on how scientists figure things out.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Landmark Scientific Discoveries
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Landmark Scientific Discoveries', 'Relive the moments that changed science forever.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Scientific Instruments
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Scientific Instruments', 'Meet the tools that let us see the invisible and explore the unknown.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Science and Technology
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Science and Technology', 'Find out how science turns into the tech we use every day.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Science in Everyday Life
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Science in Everyday Life', 'Spot the science hiding in your daily routine.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Great Scientific Mysteries
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Great Scientific Mysteries', 'Tackle the puzzles scientists still can''t solve.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Profiles in Science
INSERT INTO series (title, description, category_id, created_at, updated_at) VALUES
('Profiles in Science', 'Meet the brilliant minds who shaped our understanding of the world.', (SELECT id FROM categories WHERE name = 'Science'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ----------------------------
-- Science channel initial data
-- ----------------------------

-- Series: Classical Mechanics
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Newton''s Laws Unpacked', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Power of Gravity', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Energy in Motion', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Friction: Friend or Foe?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Pendulum Effect', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Spinning Tops and Gyroscopes', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Momentum Matters', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Collisions in Real Life', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Levers and Pulleys', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Falling Objects', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Science of Springs', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Circular Motion Magic', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Work and Power Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Simple Machines Around Us', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Physics of Flight', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Classical Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Electromagnetism
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('What''s a Charge?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Magnets and How They Work', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Electric Current', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Light as a Wave', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Wireless Wonders', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Static Electricity Fun', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Circuits Made Simple', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Electromagnetic Fields', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Powering Your Home', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Radio Waves Around Us', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Lightning Strikes', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Magnetic Poles', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Induction Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Motor Effect', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('X-Rays and Beyond', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Electromagnetism'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Thermodynamics
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Heat Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Thermodynamics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Entropy Puzzle', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Thermodynamics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Steam Power History', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Thermodynamics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cooling Things Down', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Thermodynamics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Energy Efficiency', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Thermodynamics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Heat Death Idea', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Thermodynamics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Melting and Freezing', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Thermodynamics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gas Laws in Action', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Thermodynamics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Engines Everywhere', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Thermodynamics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thermal Expansion', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Thermodynamics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Quantum Mechanics
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Particles or Waves?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Quantum Leap', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Uncertainty Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Spooky Entanglement', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Atoms Up Close', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tunneling Through Walls', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Superposition Secrets', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quantum Cats', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Photon Power', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Electron Behavior', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Smallest Scale', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quantum Computing Peek', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Wave Functions', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Probability Rules', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quantum World Wonders', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Quantum Mechanics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Relativity
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Time Slows Down?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Relativity'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gravity Bends Light', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Relativity'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Speed Limit of the Universe', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Relativity'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Black Hole Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Relativity'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Space-Time Twists', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Relativity'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Relativity in GPS', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Relativity'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mass and Energy', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Relativity'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cosmic Clocks', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Relativity'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gravitational Waves', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Relativity'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Beyond Newton', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Relativity'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: General Chemistry
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Atoms 101', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Periodic Table Tour', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mixing Molecules', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Balancing Reactions', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('What''s pH?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Elements Everywhere', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bonds That Stick', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Solids, Liquids, Gases', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chemical Energy', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Mole Mystery', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Solutions and Mixtures', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Oxidation Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Reduction Reactions', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Everyday Chemistry', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Lab Safety Tips', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'General Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Organic Chemistry
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Carbon''s Versatility', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Organic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Fuels We Burn', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Organic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Plastics Everywhere', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Organic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sugar Science', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Organic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Life''s Molecules', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Organic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Smells and Scents', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Organic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Alcohol Chemistry', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Organic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Medicine Makers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Organic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fats and Oils', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Organic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Organic Reactions', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Organic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Inorganic Chemistry
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Metal Magic', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Inorganic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gases We Breathe', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Inorganic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Crystals and Gems', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Inorganic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rust and Corrosion', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Inorganic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chemical Colors', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Inorganic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mining Elements', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Inorganic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Acids in Action', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Inorganic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bases Around Us', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Inorganic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Salts of the Earth', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Inorganic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Industrial Chemistry', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Inorganic Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Physical Chemistry
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Reaction Speed', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Physical Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Heat in Chemistry', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Physical Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pressure and Gases', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Physical Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Light and Molecules', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Physical Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Catalysts at Work', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Physical Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Equilibrium Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Physical Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Energy Changes', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Physical Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Surface Science', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Physical Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mixing Matters', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Physical Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quantum Chemistry', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Physical Chemistry'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Cell Biology
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Cell Powerhouses', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cell Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Membrane Mysteries', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cell Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dividing Life', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cell Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cell Communication', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cell Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Microscopic Machines', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cell Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nucleus Control', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cell Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Protein Factories', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cell Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Energy in Cells', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cell Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cell Walls', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cell Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Life''s Smallest Parts', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cell Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Genetics
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('DNA Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Genes in Action', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Inheritance Patterns', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mutations Happen', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The Genetic Code', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chromosomes Count', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Twins and Traits', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Genetic Diversity', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cloning Questions', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gene Editing', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Family Trees', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('DNA Repair', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nature vs. Nurture', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Genetic Testing', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Evolution''s Engine', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Genetics'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Evolution
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Survival of the Fittest', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Evolution'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fossils Tell Tales', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Evolution'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Species Splitting', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Evolution'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Human Origins', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Evolution'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Evolution Today', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Evolution'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Adaptation Wonders', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Evolution'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tree of Life', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Evolution'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Extinction Events', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Evolution'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Darwin''s Ideas', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Evolution'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Living Fossils', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Evolution'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Ecology
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Food Webs', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Ecology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Balance in Nature', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Ecology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Saving Species', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Ecology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cycles of Life', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Ecology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Habitats Explored', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Ecology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Predators and Prey', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Ecology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pollinators at Work', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Ecology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Invasive Species', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Ecology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ecosystem Health', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Ecology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Urban Ecology', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Ecology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Human Biology
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Heart Beats', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brain Power', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Breathing Easy', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fighting Germs', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bone Strength', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Muscle Moves', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Digestion Journey', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Blood Flow', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Skin Deep', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hormones at Play', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Senses Alive', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Growing Up', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sleep Cycles', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Aging Science', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Healing Wounds', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Human Biology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Geology
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Earth''s Layers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rock Types', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mountain Building', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Earthquake Science', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Volcano Power', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fossil Finds', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Plate Drifts', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mineral Wealth', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Caves and Karst', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Soil Secrets', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Geologic Time', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Erosion Effects', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Crystal Growth', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Earth''s Core', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Landslide Risks', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Geology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Meteorology
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Cloud Formation', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Meteorology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Wind Patterns', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Meteorology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rain or Shine', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Meteorology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Climate Shifts', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Meteorology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Storm Chasers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Meteorology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Temperature Tales', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Meteorology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Humidity Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Meteorology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Forecasting Fun', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Meteorology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thunder and Lightning', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Meteorology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Seasonal Changes', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Meteorology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Oceanography
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Ocean Motion', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Oceanography'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Deep Sea Secrets', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Oceanography'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Coral Life', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Oceanography'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tides Explained', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Oceanography'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sea Chemistry', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Oceanography'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Wave Power', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Oceanography'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ocean Zones', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Oceanography'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Marine Giants', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Oceanography'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Saltwater Science', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Oceanography'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Underwater Volcanoes', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Oceanography'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Environmental Science
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Clean Air Matters', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Environmental Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Water for Life', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Environmental Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Green Energy', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Environmental Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Trash Talk', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Environmental Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Earth''s Future', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Environmental Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pollution Problems', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Environmental Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Recycling Works', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Environmental Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Habitat Loss', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Environmental Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carbon Cycles', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Environmental Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sustainable Living', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Environmental Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: The Solar System
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Sun Spotlight', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Moon Mysteries', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mars Dreams', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ringed Saturn', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Comet Tales', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Jupiter''s Storms', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Earth''s Place', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Venus Unveiled', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mercury Matters', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Uranus Oddities', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Neptune''s Blue', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Asteroid Belt', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pluto''s Story', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Solar Flares', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Space Rocks', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Solar System'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Stars and Galaxies
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Star Birth', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Supernova Shows', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Our Galaxy', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Black Hole Wonders', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Distant Lights', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Star Colors', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nebula Beauty', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pulsar Beats', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Star Death', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Galaxy Shapes', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Clusters and Groups', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cosmic Dust', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Red Giants', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('White Dwarfs', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Star Maps', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Stars and Galaxies'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Cosmology
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Big Bang Basics', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cosmology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cosmic Expansion', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cosmology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dark Energy', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cosmology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Universe''s Edge', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cosmology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Time''s Start', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cosmology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Matter''s Birth', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cosmology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cosmic Background', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cosmology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Multiverse Ideas', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cosmology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gravity''s Role', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cosmology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('End of Everything', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Cosmology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Mathematics in Science
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Counting the Cosmos', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Mathematics in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Shapes in Nature', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Mathematics in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Odds and Science', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Mathematics in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Math of Motion', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Mathematics in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Data Decoded', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Mathematics in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Infinite Wonders', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Mathematics in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Curves and Graphs', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Mathematics in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Symmetry Secrets', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Mathematics in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Numbers in Life', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Mathematics in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chaos Theory', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Mathematics in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: The Scientific Method
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Asking Questions', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Scientific Method'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Testing Ideas', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Scientific Method'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Proving It', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Scientific Method'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Science Rules', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Scientific Method'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Teamwork in Labs', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'The Scientific Method'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Landmark Scientific Discoveries
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('DNA Unveiled', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Landmark Scientific Discoveries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gravity''s Law', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Landmark Scientific Discoveries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Light''s Speed', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Landmark Scientific Discoveries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Germ Theory', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Landmark Scientific Discoveries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Atom Splitting', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Landmark Scientific Discoveries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Earth''s Spin', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Landmark Scientific Discoveries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Evolution Unveiled', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Landmark Scientific Discoveries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quantum Dawn', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Landmark Scientific Discoveries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Relativity Revealed', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Landmark Scientific Discoveries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Antibiotic Age', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Landmark Scientific Discoveries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Scientific Instruments
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Telescope Tales', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Scientific Instruments'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Microscope Magic', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Scientific Instruments'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Particle Smashers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Scientific Instruments'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Weather Gadgets', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Scientific Instruments'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Space Probes', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Scientific Instruments'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Science and Technology
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Electric Life', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science and Technology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Computer Beginnings', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science and Technology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Phone Science', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science and Technology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Robot Helpers', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science and Technology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Space Tech', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science and Technology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Flight Forward', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science and Technology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Internet Roots', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science and Technology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Medical Machines', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science and Technology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Energy Innovations', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science and Technology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Smart Materials', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science and Technology'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Science in Everyday Life
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Cooking Chemistry', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science in Everyday Life'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sleep Science', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science in Everyday Life'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Music Waves', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science in Everyday Life'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Exercise Energy', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science in Everyday Life'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Weather at Home', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science in Everyday Life'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cleaning Science', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science in Everyday Life'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Light in Rooms', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science in Everyday Life'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Timekeeping Tricks', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science in Everyday Life'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gardening Growth', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science in Everyday Life'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tech at Play', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Science in Everyday Life'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Great Scientific Mysteries
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Where''s the Dark Matter?', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Great Scientific Mysteries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Life''s Start', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Great Scientific Mysteries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mind Mysteries', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Great Scientific Mysteries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Alien Silence', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Great Scientific Mysteries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Time''s Nature', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Great Scientific Mysteries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gravity''s Source', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Great Scientific Mysteries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Missing Energy', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Great Scientific Mysteries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cosmic Origins', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Great Scientific Mysteries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quantum Riddles', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Great Scientific Mysteries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Beyond the Stars', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Great Scientific Mysteries'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Series: Profiles in Science
INSERT INTO podcasts (title, description, markdown_content, source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, first_comment, type, scheduled_publish_at, status, last_status_change_at, created_at, updated_at) VALUES
('Einstein''s Genius', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Curie''s Glow', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Newton''s Apple', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Darwin''s Voyage', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hawking''s Stars', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Galileo''s Gaze', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tesla''s Sparks', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mendel''s Peas', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bohr''s Atoms', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pasteur''s Cure', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kepler''s Orbits', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Lovelace''s Code', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hubble''s Reach', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Watson and Crick', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Faraday''s Fields', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Planck''s Quanta', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rutherford''s Nucleus', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Copernicus'' Shift', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Lavoisier''s Air', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Turing''s Machines', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sagan''s Cosmos', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Meitner''s Split', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Archimedes'' Bath', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Euclid''s Lines', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Heisenberg''s Doubt', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Boyle''s Gases', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hodgkin''s Crystals', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Linnaeus'' Names', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Edison''s Light', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fermi''s Chain', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Noether''s Symmetry', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chandrasekhar''s Limit', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Goodall''s Chimps', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Feynman''s Fun', '', '', '', '', '', '', (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM series WHERE title = 'Profiles in Science'), '[]', '', 'evergreen', NULL, 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
