import { useState, useEffect } from "react"
import { getUserAdverts } from "@/api/adverts"
import { getSubscriptionHistory } from "@/api/subscriptions"
import { Advert } from "@/types"
import { useToast } from "@/hooks/useToast"
import { Link } from "react-router-dom"
import { AdvertCard } from "@/components/AdvertCard"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2, Crown } from "lucide-react"
import { useThemeContext } from "@/contexts/ThemeContext"
import { useTheme } from "@/components/ui/theme-provider"
import { Card, CardContent } from "@/components/ui/card"

export function MyAdvertsPage() {
  const [adverts, setAdverts] = useState<Advert[]>([])
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const { toast } = useToast()
  const { currentTheme } = useTheme...

Something went wrong, please refresh to reconnect or try again.
