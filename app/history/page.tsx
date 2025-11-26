"use client"

import { HistoryChart } from "@/components/history-chart"
import { useI18n } from "@/lib/i18n-context"

export default function HistoryPage() {
    const { t } = useI18n()

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <section className="py-20 md:py-32 border-b">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tighter mb-4">
                            {t('history.title')}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {t('history.description')}
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <HistoryChart />
                    </div>
                </div>
            </section>
        </main>
    )
}
