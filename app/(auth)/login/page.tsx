"use client"

import { signIn } from "next-auth/react"
import { motion } from "framer-motion"

export default function LoginPage() {

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">

      <div className="bg-white p-10 rounded-2xl shadow-lg border w-[380px] text-center">

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          KIIT Student Login
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Continue with your KIIT Google account
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => signIn("google")}
          className="
          w-full
          bg-black
          text-white
          py-3
          rounded-xl
          font-medium
          shadow-md
          transition
          hover:bg-gray-900
          cursor-pointer
          flex
          items-center
          justify-center
          gap-3
          "
        >

          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />

          Login with KIIT Google

        </motion.button>

      </div>

    </div>
  )
}