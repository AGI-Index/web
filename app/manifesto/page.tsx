export default function ManifestoPage() {
    return (
        <div className="container py-16 max-w-4xl">
            <div className="space-y-12">
                {/* Manifesto Section */}
                <section className="space-y-6">
                    <h1 className="text-4xl font-bold tracking-tight">The Manifesto: A Mirror to Ourselves</h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            <strong>"What is AGI?"</strong> It is perhaps the most complex question humanity has ever asked.
                            But paradoxically, asking it forces us to answer a much deeper question: <strong>"What does it mean to be human?"</strong>
                        </p>

                        <blockquote className="border-l-4 border-primary pl-6 italic text-lg">
                            "If I had an hour to solve a problem, I'd spend 55 minutes thinking about the problem and 5 minutes solving it."
                            <footer className="text-sm mt-2">— Albert Einstein</footer>
                        </blockquote>

                        <p className="leading-relaxed">
                            For decades, computer scientists have raced through the final <strong>5 minutes</strong>, building faster chips and larger models.
                            They treat intelligence as a computational problem to be solved.
                        </p>

                        <p className="leading-relaxed">
                            <strong>But intelligence is not just code.</strong> It is the intuition of a mother understanding her crying child.
                            It is the wit of a writer crafting a metaphor. It is the hesitation we feel before making a difficult choice.
                        </p>

                        <p className="leading-relaxed">
                            <strong>This is why the definition of AGI cannot be left solely to engineers in a lab.</strong> If AGI is to mirror human intelligence,
                            the reflection must come from all of humanity, not just a select few.
                        </p>

                        <ul className="space-y-2 list-disc list-inside">
                            <li>You don't need a PhD to participate here.</li>
                            <li>You don't need to know how to code.</li>
                            <li>You only need your experience as a living, thinking human being.</li>
                        </ul>

                        <p className="leading-relaxed">
                            <strong>The AGI INDEX is where we reclaim our "55 minutes."</strong> It is a place for the artist, the teacher, the parent,
                            and the philosopher to stand alongside the engineer. Together, we are not just measuring a machine; we are mapping the boundaries
                            of our own humanity.
                        </p>

                        <p className="text-xl font-semibold text-primary">
                            Come, let's define ourselves.
                        </p>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="space-y-6 pt-8 border-t">
                    <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>

                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                    1
                                </div>
                                <h3 className="text-xl font-semibold">Community Questions</h3>
                            </div>
                            <p className="text-muted-foreground ml-13">
                                Anyone can suggest questions that test whether AI has achieved human-level intelligence in specific areas.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                    2
                                </div>
                                <h3 className="text-xl font-semibold">Collective Voting</h3>
                            </div>
                            <p className="text-muted-foreground ml-13">
                                The community votes on whether questions are suitable milestones and whether current AI has achieved them.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                    3
                                </div>
                                <h3 className="text-xl font-semibold">Index Formation</h3>
                            </div>
                            <p className="text-muted-foreground ml-13">
                                Questions with strong consensus become part of the AGI Index, creating a living benchmark of progress.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                    4
                                </div>
                                <h3 className="text-xl font-semibold">Track Progress</h3>
                            </div>
                            <p className="text-muted-foreground ml-13">
                                Watch as AI capabilities evolve and see how close we are to achieving true artificial general intelligence.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
