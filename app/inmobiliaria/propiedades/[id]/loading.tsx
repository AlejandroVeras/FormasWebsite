import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-32" />
              <div className="h-6 w-px bg-border" />
              <div>
                <Skeleton className="h-5 w-48 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </header>

      {/* Image Gallery Skeleton */}
      <section className="py-0">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-2 h-[500px]">
            <Skeleton className="md:col-span-3 rounded-lg" />
            <div className="hidden md:flex flex-col gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="flex-1 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-6 w-20 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="w-5 h-5" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>

                <div>
                  <Skeleton className="h-6 w-32 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Skeleton */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid md:grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Skeleton className="w-5 h-5" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Skeleton */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-20 mb-4" />
                <Skeleton className="h-[300px] rounded-lg" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Contact Form Skeleton */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-12 w-full mt-4" />
              </CardContent>
            </Card>

            {/* Agent Info Skeleton */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}