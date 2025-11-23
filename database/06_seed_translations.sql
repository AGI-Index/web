-- ============================================
-- Seed Translations for Existing Questions
-- ============================================
-- Run this after 05_question_translations.sql
-- This populates translations for questions ID 2-21 in 6 languages (excluding English which is the main content)
-- ============================================

-- Question 2: Can it recall conversations from over a week ago and proactively reference them in the current context?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(2, 'ko', '일주일 이상 전의 대화를 기억하고 현재 맥락에서 먼저 언급할 수 있는가?', true),
(2, 'ja', '1週間以上前の会話を思い出し、現在の文脈で積極的に参照できるか？', true),
(2, 'zh', '它能回忆起一周前的对话并在当前语境中主动提及吗？', true),
(2, 'es', '¿Puede recordar conversaciones de hace más de una semana y hacer referencia a ellas proactivamente en el contexto actual?', true),
(2, 'de', 'Kann es sich an Gespräche von vor über einer Woche erinnern und diese proaktiv im aktuellen Kontext erwähnen?', true),
(2, 'fr', 'Peut-il se souvenir de conversations datant de plus d''une semaine et y faire référence de manière proactive dans le contexte actuel ?', true);

-- Question 3: Can it seamlessly maintain conversational context across different platforms?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(3, 'ko', '서로 다른 플랫폼(예: 슬랙에서 메신저로 전환) 간에 대화 맥락을 자연스럽게 유지할 수 있는가?', true),
(3, 'ja', '異なるプラットフォーム間（例：Slackからメッセージアプリへの切り替え）で会話の文脈をシームレスに維持できるか？', true),
(3, 'zh', '它能在不同平台之间（如从Slack切换到即时通讯应用）无缝保持对话上下文吗？', true),
(3, 'es', '¿Puede mantener sin problemas el contexto conversacional entre diferentes plataformas (por ejemplo, al cambiar de Slack a una aplicación de mensajería)?', true),
(3, 'de', 'Kann es den Gesprächskontext nahtlos über verschiedene Plattformen hinweg beibehalten (z.B. beim Wechsel von Slack zu einer Messaging-App)?', true),
(3, 'fr', 'Peut-il maintenir de manière fluide le contexte conversationnel entre différentes plateformes (par exemple, en passant de Slack à une application de messagerie) ?', true);

-- Question 4: Can it self-correct when its current statement contradicts something it said days ago?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(4, 'ko', '며칠 전에 한 말과 현재 발언이 모순될 때 스스로 수정할 수 있는가?', true),
(4, 'ja', '数日前の発言と現在の発言が矛盾している場合、自己修正できるか？', true),
(4, 'zh', '当当前陈述与几天前说的话相矛盾时，它能自我纠正吗？', true),
(4, 'es', '¿Puede autocorregirse cuando su declaración actual contradice algo que dijo hace días?', true),
(4, 'de', 'Kann es sich selbst korrigieren, wenn seine aktuelle Aussage etwas widerspricht, das es vor Tagen gesagt hat?', true),
(4, 'fr', 'Peut-il s''autocorriger lorsque sa déclaration actuelle contredit quelque chose qu''il a dit il y a quelques jours ?', true);

-- Question 5: Can it accurately distinguish between sarcasm, jokes, and serious advice based on nuance?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(5, 'ko', '뉘앙스를 바탕으로 비꼼, 농담, 진지한 조언을 정확히 구분할 수 있는가?', true),
(5, 'ja', 'ニュアンスに基づいて、皮肉、冗談、真剣なアドバイスを正確に区別できるか？', true),
(5, 'zh', '它能根据语气细微差别准确区分讽刺、玩笑和认真的建议吗？', true),
(5, 'es', '¿Puede distinguir con precisión entre sarcasmo, bromas y consejos serios basándose en los matices?', true),
(5, 'de', 'Kann es anhand von Nuancen genau zwischen Sarkasmus, Witzen und ernsthaften Ratschlägen unterscheiden?', true),
(5, 'fr', 'Peut-il distinguer avec précision le sarcasme, les blagues et les conseils sérieux en fonction des nuances ?', true);

