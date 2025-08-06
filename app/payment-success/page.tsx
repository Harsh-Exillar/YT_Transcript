'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const plan = searchParams.get('plan')
    const userId = searchParams.get('user_id')

    if (!sessionId || !plan || !userId) {
      setStatus('error')
      setMessage('Missing payment information')
      return
    }

    // Process the successful payment
    try {
      // Get current user from localStorage
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        const userData = JSON.parse(currentUser)
        
        // Update user plan
        userData.plan = plan
        userData.attemptsRemaining = plan === 'pro' ? 100 : plan === 'enterprise' ? 999 : userData.attemptsRemaining
        
        // Save updated user data
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
        const newPayment = {
          id: sessionId,
          userId: userData.id,
          username: userData.username,
          plan: plan,
          amount: plan === 'pro' ? 99 : 999,
          currency: 'INR',
          status: 'completed',
          date: new Date().toISOString(),
          stripeSessionId: sessionId
        }
        payments.push(newPayment)
        localStorage.setItem('payments', JSON.stringify(payments))
      }

      setStatus('success')
      setMessage(`Successfully upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan!`)
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (error) {
      setStatus('error')
      setMessage('Failed to process payment')
    }
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600 text-center">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          )}
          <CardTitle className={status === 'success' ? 'text-green-800' : 'text-red-800'}>
            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'success' ? (
            <>
              <p className="text-gray-600">
                You will be redirected to your dashboard in a few seconds...
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/?section=pricing">Try Again</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading</h2>
            <p className="text-gray-600 text-center">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
