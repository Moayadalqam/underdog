-- ===========================================
-- Database Seed Data
-- ===========================================

-- Curriculum Modules
INSERT INTO curriculum_modules (id, number, title, description, "isActive", "createdAt", "updatedAt")
VALUES
  ('mod-01', 1, 'Introduction to Cold Calling', 'Master the fundamentals of cold calling, from mindset to preparation.', true, NOW(), NOW()),
  ('mod-02', 2, 'Opening Scripts and Hooks', 'Craft compelling openings that capture attention and earn the right to continue.', true, NOW(), NOW()),
  ('mod-03', 3, 'Discovery Questions', 'Master the art of asking questions that uncover needs and build rapport.', true, NOW(), NOW())
ON CONFLICT (number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "updatedAt" = NOW();

-- Lessons for Module 1
INSERT INTO lessons (id, "moduleId", title, content, "order", "createdAt", "updatedAt")
VALUES
  ('mod-01-les-01', 'mod-01', 'The Cold Calling Mindset', 'Cold calling success starts with the right mindset. In this lesson, you''ll learn how to overcome call reluctance and approach each call with confidence.', 1, NOW(), NOW()),
  ('mod-01-les-02', 'mod-01', 'Pre-Call Research', 'Effective cold calls start before you dial. Learn how to research prospects and personalize your approach.', 2, NOW(), NOW()),
  ('mod-01-les-03', 'mod-01', 'Setting Up for Success', 'Your environment and tools matter. Learn how to create an optimal calling setup.', 3, NOW(), NOW())
ON CONFLICT ("moduleId", "order") DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  "updatedAt" = NOW();

-- Lessons for Module 2
INSERT INTO lessons (id, "moduleId", title, content, "order", "createdAt", "updatedAt")
VALUES
  ('mod-02-les-01', 'mod-02', 'The First 10 Seconds', 'You have about 10 seconds to earn attention. Learn how to make every word count.', 1, NOW(), NOW()),
  ('mod-02-les-02', 'mod-02', 'Permission-Based Openings', 'Asking for permission shows respect and increases engagement. Learn when and how to use this technique.', 2, NOW(), NOW()),
  ('mod-02-les-03', 'mod-02', 'Value Proposition Statements', 'Your value prop must be clear, specific, and relevant. Learn to articulate value in seconds.', 3, NOW(), NOW())
ON CONFLICT ("moduleId", "order") DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  "updatedAt" = NOW();

-- Lessons for Module 3
INSERT INTO lessons (id, "moduleId", title, content, "order", "createdAt", "updatedAt")
VALUES
  ('mod-03-les-01', 'mod-03', 'The Power of Questions', 'Great salespeople ask great questions. Learn why discovery is the foundation of consultative selling.', 1, NOW(), NOW()),
  ('mod-03-les-02', 'mod-03', 'Open vs. Closed Questions', 'Different questions serve different purposes. Learn when to use open and closed questions strategically.', 2, NOW(), NOW()),
  ('mod-03-les-03', 'mod-03', 'SPIN Questioning', 'The SPIN framework (Situation, Problem, Implication, Need-payoff) is a proven discovery methodology.', 3, NOW(), NOW()),
  ('mod-03-les-04', 'mod-03', 'Active Listening', 'Asking great questions means nothing if you don''t listen to the answers. Master active listening.', 4, NOW(), NOW())
ON CONFLICT ("moduleId", "order") DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  "updatedAt" = NOW();

-- Training Scenarios
INSERT INTO training_scenarios (id, "moduleId", title, description, "personaHint", difficulty, "isActive", "createdAt", "updatedAt")
VALUES
  ('mod-01-scn-01', 'mod-01', 'First Call Jitters', 'Practice making your first cold call of the day to a friendly gatekeeper.', 'Use the friendly-manager persona for a supportive first interaction.', 1, true, NOW(), NOW()),
  ('mod-02-scn-01', 'mod-02', 'Breaking Through to a Busy Executive', 'Practice your opening on a time-pressed VP who gets 20 cold calls a day.', 'Use the busy-exec persona. Be concise and lead with value.', 3, true, NOW(), NOW()),
  ('mod-02-scn-02', 'mod-02', 'The Skeptical Gatekeeper', 'Get past a protective assistant to reach the decision-maker.', 'Focus on being professional and providing value to the gatekeeper.', 2, true, NOW(), NOW()),
  ('mod-03-scn-01', 'mod-03', 'Discovery Deep Dive', 'Conduct a full discovery call with a prospect who has complex needs.', 'Use the friendly-manager persona. Focus on uncovering 3+ pain points.', 3, true, NOW(), NOW()),
  ('mod-03-scn-02', 'mod-03', 'The One-Word Responder', 'Practice getting a taciturn prospect to open up through skillful questioning.', 'Use the skeptical-cfo persona. Work to build rapport through questions.', 4, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Objections
INSERT INTO objections (id, category, text, "suggestedResponses", difficulty, "isActive", "createdAt", "updatedAt")
VALUES
  ('obj-common-01', 'common', 'I''m not interested', ARRAY['I appreciate that - most people aren''t interested until they see how we''ve helped companies like [similar company] reduce [pain point] by [percentage]. Would it be worth 30 seconds to see if this applies to you?', 'That''s completely fair - you probably get a lot of these calls. I''m actually not trying to sell you anything today. I just wanted to ask: [relevant discovery question]?'], 2, true, NOW(), NOW()),
  ('obj-common-02', 'common', 'We don''t have budget for this', ARRAY['I understand budget is always a consideration. Help me understand - if budget weren''t a factor, is this something that would solve a real problem for you?', 'That''s exactly why I called. Our clients typically see [ROI metric] within [timeframe]. Would it help if I showed you how the investment pays for itself?'], 3, true, NOW(), NOW()),
  ('obj-common-03', 'common', 'Send me some information', ARRAY['Happy to do that. So I can send you the most relevant information - what specifically would be most useful for you to see?', 'Absolutely. Quick question - if what I send addresses [specific pain point], would you be open to a brief call to discuss?'], 2, true, NOW(), NOW()),
  ('obj-common-04', 'common', 'I need to think about it', ARRAY['That makes sense - this is an important decision. What specifically would you want to think through? Maybe I can help clarify something.', 'Of course. Often when people say that, there''s a specific concern holding them back. Is there anything about [price/timing/fit] that''s giving you pause?'], 3, true, NOW(), NOW()),
  ('obj-common-05', 'common', 'We already have a solution', ARRAY['That''s great that you have something in place. Many of our best clients came to us from [competitor]. Out of curiosity, what do you like most about your current solution?', 'Makes sense. If you could wave a magic wand and improve one thing about your current setup, what would it be?'], 3, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- AI Personas
INSERT INTO ai_personas (id, name, personality, "moodMin", "moodMax", "objectionStyle", "responsePatterns", "isActive", "createdAt", "updatedAt")
VALUES
  ('persona-skeptical-cfo', 'Patricia Thornton', 'skeptical', 'low', 'medium', 'common', ARRAY['What''s the bottom line here?', 'Walk me through the numbers.', 'We''ve heard this before.', 'That''s a bold claim.', 'I need to see proof of that.', 'Our current solution handles that.'], true, NOW(), NOW()),
  ('persona-busy-exec', 'Marcus Chen', 'busy', 'low', 'high', 'common', ARRAY['Get to it.', 'And?', 'What''s the bottom line?', 'How does this help me today?', 'I need to run.', 'Send it to Sarah, my EA.'], true, NOW(), NOW()),
  ('persona-friendly-manager', 'Jennifer Walsh', 'friendly', 'medium', 'high', 'personality', ARRAY['That''s interesting, tell me more.', 'How would that work for a team like mine?', 'I''d need to see how that fits our process.', 'My team would probably ask about...', 'Let me think about that.', 'I appreciate you explaining that.'], true, NOW(), NOW())
ON CONFLICT DO NOTHING;
