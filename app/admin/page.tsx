'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Users, DollarSign, TrendingUp, LogOut, Crown, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [adminUser, setAdminUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    freeUsers: 0,
    proUsers: 0,
    enterpriseUsers: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const currentAdmin = localStorage.getItem('adminUser')
    if (!currentAdmin) {
      router.push('/login')
      return
    }
    
    setAdminUser(JSON.parse(currentAdmin))
    
    // Load users data
    const usersData = JSON.parse(localStorage.getItem('users') || '[]')
    setUsers(usersData)
    
    // Load payments data
    const paymentsData = JSON.parse(localStorage.getItem('payments') || '[]')
    setPayments(paymentsData)
    
    // Calculate stats
    const totalRevenue = paymentsData.reduce((sum: number, payment: any) => sum + payment.amount, 0)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyRevenue = paymentsData
      .filter((payment: any) => {
        const paymentDate = new Date(payment.date)
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
      })
      .reduce((sum: number, payment: any) => sum + payment.amount, 0)
    
    const planCounts = usersData.reduce((counts: any, user: any) => {
      const plan = user.plan || 'free'
      counts[plan] = (counts[plan] || 0) + 1
      return counts
    }, {})
    
    setStats({
      totalRevenue,
      monthlyRevenue,
      totalUsers: usersData.length,
      freeUsers: planCounts.free || 0,
      proUsers: planCounts.pro || 0,
      enterpriseUsers: planCounts.enterprise || 0
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    router.push('/')
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-blue-500 text-white'
      case 'enterprise': return 'bg-purple-500 text-white'
      case 'free':
      default: return 'bg-gray-500 text-white'
    }
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">YouTube Transcript Analyzer</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700 font-medium">{adminUser.username}</span>
                <Badge className="bg-purple-600 text-white">Admin</Badge>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Plan Distribution</p>
                  <div className="text-sm">
                    <div>Free: {stats.freeUsers}</div>
                    <div>Pro: {stats.proUsers}</div>
                    <div>Enterprise: {stats.enterpriseUsers}</div>
                  </div>
                </div>
                <Crown className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Users Management
              </CardTitle>
              <CardDescription>
                Overview of all registered users and their subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Attempts</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>
                          <Badge className={getPlanBadgeColor(user.plan || 'free')}>
                            {user.plan === 'enterprise' && <Crown className="w-3 h-3 mr-1" />}
                            {(user.plan || 'free').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.plan === 'enterprise' ? 'Unlimited' : 
                           user.plan === 'pro' ? `${user.attemptsRemaining || 0}/100` :
                           `${user.attemptsRemaining || 0}/5`}
                        </TableCell>
                        <TableCell>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Payment History
              </CardTitle>
              <CardDescription>
                Recent subscription payments and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-96">
                {payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No payments recorded yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.username}</TableCell>
                          <TableCell>
                            <Badge className={getPlanBadgeColor(payment.plan)}>
                              {payment.plan === 'enterprise' && <Crown className="w-3 h-3 mr-1" />}
                              {payment.plan.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            ₹{payment.amount}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(payment.date).toLocaleDateString()}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