-- Question 6: Can it correctly infer the meaning of ambiguous pronouns like "that thing" based on past context?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(6, 'ko', '과거 맥락을 바탕으로 "그거"와 같은 모호한 대명사의 의미를 정확히 추론할 수 있는가?', true),
(6, 'ja', '過去の文脈に基づいて「あれ」のような曖昧な代名詞の意味を正確に推測できるか？', true),
(6, 'zh', '它能根据过去的语境正确推断"那个东西"等模糊代词的含义吗？', true),
(6, 'es', '¿Puede inferir correctamente el significado de pronombres ambiguos como "esa cosa" basándose en el contexto pasado?', true),
(6, 'de', 'Kann es die Bedeutung mehrdeutiger Pronomen wie "das Ding" basierend auf dem vergangenen Kontext korrekt erschließen?', true),
(6, 'fr', 'Peut-il déduire correctement le sens de pronoms ambigus comme « ce truc » en fonction du contexte passé ?', true);

-- Question 7: Can it adjust its vocabulary and explanation style based on the listener's age or expertise level?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(7, 'ko', '듣는 사람의 나이나 전문성 수준에 따라 어휘와 설명 방식을 조절할 수 있는가?', true),
(7, 'ja', '聞き手の年齢や専門知識のレベルに応じて語彙や説明スタイルを調整できるか？', true),
(7, 'zh', '它能根据听众的年龄或专业水平调整词汇和解释方式吗？', true),
(7, 'es', '¿Puede ajustar su vocabulario y estilo de explicación según la edad o nivel de experiencia del oyente?', true),
(7, 'de', 'Kann es seinen Wortschatz und Erklärungsstil an das Alter oder den Kenntnisstand des Zuhörers anpassen?', true),
(7, 'fr', 'Peut-il adapter son vocabulaire et son style d''explication en fonction de l''âge ou du niveau d''expertise de l''auditeur ?', true);

-- Question 8: Can it grasp the underlying intent of a speaker who is rambling or hiding their true meaning?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(8, 'ko', '횡설수설하거나 진짜 의도를 숨기는 화자의 본심을 파악할 수 있는가?', true),
(8, 'ja', '話が脱線したり本心を隠している話者の真意を把握できるか？', true),
(8, 'zh', '它能理解一个说话东拉西扯或隐藏真实意图的人的潜在意图吗？', true),
(8, 'es', '¿Puede captar la intención subyacente de un hablante que divaga o esconde su verdadero significado?', true),
(8, 'de', 'Kann es die zugrundeliegende Absicht eines Sprechers erfassen, der abschweift oder seine wahre Bedeutung verbirgt?', true),
(8, 'fr', 'Peut-il saisir l''intention sous-jacente d''un locuteur qui divague ou cache son vrai sens ?', true);

-- Question 9: Can it automatically return to the main business topic after a brief digression into small talk?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(9, 'ko', '잠깐 잡담으로 빠진 후 자동으로 본래의 업무 주제로 돌아올 수 있는가?', true),
(9, 'ja', '少し雑談に逸れた後、自動的に本来のビジネストピックに戻れるか？', true),
(9, 'zh', '在短暂的闲聊之后，它能自动回到主要的业务话题吗？', true),
(9, 'es', '¿Puede volver automáticamente al tema principal de negocios después de una breve digresión en charla informal?', true),
(9, 'de', 'Kann es nach einem kurzen Abschweifen in Smalltalk automatisch zum Hauptgeschäftsthema zurückkehren?', true),
(9, 'fr', 'Peut-il revenir automatiquement au sujet principal après une brève digression de conversation informelle ?', true);

