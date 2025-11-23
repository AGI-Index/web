-- Insert Linguistic Questions
INSERT INTO questions (content, category, author_id) VALUES
('Can it recall conversations from over a week ago and proactively reference them in the current context?', 'linguistic', NULL),
('Can it seamlessly maintain conversational context across different platforms (e.g., switching from Slack to a messaging app)?', 'linguistic', NULL),
('Can it self-correct when its current statement contradicts something it said days ago?', 'linguistic', NULL),
('Can it accurately distinguish between sarcasm, jokes, and serious advice based on nuance?', 'linguistic', NULL),
('Can it correctly infer the meaning of ambiguous pronouns like "that thing" based on past context?', 'linguistic', NULL),
('Can it adjust its vocabulary and explanation style based on the listener''s age or expertise level?', 'linguistic', NULL),
('Can it grasp the underlying intent of a speaker who is rambling or hiding their true meaning?', 'linguistic', NULL),
('Can it automatically return to the main business topic after a brief digression into small talk?', 'linguistic', NULL),
('Can it organize messy, unstructured notes into a structured format (like a spreadsheet) exactly as intended?', 'linguistic', NULL),
('Can it detect malicious intent or gaslighting and maintain its stance without being swayed?', 'linguistic', NULL);

-- Insert Multimodal Questions
INSERT INTO questions (content, category, author_id) VALUES
('Can it identify whether a speaker is a family member, friend, or stranger solely by voice tone and intonation?', 'multimodal', NULL),
('Can it discern true emotion when visual cues (e.g., smiling face) contradict audio cues (e.g., trembling voice)?', 'multimodal', NULL),
('Can it navigate to a restroom or emergency exit in an unfamiliar building using maps or visual cues?', 'multimodal', NULL),
('Can it explain complex spatial concepts by drawing a diagram or map in real-time?', 'multimodal', NULL),
('Can it learn how to use a new tool (e.g., chopsticks) simply by watching a video demonstration?', 'multimodal', NULL),
('Can it analyze dashcam footage to determine the cause of an accident and assign fault based on context?', 'multimodal', NULL),
('Can it retrieve a specific file based on abstract descriptions like "that video where we laughed at the beach two years ago"?', 'multimodal', NULL),
('Can it distinguish between a friendly greeting and a hostile threat based on body language (e.g., a running dog)?', 'multimodal', NULL),
('Can it autonomously identify tasks that need doing (e.g., cleaning a messy room) without explicit commands?', 'multimodal', NULL),
('Can it identify different fabrics/shapes of laundry and fold them using appropriate methods?', 'multimodal', NULL);