"use client"

import { Trans } from "@/components/ui/trans"
import { useI18n } from "@/lib/i18n-context"
import { Info, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ManifestoPage() {
    const { t } = useI18n()

    return (
        <div className="container py-16 max-w-4xl">
            <div className="space-y-12">
                {/* Manifesto Section */}
                <section className="space-y-6">
                    <h1 className="text-4xl font-bold tracking-tight">{t('manifesto.title')}</h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            <Trans
                                i18nKey="manifesto.p1"
                                components={{ strong: <strong /> }}
                            />
                        </p>

                        <blockquote className="border-l-4 border-primary pl-6 italic text-lg">
                            {t('manifesto.quote')}
                            <footer className="text-sm mt-2">{t('manifesto.quote_author')}</footer>
                        </blockquote>

                        <p className="leading-relaxed">
                            <Trans
                                i18nKey="manifesto.p2"
                                components={{ strong: <strong /> }}
                            />
                        </p>

                        <p className="leading-relaxed">
                            <Trans
                                i18nKey="manifesto.p3"
                                components={{ strong: <strong /> }}
                            />
                        </p>

                        <p className="leading-relaxed">
                            <Trans
                                i18nKey="manifesto.p4"
                                components={{ strong: <strong /> }}
                            />
                        </p>

                        <ul className="space-y-2 list-disc list-inside">
                            <li>{t('manifesto.list.item1')}</li>
                            <li>{t('manifesto.list.item2')}</li>
                            <li>{t('manifesto.list.item3')}</li>
                        </ul>

                        <p className="leading-relaxed">
                            <Trans
                                i18nKey="manifesto.p5"
                                components={{ strong: <strong /> }}
                            />
                        </p>

                        <p className="text-xl font-semibold text-primary">
                            {t('manifesto.closing')}
                        </p>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="space-y-6 pt-8 border-t">
                    <h2 className="text-3xl font-bold tracking-tight">{t('manifesto.how_it_works.title')}</h2>

                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                    1
                                </div>
                                <h3 className="text-xl font-semibold">{t('manifesto.how_it_works.step1.title')}</h3>
                            </div>
                            <p className="text-muted-foreground ml-13">
                                {t('manifesto.how_it_works.step1.desc')}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                    2
                                </div>
                                <h3 className="text-xl font-semibold">{t('manifesto.how_it_works.step2.title')}</h3>
                            </div>
                            <p className="text-muted-foreground ml-13">
                                {t('manifesto.how_it_works.step2.desc')}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                    3
                                </div>
                                <h3 className="text-xl font-semibold">{t('manifesto.how_it_works.step3.title')}</h3>
                            </div>
                            <p className="text-muted-foreground ml-13">
                                {t('manifesto.how_it_works.step3.desc')}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                    4
                                </div>
                                <h3 className="text-xl font-semibold">{t('manifesto.how_it_works.step4.title')}</h3>
                            </div>
                            <p className="text-muted-foreground ml-13">
                                {t('manifesto.how_it_works.step4.desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call for Coalition */}
                <section className="pt-8 border-t">
                    <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight">{t('manifesto.coalition.title')}</h2>
                                <div className="space-y-3 text-muted-foreground">
                                    <p>{t('manifesto.coalition.p1')}</p>
                                    <p>{t('manifesto.coalition.p2')}</p>
                                </div>
                                <p className="font-semibold text-foreground italic">
                                    {t('manifesto.coalition.closing')}
                                </p>
                                <Button asChild className="mt-2">
                                    <Link href="mailto:partner@agiindex.org">
                                        {t('manifesto.coalition.cta')}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transparency Note */}
                <section className="pt-8 border-t">
                    <div className="flex gap-4 p-6 rounded-lg bg-muted/50 border">
                        <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h3 className="font-semibold text-sm">{t('manifesto.transparency.title')}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {t('manifesto.transparency.content')}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