-- Question 10: Can it organize messy, unstructured notes into a structured format (like a spreadsheet) exactly as intended?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(10, 'ko', '정리되지 않은 메모를 의도한 대로 정확하게 구조화된 형식(예: 스프레드시트)으로 정리할 수 있는가?', true),
(10, 'ja', '整理されていないメモを意図通りに正確に構造化されたフォーマット（スプレッドシートなど）に整理できるか？', true),
(10, 'zh', '它能将杂乱无章的笔记按照预期准确地整理成结构化格式（如电子表格）吗？', true),
(10, 'es', '¿Puede organizar notas desordenadas y sin estructura en un formato estructurado (como una hoja de cálculo) exactamente como se pretende?', true),
(10, 'de', 'Kann es unordentliche, unstrukturierte Notizen genau wie beabsichtigt in ein strukturiertes Format (wie eine Tabelle) organisieren?', true),
(10, 'fr', 'Peut-il organiser des notes désordonnées et non structurées dans un format structuré (comme un tableur) exactement comme prévu ?', true);

-- Question 11: Can it detect malicious intent or gaslighting and maintain its stance without being swayed?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(11, 'ko', '악의적인 의도나 가스라이팅을 감지하고 흔들리지 않고 자신의 입장을 유지할 수 있는가?', true),
(11, 'ja', '悪意のある意図やガスライティングを検出し、動じずに自分の立場を維持できるか？', true),
(11, 'zh', '它能检测恶意意图或精神控制，并在不动摇的情况下保持自己的立场吗？', true),
(11, 'es', '¿Puede detectar intenciones maliciosas o manipulación psicológica y mantener su postura sin dejarse influir?', true),
(11, 'de', 'Kann es böswillige Absichten oder Gaslighting erkennen und seinen Standpunkt beibehalten, ohne sich beeinflussen zu lassen?', true),
(11, 'fr', 'Peut-il détecter une intention malveillante ou une manipulation psychologique et maintenir sa position sans se laisser influencer ?', true);

-- Question 12: Can it identify whether a speaker is a family member, friend, or stranger solely by voice tone and intonation?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(12, 'ko', '목소리 톤과 억양만으로 화자가 가족, 친구, 낯선 사람인지 구별할 수 있는가?', true),
(12, 'ja', '声のトーンとイントネーションだけで、話者が家族、友人、見知らぬ人かを識別できるか？', true),
(12, 'zh', '它能仅通过声音语调和语气判断说话者是家人、朋友还是陌生人吗？', true),
(12, 'es', '¿Puede identificar si un hablante es un familiar, amigo o extraño solo por el tono de voz y la entonación?', true),
(12, 'de', 'Kann es allein anhand von Stimmlage und Intonation erkennen, ob ein Sprecher ein Familienmitglied, Freund oder Fremder ist?', true),
(12, 'fr', 'Peut-il identifier si un locuteur est un membre de la famille, un ami ou un étranger uniquement par le ton et l''intonation de la voix ?', true);

-- Question 13: Can it discern true emotion when visual cues contradict audio cues?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(13, 'ko', '시각적 단서(예: 웃는 얼굴)와 청각적 단서(예: 떨리는 목소리)가 모순될 때 진짜 감정을 파악할 수 있는가?', true),
(13, 'ja', '視覚的手がかり（例：笑顔）と聴覚的手がかり（例：震える声）が矛盾する場合、本当の感情を見分けられるか？', true),
(13, 'zh', '当视觉线索（如微笑的脸）与听觉线索（如颤抖的声音）相矛盾时，它能辨别真实情感吗？', true),
(13, 'es', '¿Puede discernir la emoción verdadera cuando las señales visuales (por ejemplo, cara sonriente) contradicen las señales auditivas (por ejemplo, voz temblorosa)?', true),
(13, 'de', 'Kann es wahre Emotionen erkennen, wenn visuelle Hinweise (z.B. lächelndes Gesicht) den auditiven Hinweisen (z.B. zitternde Stimme) widersprechen?', true),
(13, 'fr', 'Peut-il discerner la véritable émotion lorsque les indices visuels (par exemple, visage souriant) contredisent les indices auditifs (par exemple, voix tremblante) ?', true);

