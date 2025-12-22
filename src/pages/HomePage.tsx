import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Zap,
  Shield,
  Brain,
  ArrowRight,
  CheckCircle2,
  Building2,
  TrendingUp,
  Clock,
  Users,
  FileCheck,
  BarChart3,
  Calculator,
  Receipt,
  Sparkles,
  ChevronRight,
  Play,
  Star,
  Quote,
  Menu,
  X,
} from 'lucide-react';

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Alivee</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Como Funciona
              </a>
              <a href="#reform" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Reforma Tributária
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" className="gap-2">
                  Começar Grátis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground">
                Funcionalidades
              </a>
              <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground">
                Como Funciona
              </a>
              <a href="#reform" className="block text-sm text-muted-foreground hover:text-foreground">
                Reforma Tributária
              </a>
              <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground">
                Preços
              </a>
              <div className="pt-3 flex flex-col gap-2">
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full">Entrar</Button>
                </Link>
                <Link to="/dashboard">
                  <Button className="w-full">Começar Grátis</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,hsl(var(--accent)/0.1),transparent_70%)] blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              Potencializado por Inteligência Artificial
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Converta milhares de{' '}
              <span className="text-primary">NFS-e</span> em segundos com{' '}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                IA especializada
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              O único conversor do Brasil com modelo de IA treinado especificamente para 
              compreender todos os layouts de NFS-e brasileiras. Seu aliado estratégico 
              para a Reforma Tributária.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 px-8 h-14 text-base shadow-lg hover:shadow-xl transition-all">
                  Começar Gratuitamente
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2 px-8 h-14 text-base">
                <Play className="h-5 w-5" />
                Ver Demonstração
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: '2M+', label: 'Notas Convertidas' },
                { value: '99.7%', label: 'Precisão' },
                { value: '500+', label: 'Escritórios' },
                { value: '<3s', label: 'Por Arquivo' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Mockup */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
              <div className="bg-sidebar p-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/80" />
                  <div className="w-3 h-3 rounded-full bg-warning/80" />
                  <div className="w-3 h-3 rounded-full bg-success/80" />
                </div>
                <div className="flex-1 text-center text-sm text-muted-foreground">
                  Alivee - Painel de Conversão
                </div>
              </div>
              <div className="p-6 bg-muted/30">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { icon: FileCheck, label: 'Convertidos', value: '12.847' },
                    { icon: Clock, label: 'Em Processo', value: '234' },
                    { icon: BarChart3, label: 'Taxa Sucesso', value: '99.7%' },
                  ].map((item) => (
                    <div key={item.label} className="bg-card p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{item.value}</div>
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Processamento em lote</span>
                    <Badge className="bg-success/10 text-success border-0">Concluído</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Utilizado por escritórios de contabilidade em todo o Brasil
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {['Contabilidade ABC', 'Grupo Fiscal SP', 'ContaMax', 'FiscalPro', 'Contador Prime'].map((name) => (
              <div key={name} className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-5 w-5" />
                <span className="font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Funcionalidades</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa para{' '}
              <span className="text-primary">converter e controlar</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Uma plataforma completa para escritórios de contabilidade que gerenciam 
              múltiplas empresas e precisam de eficiência em escala.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'IA Especializada em NFS-e',
                description: 'Modelo treinado com milhões de notas fiscais brasileiras. Reconhece automaticamente qualquer layout de prefeitura.',
                highlight: true,
              },
              {
                icon: Zap,
                title: 'Conversão Ultra-Rápida',
                description: 'Processe milhares de arquivos simultaneamente. Média de 3 segundos por arquivo, mesmo em lotes massivos.',
              },
              {
                icon: Building2,
                title: 'Multi-Empresa',
                description: 'Gerencie centenas de CNPJs em um único painel. Alterne entre empresas com um clique.',
              },
              {
                icon: Shield,
                title: 'Segurança & Compliance',
                description: 'Dados criptografados, servidores no Brasil, totalmente aderente à LGPD.',
              },
              {
                icon: BarChart3,
                title: 'Dashboard de Monitoramento',
                description: 'Acompanhe em tempo real o status de cada conversão. Histórico completo de processamentos.',
              },
              {
                icon: Calculator,
                title: 'Controle de Créditos',
                description: 'Preparado para a Reforma Tributária. Gerencie e visualize créditos tributários de forma inteligente.',
                highlight: true,
              },
            ].map((feature) => (
              <Card 
                key={feature.title} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 ${
                  feature.highlight ? 'border-accent/50 bg-accent/5' : ''
                }`}
              >
                {feature.highlight && (
                  <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Destaque
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.highlight ? 'bg-accent/20' : 'bg-primary/10'
                  }`}>
                    <feature.icon className={`h-6 w-6 ${feature.highlight ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Como Funciona</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simples como <span className="text-primary">1, 2, 3</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              De PDFs desorganizados a XMLs estruturados em minutos, não horas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Faça o Upload',
                description: 'Arraste centenas ou milhares de PDFs de NFS-e. Nossa plataforma aceita uploads em massa.',
                icon: FileText,
              },
              {
                step: '02',
                title: 'IA Processa',
                description: 'Nosso modelo de IA identifica automaticamente o layout e extrai todos os dados relevantes.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Baixe os XMLs',
                description: 'Receba XMLs estruturados, prontos para importação no seu sistema contábil.',
                icon: FileCheck,
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="relative bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.1),transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-accent text-accent">
                Inteligência Artificial
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                O único conversor com{' '}
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  IA treinada para NFS-e
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nosso modelo de machine learning foi treinado com milhões de notas fiscais 
                de serviços de todas as prefeituras do Brasil. Reconhece automaticamente 
                layouts, extrai dados com precisão superior a 99% e aprende com cada nova nota.
              </p>

              <div className="space-y-4">
                {[
                  'Reconhece +5.000 layouts de prefeituras diferentes',
                  'Extração automática de CNPJ, valores, serviços e impostos',
                  'Validação cruzada de dados para máxima precisão',
                  'Aprendizado contínuo: quanto mais usa, mais preciso fica',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/dashboard" className="mt-8 inline-block">
                <Button size="lg" className="gap-2">
                  Testar a IA Agora
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold">Alivee AI</div>
                    <div className="text-xs text-muted-foreground">Processando NFS-e...</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Identificando Layout</span>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Prefeitura de São Paulo - Modelo v2.3
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Extraindo Dados</span>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div className="bg-background rounded px-2 py-1">
                        <span className="text-muted-foreground">CNPJ:</span> 12.345.678/0001-90
                      </div>
                      <div className="bg-background rounded px-2 py-1">
                        <span className="text-muted-foreground">Valor:</span> R$ 15.750,00
                      </div>
                      <div className="bg-background rounded px-2 py-1">
                        <span className="text-muted-foreground">ISS:</span> R$ 787,50
                      </div>
                      <div className="bg-background rounded px-2 py-1">
                        <span className="text-muted-foreground">Cód:</span> 01.07.13
                      </div>
                    </div>
                  </div>

                  <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">XML Gerado com Sucesso</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Reform Section */}
      <section id="reform" className="py-20 lg:py-32 bg-sidebar text-sidebar-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-sidebar-accent border-sidebar-border">
                  <CardContent className="p-6">
                    <Receipt className="h-8 w-8 text-warning mb-4" />
                    <div className="text-3xl font-bold text-sidebar-foreground mb-1">IBS</div>
                    <div className="text-sm text-sidebar-foreground/70">
                      Imposto sobre Bens e Serviços
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-sidebar-accent border-sidebar-border">
                  <CardContent className="p-6">
                    <Calculator className="h-8 w-8 text-accent mb-4" />
                    <div className="text-3xl font-bold text-sidebar-foreground mb-1">CBS</div>
                    <div className="text-sm text-sidebar-foreground/70">
                      Contribuição sobre Bens e Serviços
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-sidebar-accent border-sidebar-border col-span-2">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-sidebar-foreground/70 mb-1">
                          Créditos Tributários Identificados
                        </div>
                        <div className="text-4xl font-bold text-success">R$ 847.290</div>
                      </div>
                      <TrendingUp className="h-12 w-12 text-success/50" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-warning/20 text-warning border-warning/30">
                Reforma Tributária 2026
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-sidebar-foreground mb-6">
                Seu aliado estratégico para o{' '}
                <span className="text-warning">novo modelo tributário</span>
              </h2>
              <p className="text-lg text-sidebar-foreground/80 mb-8">
                Com a Reforma Tributária, o controle de créditos de IBS e CBS será 
                fundamental. O Alivee já está preparado para ajudar você e seus clientes 
                a maximizar a recuperação de créditos e manter a conformidade.
              </p>

              <div className="space-y-4">
                {[
                  'Extração automática de valores para cálculo de créditos',
                  'Classificação de serviços conforme nova legislação',
                  'Relatórios prontos para apuração de IBS/CBS',
                  'Integração com sistemas de escrituração fiscal',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <span className="text-sidebar-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/dashboard" className="mt-8 inline-block">
                <Button size="lg" variant="secondary" className="gap-2 bg-warning text-warning-foreground hover:bg-warning/90">
                  Preparar Meu Escritório
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Depoimentos</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              O que dizem nossos <span className="text-primary">clientes</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'Economizamos mais de 40 horas por mês que eram gastas digitando dados de NFS-e manualmente. O Alivee transformou nossa operação.',
                author: 'Maria Silva',
                role: 'Sócia, Contabilidade Silva & Associados',
                rating: 5,
              },
              {
                quote: 'A precisão da IA é impressionante. Reconhece até aqueles layouts antigos de prefeituras do interior que ninguém mais aceita.',
                author: 'João Santos',
                role: 'Gerente Fiscal, Grupo Contábil Premium',
                rating: 5,
              },
              {
                quote: 'Com a aproximação da Reforma Tributária, o Alivee se tornou essencial. Já estamos preparados para o controle de créditos.',
                author: 'Ana Costa',
                role: 'Diretora, FiscalTech Contabilidade',
                rating: 5,
              },
            ].map((testimonial) => (
              <Card key={testimonial.author} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Preços</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Planos para cada <span className="text-primary">necessidade</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Comece gratuitamente e escale conforme seu escritório cresce.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Grátis',
                description: 'Para experimentar a plataforma',
                features: [
                  '100 conversões/mês',
                  '1 empresa',
                  'Suporte por email',
                  'XMLs básicos',
                ],
                cta: 'Começar Grátis',
                popular: false,
              },
              {
                name: 'Profissional',
                price: 'R$ 197',
                period: '/mês',
                description: 'Para escritórios em crescimento',
                features: [
                  '5.000 conversões/mês',
                  'Até 50 empresas',
                  'Suporte prioritário',
                  'XMLs completos',
                  'Dashboard avançado',
                  'Relatórios de créditos',
                ],
                cta: 'Assinar Agora',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Sob consulta',
                description: 'Para grandes operações',
                features: [
                  'Conversões ilimitadas',
                  'Empresas ilimitadas',
                  'Suporte dedicado 24/7',
                  'API de integração',
                  'SLA garantido',
                  'Customizações',
                ],
                cta: 'Falar com Vendas',
                popular: false,
              },
            ].map((plan) => (
              <Card 
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-300 ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'hover:border-primary/30 hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center text-sm py-1.5 font-medium">
                    Mais Popular
                  </div>
                )}
                <CardContent className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/dashboard" className="block">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Pronto para transformar sua operação?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 500 escritórios que já economizam tempo e 
            estão preparados para a Reforma Tributária com o Alivee.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 px-8 h-14 text-base shadow-lg">
                Começar Gratuitamente
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 px-8 h-14 text-base">
              <Users className="h-5 w-5" />
              Agendar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Alivee</span>
              </div>
              <p className="text-sm text-sidebar-foreground/70 mb-4">
                Conversão inteligente de NFS-e com IA especializada para escritórios de contabilidade.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#features" className="hover:text-sidebar-foreground transition-colors">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-sidebar-foreground transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-sidebar-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-sidebar-foreground/70">
              © 2024 Alivee. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-sidebar-border text-sidebar-foreground/70">
                🇧🇷 Feito no Brasil
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
