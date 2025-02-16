"use client"

import { signOut } from "next-auth/react"
import { useState } from "react"

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: true, callbackUrl: "/auth/signin" })
    } catch (error) {
      console.error("ログアウトエラー:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-t border-white/10 mt-6 pt-6">
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? "ログアウト中..." : "ログアウト"}
      </button>
    </div>
  )
}
