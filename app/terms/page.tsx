import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function TermsPage() {
    return (
        <div className="container max-w-4xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
                    <p className="text-muted-foreground">Effective Date: November 27, 2025</p>
                </CardHeader>
                <CardContent className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <p>
                        Welcome to the AGI Index. By accessing or using our website, you agree to be bound by these terms.
                    </p>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Mission & Purpose</h2>
                        <p className="text-muted-foreground">
                            AGI Index is an open research initiative to define and track Artificial General Intelligence through collective human intelligence.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. User Contributions & Open Data License</h2>
                        <p className="text-muted-foreground mb-3">
                            To ensure this project remains a public good for humanity:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>
                                <strong>License:</strong> By submitting questions, voting, or contributing content, you agree that your contributions are licensed under the{" "}
                                <Link href="https://creativecommons.org/licenses/by/4.0/" target="_blank" className="text-primary hover:underline">
                                    Creative Commons Attribution 4.0 International License (CC BY 4.0)
                                </Link>.
                            </li>
                            <li>
                                <strong>Public Access:</strong> You acknowledge that your contributions (excluding personal identifiers) will be made publicly available via our API and GitHub repositories for research purposes.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Code of Conduct</h2>
                        <p className="text-muted-foreground">
                            We value rigorous debate but demand respect. We reserve the right to remove content or ban users who post spam, hate speech, or irrelevant content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Service Availability</h2>
                        <p className="text-muted-foreground">
                            We strive to maintain continuous service but do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Disclaimer</h2>
                        <p className="text-muted-foreground">
                            The AGI Index is a crowd-sourced benchmark. We provide the data &quot;as is&quot; without warranties of any kind regarding its accuracy or reliability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Contact</h2>
                        <p className="text-muted-foreground">
                            For any questions, please contact us at{" "}
                            <Link href="mailto:contact@agiindex.org" className="text-primary hover:underline">
                                contact@agiindex.org
                            </Link>.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}
