import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PrivacyPage() {
    return (
        <div className="container max-w-4xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
                    <p className="text-muted-foreground">Effective Date: November 27, 2025</p>
                </CardHeader>
                <CardContent className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <p>
                        We respect your privacy. This policy explains how we handle your data.
                    </p>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>
                                <strong>Account Data:</strong> When you sign in via Google, GitHub, or Discord, we collect your email address and nickname solely for authentication and profile display.
                            </li>
                            <li>
                                <strong>Activity Data:</strong> We record your votes and submitted questions to calculate the AGI Index.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. How We Use Your Data</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>To provide the voting service and maintain your user profile.</li>
                            <li>To prevent duplicate voting and ensure the integrity of the benchmark.</li>
                            <li><strong>We do not sell your personal data to third parties.</strong></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Data Storage & Security</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Our infrastructure is hosted on <strong>Vercel</strong> and <strong>Supabase</strong>.</li>
                            <li>Authentication is securely managed by Supabase Auth. We do not store passwords for OAuth logins.</li>
                            <li>Your data may be transferred to and processed in countries outside your residence, including the United States, where our infrastructure providers operate.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
                        <p className="text-muted-foreground">
                            We use essential cookies only for authentication purposes (to keep you logged in).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
                        <p className="text-muted-foreground">
                            We retain your account data and activity history for as long as your account is active. Aggregated, anonymized data may be retained indefinitely for research purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
                        <p className="text-muted-foreground">
                            You have the right to request the deletion of your account and personal data at any time by contacting{" "}
                            <Link href="mailto:contact@agiindex.org" className="text-primary hover:underline">
                                contact@agiindex.org
                            </Link>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
                        <p className="text-muted-foreground">
                            If you have any questions about this Privacy Policy, please contact us at{" "}
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
