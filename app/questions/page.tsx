"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
import { QuestionCard } from "@/components/feature/question-card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { QuestionListSkeleton } from "@/components/ui/loading-skeletons"

type SortOption = 'newest' | 'oldest' | 'most-voted' | 'least-voted'

export default function QuestionsPage() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [activeTab, setActiveTab] = useState("index")
    const [sortBy, setSortBy] = useState<SortOption>("newest")
    const [showOnlyUnvoted, setShowOnlyUnvoted] = useState(false)
    const [questions, setQuestions] = useState<any[]>([])
    const [userVotes, setUserVotes] = useState<Set<number>>(new Set())
    const [loading, setLoading] = useState(true)

    // Fetch user's votes
    useEffect(() => {
        async function fetchUserVotes() {
            if (!user) {
                setUserVotes(new Set())
                return
            }

            const { data } = await supabase
                .from('votes')
                .select('question_id')
                .eq('user_id', user.id)

            if (data) {
                setUserVotes(new Set(data.map(v => v.question_id)))
            }
        }

        fetchUserVotes()
    }, [user])

    useEffect(() => {
        async function fetchQuestions() {
            setLoading(true)

            // Determine sort column and order based on sortBy
            let orderColumn = 'created_at'
            let ascending = false

            switch (sortBy) {
                case 'newest':
                    orderColumn = 'created_at'
                    ascending = false
                    break
                case 'oldest':
                    orderColumn = 'created_at'
                    ascending = true
                    break
                case 'most-voted':
                    orderColumn = 'vote_count'
                    ascending = false
                    break
                case 'least-voted':
                    orderColumn = 'vote_count'
                    ascending = true
                    break
            }

            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .order(orderColumn, { ascending })

            if (!error && data) {
                setQuestions(data)
            }
            setLoading(false)
        }

        fetchQuestions()
    }, [sortBy])

    const filteredQuestions = questions.filter(q => {
        const matchesTab = activeTab === "index" ? q.is_indexed : !q.is_indexed
        const matchesCategory = selectedCategory === "all" || q.category.toLowerCase() === selectedCategory.toLowerCase()
        const matchesSearch = q.content.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesVoteFilter = !showOnlyUnvoted || !userVotes.has(q.id)
        return matchesTab && matchesCategory && matchesSearch && matchesVoteFilter
    })

    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Questions Index</h1>
                    <p className="text-muted-foreground">Browse and vote on AGI milestones.</p>
                </div>
                <Button asChild>
                    <Link href="/suggest">
                        <Plus className="mr-2 h-4 w-4" /> Suggest Question
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="index" className="w-full" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                        <TabsTrigger value="index">Index Questions</TabsTrigger>
                        <TabsTrigger value="candidate">Candidate Questions</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full md:w-auto flex-wrap items-center">
                        {/* Unvoted Filter Toggle */}
                        {user && (
                            <label className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 h-10 text-sm hover:bg-secondary/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={showOnlyUnvoted}
                                    onChange={(e) => setShowOnlyUnvoted(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <span className="whitespace-nowrap">Show only unvoted</span>
                            </label>
                        )}

                        {/* Sort Dropdown */}
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="most-voted">Most Voted</option>
                            <option value="least-voted">Least Voted</option>
                        </select>

                        {/* Category Dropdown */}
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="linguistic">Linguistic</option>
                            <option value="multimodal">Multimodal</option>
                        </select>

                        {/* Search Input */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search questions..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <TabsContent value="index" className="mt-0">
                    {loading ? (
                        <QuestionListSkeleton />
                    ) : filteredQuestions.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredQuestions.map((q) => (
                                <QuestionCard key={q.id} question={q} />
                            ))}
                        </div>
                    ) : (
                        <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                            No index questions found matching your criteria.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="candidate" className="mt-0">
                    {loading ? (
                        <QuestionListSkeleton />
                    ) : filteredQuestions.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredQuestions.map((q) => (
                                <QuestionCard key={q.id} question={q} />
                            ))}
                        </div>
                    ) : (
                        <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                            No candidate questions found matching your criteria.
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
