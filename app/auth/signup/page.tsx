import { Metadata } from "next"
import AuthForm from "@/app/components/auth/AuthForm"

export const metadata: Metadata = {
  title: "新規登録",
}

export default function SignUpPage() {
  return <AuthForm mode="signup" />
}