-- Question 14: Can it navigate to a restroom or emergency exit in an unfamiliar building using maps or visual cues?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(14, 'ko', '낯선 건물에서 지도나 시각적 단서를 이용해 화장실이나 비상구로 안내할 수 있는가?', true),
(14, 'ja', '見知らぬ建物で地図や視覚的手がかりを使ってトイレや非常口まで案内できるか？', true),
(14, 'zh', '它能在陌生的建筑物中使用地图或视觉线索导航到洗手间或紧急出口吗？', true),
(14, 'es', '¿Puede navegar hacia un baño o salida de emergencia en un edificio desconocido usando mapas o señales visuales?', true),
(14, 'de', 'Kann es in einem unbekannten Gebäude mithilfe von Karten oder visuellen Hinweisen zur Toilette oder zum Notausgang navigieren?', true),
(14, 'fr', 'Peut-il naviguer vers des toilettes ou une sortie de secours dans un bâtiment inconnu en utilisant des cartes ou des indices visuels ?', true);

-- Question 15: Can it explain complex spatial concepts by drawing a diagram or map in real-time?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(15, 'ko', '실시간으로 다이어그램이나 지도를 그려서 복잡한 공간 개념을 설명할 수 있는가?', true),
(15, 'ja', 'リアルタイムで図や地図を描いて複雑な空間概念を説明できるか？', true),
(15, 'zh', '它能通过实时绘制图表或地图来解释复杂的空间概念吗？', true),
(15, 'es', '¿Puede explicar conceptos espaciales complejos dibujando un diagrama o mapa en tiempo real?', true),
(15, 'de', 'Kann es komplexe räumliche Konzepte erklären, indem es ein Diagramm oder eine Karte in Echtzeit zeichnet?', true),
(15, 'fr', 'Peut-il expliquer des concepts spatiaux complexes en dessinant un diagramme ou une carte en temps réel ?', true);

-- Question 16: Can it learn how to use a new tool (e.g., chopsticks) simply by watching a video demonstration?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(16, 'ko', '동영상 시연만 보고 새로운 도구(예: 젓가락) 사용법을 배울 수 있는가?', true),
(16, 'ja', 'ビデオデモを見るだけで新しい道具（例：箸）の使い方を学べるか？', true),
(16, 'zh', '它能仅通过观看视频演示来学习如何使用新工具（如筷子）吗？', true),
(16, 'es', '¿Puede aprender a usar una nueva herramienta (por ejemplo, palillos) simplemente viendo una demostración en video?', true),
(16, 'de', 'Kann es lernen, ein neues Werkzeug (z.B. Essstäbchen) zu benutzen, indem es einfach eine Videodemonstration ansieht?', true),
(16, 'fr', 'Peut-il apprendre à utiliser un nouvel outil (par exemple, des baguettes) simplement en regardant une démonstration vidéo ?', true);

-- Question 17: Can it analyze dashcam footage to determine the cause of an accident and assign fault based on context?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(17, 'ko', '블랙박스 영상을 분석하여 사고 원인을 파악하고 상황에 따라 과실을 판단할 수 있는가?', true),
(17, 'ja', 'ドライブレコーダーの映像を分析して事故原因を特定し、状況に基づいて過失を判断できるか？', true),
(17, 'zh', '它能分析行车记录仪录像来确定事故原因并根据情况判定责任吗？', true),
(17, 'es', '¿Puede analizar grabaciones de cámara de tablero para determinar la causa de un accidente y asignar la culpa según el contexto?', true),
(17, 'de', 'Kann es Dashcam-Aufnahmen analysieren, um die Unfallursache zu bestimmen und basierend auf dem Kontext Schuld zuzuweisen?', true),
(17, 'fr', 'Peut-il analyser des images de caméra embarquée pour déterminer la cause d''un accident et attribuer la faute en fonction du contexte ?', true);

