import { Metadata } from "next"
import AuthForm from "@/app/components/auth/AuthForm"

export const metadata: Metadata = {
  title: "ログイン",
}

export default function SignInPage() {
  return <AuthForm mode="signin" />
}
