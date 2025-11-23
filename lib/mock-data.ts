export const MOCK_QUESTIONS = [
    {
        id: '1',
        content: "Can an AI model consistently solve International Math Olympiad (IMO) problems at a gold medal level?",
        category: "Linguistic",
        vote_count: 1250,
        suitable_votes: 1100,
        unsuitable_votes: 150,
        current_weight: 3,
        is_indexed: true,
        is_achieved: false,
        dominant_unsuitable_reason: null,
        achieved_count: 450
    },
    {
        id: '2',
        content: "Can an AI agent independently navigate the open web to book a complex travel itinerary including flights, hotels, and reservations?",
        category: "Multimodal",
        vote_count: 890,
        suitable_votes: 800,
        unsuitable_votes: 90,
        current_weight: 2,
        is_indexed: true,
        is_achieved: false,
        dominant_unsuitable_reason: null,
        achieved_count: 120
    },
    {
        id: '3',
        content: "Can an AI model generate a coherent, 90-minute movie with consistent characters and plot from a simple text prompt?",
        category: "Multimodal",
        vote_count: 3400,
        suitable_votes: 3000,
        unsuitable_votes: 400,
        current_weight: 3,
        is_indexed: true,
        is_achieved: true,
        dominant_unsuitable_reason: null,
        achieved_count: 2800
    },
    {
        id: '4',
        content: "Can an AI translate a previously unknown language by learning solely from a small corpus of text without parallel data?",
        category: "Linguistic",
        vote_count: 560,
        suitable_votes: 200,
        unsuitable_votes: 360, // Candidate (failed index criteria)
        current_weight: 2,
        is_indexed: false,
        is_achieved: false,
        dominant_unsuitable_reason: "Too Narrow",
        achieved_count: 45
    },
    {
        id: '5',
        content: "Can an AI write a novel that wins a major literary award (e.g., Pulitzer, Booker) without human editing?",
        category: "Linguistic",
        vote_count: 1100,
        suitable_votes: 900,
        unsuitable_votes: 200,
        current_weight: 3,
        is_indexed: true,
        is_achieved: false,
        dominant_unsuitable_reason: null,
        achieved_count: 10
    },
    {
        id: '6',
        content: "Can an AI diagnose complex medical cases with higher accuracy than a board-certified specialist across multiple domains?",
        category: "Multimodal",
        vote_count: 2100,
        suitable_votes: 1900,
        unsuitable_votes: 200,
        current_weight: 3,
        is_indexed: true,
        is_achieved: false,
        dominant_unsuitable_reason: null,
        achieved_count: 800
    },
    {
        id: '7',
        content: "Can an AI agent successfully found and run a profitable dropshipping business with $100 starting capital?",
        category: "Multimodal",
        vote_count: 1500,
        suitable_votes: 600,
        unsuitable_votes: 900, // Candidate
        current_weight: 2,
        is_indexed: false,
        is_achieved: false,
        dominant_unsuitable_reason: "Too Broad",
        achieved_count: 50
    },
    {
        id: '8',
        content: "Can an AI compose a symphony that is indistinguishable from a human master's work to expert critics?",
        category: "Multimodal",
        vote_count: 950,
        suitable_votes: 850,
        unsuitable_votes: 100,
        current_weight: 1,
        is_indexed: true,
        is_achieved: true,
        dominant_unsuitable_reason: null,
        achieved_count: 700
    },
    {
        id: '9',
        content: "Can an AI perfectly replicate a specific human's voice from a 3-second sample?",
        category: "Multimodal",
        vote_count: 5,
        suitable_votes: 3,
        unsuitable_votes: 2, // Candidate (not enough votes)
        current_weight: 1,
        is_indexed: false,
        is_achieved: false,
        dominant_unsuitable_reason: null,
        achieved_count: 0
    }
]
