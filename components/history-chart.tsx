'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Database } from '@/types/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from '@/lib/i18n-context';

type DailyMetric = Database['public']['Tables']['daily_metrics']['Row'];

export function HistoryChart() {
    const { t } = useI18n();
    const [data, setData] = useState<DailyMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [minVotes, setMinVotes] = useState(0); // Default filter threshold

    useEffect(() => {
        async function fetchData() {
            const { data: metrics, error } = await supabase
                .from('daily_metrics')
                .select('*')
                .order('date', { ascending: true });

            if (error) {
                console.error('Error fetching history:', error);
            } else {
                setData(metrics || []);
            }
            setLoading(false);
        }

        fetchData();
    }, []);

    const filteredData = data.filter((item) => (item.total_votes || 0) >= minVotes);

    const downloadCSV = () => {
        const headers = [
            'Date',
            'Overall Rate', 'Linguistic Rate', 'Multimodal Rate',
            'Total Votes', 'Total Users', 'Index Questions', 'Candidate Questions'
        ];
        const csvContent = [
            headers.join(','),
            ...filteredData.map((row) =>
                [
                    row.date,
                    row.overall_rate,
                    row.linguistic_rate,
                    row.multimodal_rate,
                    row.total_votes,
                    row.total_users,
                    row.index_question_count,
                    row.candidate_question_count
                ].join(',')
            ),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `agi_history_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>({
        overall_rate: true,
        linguistic_rate: true,
        multimodal_rate: true,
        total_votes: true,
        total_users: true,
        index_question_count: true,
        candidate_question_count: true,
    });

    const handleLegendClick = (e: any) => {
        const { dataKey } = e;
        setVisibleLines((prev) => ({
            ...prev,
            [dataKey]: !prev[dataKey],
        }));
    };

    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry: any, index: number) => (
                    <div
                        key={`item-${index}`}
                        className="flex items-center cursor-pointer"
                        onClick={() => handleLegendClick(entry)}
                    >
                        <div
                            className="w-3 h-3 mr-2 rounded-full"
                            style={{
                                backgroundColor: entry.color,
                                opacity: visibleLines[entry.dataKey] ? 1 : 0.3,
                            }}
                        />
                        <span
                            className="text-sm"
                            style={{
                                opacity: visibleLines[entry.dataKey] ? 1 : 0.5,
                                textDecoration: visibleLines[entry.dataKey] ? 'none' : 'line-through',
                            }}
                        >
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return <div className="h-[400px] w-full animate-pulse bg-muted/20 rounded-xl" />;
    }

    if (filteredData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('history.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        {t('history.no_data')} ({t('history.min_votes_required').replace('{votes}', String(minVotes))})
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('history.title')}</CardTitle>
                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground hidden md:block">
                        {t('history.min_votes')}:
                        <input
                            type="number"
                            value={minVotes}
                            onChange={(e) => setMinVotes(Number(e.target.value))}
                            className="ml-2 w-16 rounded border bg-background px-2 py-1"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={downloadCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="progress" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="progress">{t('history.tabs.progress')}</TabsTrigger>
                        <TabsTrigger value="community">{t('history.tabs.community')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="progress">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={filteredData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}%`}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        formatter={(value: number) => [`${value}%`, '']}
                                    />
                                    <Legend content={renderLegend} />
                                    <Line
                                        type="monotone"
                                        dataKey="overall_rate"
                                        name={t('history.chart.overall')}
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        hide={!visibleLines.overall_rate}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="linguistic_rate"
                                        name={t('history.chart.linguistic')}
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        hide={!visibleLines.linguistic_rate}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="multimodal_rate"
                                        name={t('history.chart.multimodal')}
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        hide={!visibleLines.multimodal_rate}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>

                    <TabsContent value="community">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={filteredData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Legend content={renderLegend} />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="total_votes"
                                        name={t('history.chart.total_votes')}
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        hide={!visibleLines.total_votes}
                                    />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="total_users"
                                        name={t('history.chart.total_users')}
                                        stroke="#ec4899"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        hide={!visibleLines.total_users}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="index_question_count"
                                        name={t('history.chart.index_questions')}
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        hide={!visibleLines.index_question_count}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="candidate_question_count"
                                        name={t('history.chart.candidate_questions')}
                                        stroke="#64748b"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        hide={!visibleLines.candidate_question_count}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