-- Question 18: Can it retrieve a specific file based on abstract descriptions?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(18, 'ko', '"2년 전 해변에서 웃었던 그 영상"처럼 추상적인 설명을 바탕으로 특정 파일을 찾을 수 있는가?', true),
(18, 'ja', '「2年前にビーチで笑ったあの動画」のような抽象的な説明に基づいて特定のファイルを取得できるか？', true),
(18, 'zh', '它能根据抽象描述（如"两年前我们在海滩上大笑的那个视频"）检索特定文件吗？', true),
(18, 'es', '¿Puede recuperar un archivo específico basándose en descripciones abstractas como "ese video donde nos reímos en la playa hace dos años"?', true),
(18, 'de', 'Kann es eine bestimmte Datei basierend auf abstrakten Beschreibungen wie "das Video, wo wir vor zwei Jahren am Strand gelacht haben" abrufen?', true),
(18, 'fr', 'Peut-il récupérer un fichier spécifique basé sur des descriptions abstraites comme « cette vidéo où on a ri à la plage il y a deux ans » ?', true);

-- Question 19: Can it distinguish between a friendly greeting and a hostile threat based on body language?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(19, 'ko', '신체 언어(예: 달려오는 개)를 기반으로 친근한 인사와 적대적인 위협을 구별할 수 있는가?', true),
(19, 'ja', 'ボディランゲージ（例：走ってくる犬）に基づいて、フレンドリーな挨拶と敵意のある脅威を区別できるか？', true),
(19, 'zh', '它能根据肢体语言（如奔跑的狗）区分友好的问候和敌意的威胁吗？', true),
(19, 'es', '¿Puede distinguir entre un saludo amistoso y una amenaza hostil basándose en el lenguaje corporal (por ejemplo, un perro corriendo)?', true),
(19, 'de', 'Kann es anhand der Körpersprache (z.B. ein laufender Hund) zwischen einer freundlichen Begrüßung und einer feindlichen Bedrohung unterscheiden?', true),
(19, 'fr', 'Peut-il distinguer entre une salutation amicale et une menace hostile en fonction du langage corporel (par exemple, un chien qui court) ?', true);

-- Question 20: Can it autonomously identify tasks that need doing without explicit commands?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(20, 'ko', '명시적인 명령 없이 해야 할 일(예: 어지러운 방 청소)을 자율적으로 파악할 수 있는가?', true),
(20, 'ja', '明示的な指示なしに、やるべきタスク（例：散らかった部屋の掃除）を自律的に識別できるか？', true),
(20, 'zh', '它能在没有明确命令的情况下自主识别需要完成的任务（如清理凌乱的房间）吗？', true),
(20, 'es', '¿Puede identificar de forma autónoma las tareas que necesitan hacerse (por ejemplo, limpiar una habitación desordenada) sin comandos explícitos?', true),
(20, 'de', 'Kann es autonom Aufgaben identifizieren, die erledigt werden müssen (z.B. ein unordentliches Zimmer aufräumen), ohne explizite Befehle?', true),
(20, 'fr', 'Peut-il identifier de manière autonome les tâches à accomplir (par exemple, nettoyer une pièce en désordre) sans commandes explicites ?', true);

-- Question 21: Can it identify different fabrics/shapes of laundry and fold them using appropriate methods?
INSERT INTO question_translations (question_id, lang_code, content, is_verified) VALUES
(21, 'ko', '다양한 직물/형태의 세탁물을 식별하고 적절한 방법으로 접을 수 있는가?', true),
(21, 'ja', '洗濯物の異なる生地/形状を識別し、適切な方法で畳むことができるか？', true),
(21, 'zh', '它能识别不同面料/形状的衣物并用适当的方法折叠它们吗？', true),
(21, 'es', '¿Puede identificar diferentes telas/formas de ropa y doblarlas usando métodos apropiados?', true),
(21, 'de', 'Kann es verschiedene Stoffe/Formen von Wäsche identifizieren und sie mit geeigneten Methoden falten?', true),
(21, 'fr', 'Peut-il identifier différents tissus/formes de linge et les plier en utilisant des méthodes appropriées ?', true);

-- ============================================
-- VERIFICATION
-- ============================================
-- After running, check the count:
-- SELECT lang_code, COUNT(*) FROM question_translations GROUP BY lang_code ORDER BY lang_code;
-- Expected: 20 rows per language (ko, ja, zh, es, de, fr) = 120 total rows
-- ============================================
