import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Textarea } from '../../components/ui/textarea';
import { useBranding } from '../../contexts/BrandingContext';
import { Upload, Palette, Info, ImageIcon, X } from 'lucide-react';
import { cn } from '../../components/ui/utils';

export function AdminSettings() {
  const { branding, updateBranding, resetBranding } = useBranding();
  const [saved, setSaved] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [companyName, setCompanyName] = useState(branding.companyName);
  const [companyEmail, setCompanyEmail] = useState(branding.companyEmail);
  const [companyPhone, setCompanyPhone] = useState(branding.companyPhone);
  const [basePrice, setBasePrice] = useState(branding.basePrice);
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl);
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(branding.secondaryColor);
  const [accentColor, setAccentColor] = useState(branding.accentColor);
  const [parkName, setParkName] = useState(branding.parkName);
  const [parkAddress, setParkAddress] = useState(branding.parkAddress);
  const [parkLandmarks, setParkLandmarks] = useState(branding.parkLandmarks);
  const [parkOpeningTime, setParkOpeningTime] = useState(branding.parkOpeningTime);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setLogoUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (PNG, JPG, SVG)');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSaveCompanyInfo = () => {
    updateBranding({
      companyName,
      companyEmail,
      companyPhone,
      parkName,
      parkAddress,
      parkLandmarks,
      parkOpeningTime,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveBranding = () => {
    updateBranding({
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSavePricing = () => {
    updateBranding({
      basePrice: Number(basePrice),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetBranding = () => {
    if (confirm('Are you sure you want to reset all branding to default? This cannot be undone.')) {
      resetBranding();
      // Reload values
      setCompanyName(branding.companyName);
      setCompanyEmail(branding.companyEmail);
      setCompanyPhone(branding.companyPhone);
      setBasePrice(branding.basePrice);
      setLogoUrl(branding.logoUrl);
      setPrimaryColor(branding.primaryColor);
      setSecondaryColor(branding.secondaryColor);
      setAccentColor(branding.accentColor);
      setParkName(branding.parkName);
      setParkAddress(branding.parkAddress);
      setParkLandmarks(branding.parkLandmarks);
      setParkOpeningTime(branding.parkOpeningTime);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and branding</p>
      </div>

      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="company">Company & Park</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Website Branding</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Customize your website's appearance and branding
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Company Logo</Label>

                {/* Drag and Drop Zone */}
                <div
                  className={cn(
                    'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">
                        Drop your logo here, or <span className="text-primary">browse</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports PNG, JPG, SVG (Max 2MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* URL Input (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="logoUrl" className="text-xs text-muted-foreground">
                    Or enter logo URL
                  </Label>
                  <Input
                    id="logoUrl"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/src/imports/image.png or https://..."
                    className="text-sm"
                  />
                </div>

                {/* Logo Preview */}
                {logoUrl && (
                  <div className="mt-4 p-4 border border-border rounded-lg bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Preview:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoUrl('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="h-16 w-auto object-contain mix-blend-multiply"
                      style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                      onError={(e) => {
                        e.currentTarget.src = branding.logoUrl;
                      }}
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Brand Colors */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Brand Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          placeholder="#3b4a8c"
                        />
                      </div>
                      <div
                        className="h-8 rounded border"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary/Coral Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          placeholder="#e8725c"
                        />
                      </div>
                      <div
                        className="h-8 rounded border"
                        style={{ backgroundColor: secondaryColor }}
                      ></div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accentColor"
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          placeholder="#e8eaf2"
                        />
                      </div>
                      <div
                        className="h-8 rounded border"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Changes will apply immediately across the entire website including the public site.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveBranding}>Save Branding</Button>
                <Button variant="outline" onClick={handleResetBranding}>
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Company Information</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Basic company details and contact information
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone</Label>
                <Input
                  id="companyPhone"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Main Terminal / Park Details</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Configure your main terminal information for passenger boarding
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="parkName">Terminal Name</Label>
                <Input
                  id="parkName"
                  value={parkName}
                  onChange={(e) => setParkName(e.target.value)}
                  placeholder="IQ Sowbel Main Terminal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parkAddress">Terminal Address</Label>
                <Textarea
                  id="parkAddress"
                  value={parkAddress}
                  onChange={(e) => setParkAddress(e.target.value)}
                  placeholder="Plot 45, Ahmadu Bello Way, Central Business District, Abuja"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parkLandmarks">Landmarks / Directions</Label>
                <Textarea
                  id="parkLandmarks"
                  value={parkLandmarks}
                  onChange={(e) => setParkLandmarks(e.target.value)}
                  placeholder="Opposite Central Bank of Nigeria Headquarters"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Notable landmarks to help passengers find the terminal
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parkOpeningTime">Opening Time</Label>
                <Input
                  id="parkOpeningTime"
                  value={parkOpeningTime}
                  onChange={(e) => setParkOpeningTime(e.target.value)}
                  placeholder="5:00 AM"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveCompanyInfo} size="lg">
            Save Company & Terminal Information
          </Button>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Pricing</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price per Seat</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">₦</span>
                  <Input
                    id="basePrice"
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={handleSavePricing}>Update Pricing</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Account Settings</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
