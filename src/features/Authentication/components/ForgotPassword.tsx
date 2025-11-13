import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Modal from "@/common/component/Modal"
import { MailCheck } from "lucide-react"
import authService from "../service/auth.service"

export default function ForgotPasswordCard() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<{ email: string }>()

    const [formSubmitted, setFormSubmitted] = useState(false)
    const onSubmit = async (data: {email: string }) => {
        await authService.forgotPassword(data.email)
        setFormSubmitted(true)
    }

    const FormComponent = () => {
        return (
            <>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center mb-3 text-slate-700">
                        Forgot Password?
                    </CardTitle>
                    <CardDescription className="text-center text-gray-500">
                        Enter your email address below and we’ll send you a reset link.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="mb-5">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="email" className="text-gray-700">
                                Email address
                            </Label>

                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Please enter a valid email address",
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...field}
                                        className={`p-5 border ${errors.email ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                )}
                            />

                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full p-5 bg-slate-800 text-white hover:bg-slate-900 transition-colors"
                        >
                            {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </Button>

                        <p className="text-sm text-center text-gray-500">
                            Remembered your password?{" "}
                            <a href="/login" className="text-indigo-600 hover:underline">
                                Login
                            </a>
                        </p>
                    </CardFooter>
                </form>
            </>
        )
    }
    const SuccessComponent = () => {
        return (
            <div className="flex flex-col items-center">
                <MailCheck className="w-14 h-14 text-slate-800 mb-2" />
                <span>Mail sent successfully!</span>
            </div>
        )
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-4">
            <Card className="w-[400px] shadow-lg rounded-2xl border border-indigo-100 p-6">
                {
                    !formSubmitted ? <FormComponent /> : <SuccessComponent />
                }
            </Card>
        </div>

    )
}

