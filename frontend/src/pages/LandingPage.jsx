import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bot, Upload, MessageSquare, BarChart3, Code2, Zap, Shield, Globe,
  ArrowRight, CheckCircle2, Star, Sparkles,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/slices/userSlice';
export default function LandingPage() {
  const dispatch = useDispatch();
  const {currentUser, isPending, error} = useSelector((state)=> state.user);
  
  const navigate = useNavigate();

  const handleGetStarted = async (plan = 'starter') => {
    await dispatch(login()).unwrap();
    if (plan === 'starter') {
      navigate("/dashboard");
    } else {
      navigate("/settings?upgrade=" + plan); // Redirect to settings with plan param
    }
  };

  const features = [
    { icon: Upload, title: 'Upload Documents', description: 'Upload PDFs, DOCX, and TXT files to build your knowledge base in seconds.' },
    { icon: Bot, title: 'AI-Powered Chatbot', description: 'Automatically train an intelligent chatbot on your document library.' },
    { icon: Code2, title: 'Easy Embed', description: 'Copy a single script tag to add the chatbot to any website.' },
    { icon: BarChart3, title: 'Rich Analytics', description: 'Track conversations, top questions, and identify knowledge gaps.' },
    { icon: Shield, title: 'Secure & Private', description: 'Your documents are encrypted and processed with enterprise-grade security.' },
    { icon: Globe, title: 'Multi-Language', description: 'Support customers worldwide with automatic language detection.' },
  ];

  const steps = [
    { step: '01', title: 'Create a Chatbot', description: 'Sign up and create your first AI chatbot in under a minute.' },
    { step: '02', title: 'Upload Documents', description: 'Drag and drop your knowledge base documents — PDFs, DOCX, or TXT files.' },
    { step: '03', title: 'Test & Refine', description: 'Chat with your bot to verify accuracy and refine responses.' },
    { step: '04', title: 'Embed on Your Site', description: 'Copy the embed code and add the chatbot to your website instantly.' },
  ];

  const pricing = [
    {
      name: 'Starter',
      plan: 'starter',
      price: '₹0',
      period: '/month',
      description: 'Perfect for trying things out',
      features: ['1 Chatbot', '50 Documents', '500 Messages/mo', 'Basic Analytics'],
      highlighted: false,
      cta: 'Get Started Free',
    },
    {
      name: 'Pro',
      plan: 'pro',
      price: '₹3,999',
      period: '/month',
      description: 'For growing businesses',
      features: ['5 Chatbots', '500 Documents', '10,000 Messages/mo', 'Advanced Analytics', 'Priority Support', 'Custom Branding'],
      highlighted: true,
      cta: 'Upgrade to Pro',
    },
    {
      name: 'Enterprise',
      plan: 'enterprise',
      price: '₹14,999',
      period: '/month',
      description: 'For large organizations',
      features: ['Unlimited Chatbots', 'Unlimited Documents', 'Unlimited Messages', 'Full Analytics Suite', 'Dedicated Support', 'SSO & API Access'],
      highlighted: false,
      cta: 'Go Enterprise',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            AI-Powered Document Chatbots
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            Train AI on your documents
            <br />
            <span className="gradient-text">deploy a chatbot on your website</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10">
            Upload your knowledge base, create intelligent chatbots, and embed them on your website.
            Let AI handle customer queries 24/7 while you focus on growing your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" onClick={handleGetStarted} className="group">
              Get Started Free
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="xl" variant="outline" onClick={handleGetStarted}>
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Login with Google
            </Button>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 mx-auto max-w-4xl">
            <div className="rounded-2xl border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">DocuBot Chat Interface</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm max-w-md">
                    Hi! I'm your AI assistant. I can answer questions based on your uploaded documents. How can I help you today?
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5 text-sm max-w-md">
                    What is your return policy?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm max-w-md">
                    Based on your documentation, items can be returned within 30 days of purchase with the original receipt. Refunds are processed within 5-7 business days. Would you like more details?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to build AI chatbots</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From document upload to deployment, we handle the complexity so you can focus on your business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get started in 4 simple steps</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From sign-up to deployment in minutes, not weeks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 text-primary/20">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <Card
                key={i}
                className={`relative transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                    : 'hover:shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-4">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 text-sm text-left">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => handleGetStarted(plan.plan)}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to build your AI chatbot?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of companies using DocuBot to automate customer support and save hours every week.
          </p>
          <Button size="xl" onClick={handleGetStarted} className="group">
            Start Building for Free
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold gradient-text">DocuBot</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 DocuBot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
