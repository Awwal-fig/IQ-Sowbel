import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useBranding } from '../../contexts/BrandingContext';

export function AdminLogin() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock authentication - in production, this would call an API
    setTimeout(() => {
      if (email === 'admin@iqsowbel.com' && password === 'admin123') {
        localStorage.setItem('adminAuth', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <img
              src={branding.logoUrl}
              alt={branding.companyName}
              className="h-16 w-auto object-contain mix-blend-multiply"
              style={{ filter: 'brightness(1.1) contrast(1.1)' }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to manage bookings and vehicles
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@iqsowbel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>Default admin credentials:</p>
              <p className="font-mono mt-1">
                admin@iqsowbel.com / admin123
              </p>
              <p className="mt-2 text-destructive">
                ⚠️ Change default password in Settings after first login
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
