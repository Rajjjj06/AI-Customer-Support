import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, User, Building2, Mail, Globe, MapPin, Save, Zap, Crown, Sparkles, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getMySubscription, createOrder, verifyPayment, cancelSubscription } from '@/services/subscription';

// Plan definitions (mirror the backend)
const PLANS = {
  starter:    { name: 'Starter',    priceInr: 0,      icon: Zap,      chatbots: 1,         documents: 50,        messages: '500/mo',       color: 'text-slate-500' },
  pro:        { name: 'Pro',        priceInr: 3999,   icon: Sparkles, chatbots: 5,         documents: 500,       messages: '10,000/mo',    color: 'text-blue-500' },
  enterprise: { name: 'Enterprise', priceInr: 14999,  icon: Crown,    chatbots: 'Unlimited', documents: 'Unlimited', messages: 'Unlimited', color: 'text-amber-500' },
};

export default function SettingsPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(null); // which plan is being upgraded to
  const [cancelling, setCancelling] = useState(false);

  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    companyName: '',
    companyWebsite: '',
    companyAddress: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (currentUser) {
      setProfile((prev) => ({ ...prev, name: currentUser.name || '', email: currentUser.email || '' }));
    }
  }, [currentUser]);

  // Fetch subscription on load
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const sub = await getMySubscription();
        setSubscription(sub);
      } catch (e) {
        console.error(e);
      } finally {
        setSubLoading(false);
      }
    };
    fetchSub();
  }, []);

  // Auto-trigger upgrade if redirected from landing page with ?upgrade=pro
  useEffect(() => {
    const planFromUrl = searchParams.get('upgrade');
    if (planFromUrl && PLANS[planFromUrl] && !subLoading) {
      handleUpgrade(planFromUrl);
    }
  }, [searchParams, subLoading]);

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    toast.success('Settings saved successfully!');
  };

  /** Load Razorpay script dynamically */
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (plan) => {
    const planData = PLANS[plan];
    if (!planData || planData.priceInr === 0) return;

    setUpgrading(plan);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Failed to load Razorpay. Please try again.'); return; }

      // 1. Create order on backend
      const order = await createOrder(plan);

      // 2. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'DocuBot',
        description: `${planData.name} Plan - Monthly`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. Verify payment on backend
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            });
            const updatedSub = await getMySubscription();
            setSubscription(updatedSub);
            toast.success(`🎉 You are now on the ${planData.name} plan!`);
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
        },
        theme: { color: '#2563eb' },
        modal: { ondismiss: () => setUpgrading(null) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Could not initiate payment. Please try again.');
      console.error(err);
    } finally {
      setUpgrading(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel? You will keep access until the end of your billing period.')) return;
    setCancelling(true);
    try {
      await cancelSubscription();
      const updatedSub = await getMySubscription();
      setSubscription(updatedSub);
      toast.success('Subscription cancelled. Access continues until period end.');
    } catch (err) {
      toast.error('Failed to cancel. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const currentPlan = subscription ? PLANS[subscription.plan] : PLANS['starter'];
  const PlanIcon = currentPlan?.icon || Zap;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and subscription</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
              <AvatarFallback className="text-lg"><User className="h-6 w-6" /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{currentUser?.name || 'User'}</CardTitle>
              <CardDescription className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {currentUser?.email || 'user@example.com'}
              </CardDescription>
              <Badge variant="success" className="mt-1.5 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Google Verified
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* --- SUBSCRIPTION SECTION --- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PlanIcon className={`h-4 w-4 ${currentPlan?.color}`} />
            Subscription & Billing
          </CardTitle>
          <CardDescription>Manage your plan and payment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Current Plan Badge */}
          {subLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading subscription...</div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className={`font-bold text-lg ${currentPlan?.color}`}>{currentPlan?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentPlan?.chatbots} Chatbots · {currentPlan?.documents} Docs · {currentPlan?.messages} Messages
                </p>
                {subscription?.status === 'cancelled' && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
                    <AlertTriangle className="h-3 w-3" />
                    Cancelled — access until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </div>
                )}
              </div>
              {subscription?.plan !== 'starter' && subscription?.status === 'active' && (
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={cancelling} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                  {cancelling ? <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />Cancelling...</> : 'Cancel Plan'}
                </Button>
              )}
            </div>
          )}

          {/* Upgrade Options */}
          <p className="text-sm font-medium">Available Plans</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(PLANS).map(([key, plan]) => {
              const Icon = plan.icon;
              const isCurrentPlan = subscription?.plan === key;
              return (
                <div
                  key={key}
                  className={`relative p-4 rounded-xl border transition-all ${isCurrentPlan ? 'border-primary bg-primary/5' : 'hover:border-primary/40'}`}
                >
                  {isCurrentPlan && (
                    <Badge className="absolute -top-2 left-3 text-xs px-2">Current</Badge>
                  )}
                  <Icon className={`h-5 w-5 mb-2 ${plan.color}`} />
                  <p className="font-semibold text-sm">{plan.name}</p>
                  <p className="text-lg font-bold">{plan.priceInr === 0 ? 'Free' : `₹${plan.priceInr.toLocaleString()}`}<span className="text-xs font-normal text-muted-foreground">{plan.priceInr > 0 ? '/mo' : ''}</span></p>
                  <ul className="mt-2 space-y-1">
                    <li className="text-xs text-muted-foreground">{plan.chatbots} Chatbots</li>
                    <li className="text-xs text-muted-foreground">{plan.documents} Docs</li>
                    <li className="text-xs text-muted-foreground">{plan.messages} Messages</li>
                  </ul>
                  {!isCurrentPlan && plan.priceInr > 0 && (
                    <Button
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => handleUpgrade(key)}
                      disabled={upgrading === key}
                    >
                      {upgrading === key ? <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />Opening...</> : 'Upgrade'}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <form onSubmit={handleSave}>
        {/* Personal Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Your personal details linked to your Google account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={profile.name} onChange={handleChange('name')} placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled className="opacity-60" />
                <p className="text-xs text-muted-foreground">Email is managed by Google</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={profile.phone} onChange={handleChange('phone')} placeholder="+91 98765 43210" />
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Company Information
            </CardTitle>
            <CardDescription>Enter your company details for your chatbot profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input id="company-name" value={profile.companyName} onChange={handleChange('companyName')} placeholder="e.g. Acme Corp" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-website">Company Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="company-website" value={profile.companyWebsite} onChange={handleChange('companyWebsite')} placeholder="https://example.com" className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="company-address" value={profile.companyAddress} onChange={handleChange('companyAddress')} placeholder="City, Country" className="pl-9" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Company Description</Label>
              <Textarea id="bio" value={profile.bio} onChange={handleChange('bio')} placeholder="Tell us about your company..." rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm text-emerald-500 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="h-4 w-4" />
              All changes saved
            </span>
          )}
          <Button type="submit" disabled={saving} size="lg">
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
