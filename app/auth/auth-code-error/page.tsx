import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthErrorPage() {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-destructive">
                        Authentication Error
                    </CardTitle>
                    <CardDescription className="text-center">
                        There was a problem signing you in.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p className="text-center text-muted-foreground">
                        This could be due to an expired link, a cancelled request, or a configuration issue.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/login">Try Again</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/">Go Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
