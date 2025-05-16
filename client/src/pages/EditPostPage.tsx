import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPostById } from "@/api/posts"
import { Post } from "@/types"
import { useToast } from "@/hooks/useToast"
import { PostForm } from "@/components/PostForm"
import { Loader2 } from "lucide-react"
import { useThemeContext } from "@/contexts/ThemeContext"

export function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { currentTheme } = useThemeContext()

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      try {
        setLoading(true)
        const response = await getPostById(id)
        const post = response.post as Omit<Post, "userId" | "createdAt"> & { userId?: string; createdAt?: string };
        setPost({
          ...post,
          userId: post.userId || "unknown",
          createdAt: post.createdAt || new Date().toISOString(),
        })
      } catch (error: any) {
        toast({
          title: `Error: ${error.message}`,
          variant: "destructive",
        })
        navigate("/my-posts")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className={`h-8 w-8 animate-spin ${currentTheme.textSecondary}`} />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="py-12 text-center">
        <h1 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>Post not found</h1>
      </div>
    )
  }

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className={`text-3xl font-bold mb-8 ${currentTheme.textPrimary}`}>Edit Post</h1>
      <PostForm post={post} isEditing />
    </div>
  )
}
