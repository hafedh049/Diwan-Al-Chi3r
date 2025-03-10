"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentYear = new Date().getFullYear()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast({
        title: "البريد الإلكتروني غير صحيح",
        description: "يرجى إدخال عنوان بريد إلكتروني صالح",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Success
    toast({
      title: "تم الاشتراك بنجاح!",
      description: `سنرسل أحدث تحديثاتنا إلى ${email}`,
    })

    setEmail("")
    setIsSubmitting(false)
  }

  const handleSocialClick = (platform: string) => {
    const urls = {
      facebook: "https://facebook.com/diwanpoetry",
      twitter: "https://twitter.com/diwanpoetry",
      instagram: "https://instagram.com/diwanpoetry",
      youtube: "https://youtube.com/diwanpoetry",
    }

    // Open in new tab
    window.open(urls[platform as keyof typeof urls], "_blank")
  }

  return (
    <footer className="bg-black/80 border-t border-amber-900/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-primary mb-4"
            >
              ديوان
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-amber-100/70 mb-4"
            >
              موسوعة الشعر العربي التفاعلية، تضم آلاف القصائد من مختلف العصور الأدبية
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-amber-50/70 hover:text-primary hover:bg-primary/10 rounded-full relative overflow-hidden group"
                onClick={() => handleSocialClick("facebook")}
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 relative z-10" />
                <span className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-amber-50/70 hover:text-primary hover:bg-primary/10 rounded-full relative overflow-hidden group"
                onClick={() => handleSocialClick("twitter")}
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 relative z-10" />
                <span className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-amber-50/70 hover:text-primary hover:bg-primary/10 rounded-full relative overflow-hidden group"
                onClick={() => handleSocialClick("instagram")}
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 relative z-10" />
                <span className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-amber-50/70 hover:text-primary hover:bg-primary/10 rounded-full relative overflow-hidden group"
                onClick={() => handleSocialClick("youtube")}
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 relative z-10" />
                <span className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></span>
              </Button>
            </motion.div>
          </div>

          <div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-primary mb-4"
            >
              روابط سريعة
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              {[
                { name: "الرئيسية", path: "/" },
                { name: "القصائد", path: "/poems" },
                { name: "الشعراء", path: "/poets" },
                { name: "العصور الأدبية", path: "/eras" },
                { name: "المقالات", path: "/articles" },
              ].map((item) => (
                <li key={item.name} className="group">
                  <Link
                    href={item.path}
                    className="text-amber-100/70 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          <div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-primary mb-4"
            >
              العصور الأدبية
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              {[
                { name: "العصر الجاهلي", path: "/eras/pre-islamic" },
                { name: "العصر الإسلامي", path: "/eras/islamic" },
                { name: "العصر الأموي", path: "/eras/umayyad" },
                { name: "العصر العباسي", path: "/eras/abbasid" },
                { name: "العصر الحديث", path: "/eras/modern" },
              ].map((item) => (
                <li key={item.name} className="group">
                  <Link
                    href={item.path}
                    className="text-amber-100/70 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          <div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-primary mb-4"
            >
              النشرة البريدية
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-amber-100/70 mb-4"
            >
              اشترك في نشرتنا البريدية للحصول على آخر الإضافات والقصائد المختارة
            </motion.p>
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              viewport={{ once: true }}
              className="flex"
              onSubmit={handleSubscribe}
            >
              <div className="relative flex-1">
                <Input
                  placeholder="البريد الإلكتروني"
                  className="bg-muted/50 border-primary/30 focus:border-primary pr-10 text-right"
                  dir="rtl"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-50/50" />
              </div>
              <Button
                type="submit"
                className="bg-primary/90 hover:bg-primary text-primary-foreground mr-2 relative overflow-hidden group"
                disabled={isSubmitting}
              >
                <span className="relative z-10">{isSubmitting ? "جاري..." : "اشتراك"}</span>
                <span className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 group-disabled:scale-x-0 transition-transform duration-300"></span>
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              viewport={{ once: true }}
              className="mt-4 text-center"
            >
              <Button
                variant="link"
                className="text-amber-100/60 hover:text-primary transition-colors text-sm p-0"
                onClick={() => {
                  window.open("mailto:contact@diwan-poetry.com", "_blank")
                }}
              >
                <Mail className="h-3 w-3 mr-1" />
                contact@diwan-poetry.com
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          viewport={{ once: true }}
          className="border-t border-amber-900/20 pt-8 text-center text-amber-100/50 text-sm"
        >
          &copy; {currentYear} ديوان - جميع الحقوق محفوظة
        </motion.div>
      </div>
    </footer>
  )
}

