'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Crown, ArrowRight } from 'lucide-react'
import Link from "next/link"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const plan = searchParams.get('plan')
    
    if (sessionId && plan) {
      // Process the payment
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        const userData = JSON.parse(currentUser)
        
        // Update user plan
        userData.plan = plan
        userData.attemptsRemaining = plan === 'pro' ? 100 : plan === 'enterprise' ? 999 : userData.attemptsRemaining
        userData.subscriptionDate = new Date().toISOString()
        
        localStorage.setItem('currentUser', JSON.stringify(userData))
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex((u: any) => u.id === userData.id)
        if (userIndex !== -1) {
          users[userIndex] = userData
          localStorage.setItem('users', JSON.stringify(users))
        }
        
        // Save payment record for admin
        const payments = JSON.parse(localStorage.getItem('payments') || '[]')
        const paymentRecord = {
          id: Date.now().toString(),
          userId: userData.id,
          username: userData.username,
          plan: plan,
          amount: plan === 'pro' ? 99 : 999,
          currency: 'INR',
          sessionId: sessionId,
          date: new Date().toISOString(),
          status: 'completed'
        }
        payments.push(paymentRecord)
        localStorage.setItem('payments', JSON.stringify(payments))
        
        setPaymentData({
          plan: plan,
          amount: plan === 'pro' ? 99 : 999,
          username: userData.username
        })
      }
    }
    
    setIsProcessing(false)
  }, [searchParams])

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Payment Successful!</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Welcome to {paymentData?.plan === 'pro' ? 'Pro' : 'Enterprise'} Plan
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {paymentData && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-800">
                    {paymentData.plan.charAt(0).toUpperCase() + paymentData.plan.slice(1)} Plan Activated
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Amount: ₹{paymentData.amount} • User: {paymentData.username}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <p className="text-gray-700">
                Your subscription has been activated successfully. You now have access to:
              </p>
              <ul className="text-left space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {paymentData?.plan === 'pro' ? '100 daily attempts' : 'Unlimited attempts'}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  AI-powered transcript analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Advanced chat features
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Collection management
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
              Back to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
