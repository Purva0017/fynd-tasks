import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { Sun, Moon } from 'lucide-react';
import { adminApi } from '../api/adminApi';

export function AdminLogin() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast.error({
        title: 'Error',
        description: 'Please enter the admin token',
      });
      return;
    }

    setIsLoading(true);
    
    // Temporarily store token to test it
    sessionStorage.setItem('adminToken', token.trim());
    
    try {
      // Validate token by making an API call
      await adminApi.getAnalytics();
      
      toast.success({
        title: 'Login Successful',
        description: 'Welcome to the admin dashboard',
      });
      
      navigate('/admin');
    } catch (error) {
      // Remove invalid token
      sessionStorage.removeItem('adminToken');
      
      if (error.response?.status === 401) {
        toast.error({
          title: 'Unauthorized',
          description: 'Invalid admin token. Please try again.',
        });
      } else {
        toast.error({
          title: 'Error',
          description: error.friendlyMessage || 'Failed to verify token. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple header */}
      <header className="w-full border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-foreground">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span>AI Feedback</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your admin token to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Admin Token
                </label>
                <Input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your admin token"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  'Logging in...'
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
