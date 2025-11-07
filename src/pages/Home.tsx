import { ArrowRight, TrendingUp, Wallet, Star, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Track Every Coin.
              <br />
              Stay Ahead.
            </h1>
            <p className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
              Your ultimate crypto companion for real-time market data, portfolio tracking, and investment insights across 100+ cryptocurrencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
              <Link to="/markets">
                <Button size="lg" className="gap-2 text-lg px-8 h-12">
                  Explore Markets
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              {user ? (
                <Link to="/portfolio">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                    Track Portfolio
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl animate-pulse delay-1000" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to monitor, analyze, and manage your cryptocurrency investments
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-glow transition-all duration-300 border-border/50">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Live Market Data</h3>
                <p className="text-muted-foreground">
                  Real-time prices, 24h changes, market cap, and volume for top 100 cryptocurrencies. Auto-refreshes every 30 seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-border/50">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Portfolio Tracking</h3>
                <p className="text-muted-foreground">
                  Track your holdings with live profit/loss calculations. Add coins with purchase price and quantity to monitor performance.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-border/50">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Watchlist</h3>
                <p className="text-muted-foreground">
                  Bookmark your favorite coins for quick access. Keep an eye on potential investments with personalized watchlists.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-border/50">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-chart-4" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Interactive Charts</h3>
                <p className="text-muted-foreground">
                  Visualize price movements with dynamic charts. Multiple timeframes: 1D, 7D, 1M, and 1Y views available.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-border/50">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Detailed Analytics</h3>
                <p className="text-muted-foreground">
                  Deep dive into coin metrics: circulating supply, max supply, volume, and market dominance for informed decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-border/50">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Profit/Loss Tracking</h3>
                <p className="text-muted-foreground">
                  Calculate gains and losses instantly. See percentage changes and absolute values for each holding in your portfolio.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-card border-y border-border">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Ready to Start Tracking?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of crypto investors making informed decisions with real-time data
            </p>
            <Link to="/markets">
              <Button size="lg" className="gap-2 text-lg px-8 h-12">
                View Live Markets
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CoinVista
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CoinVista. Real-time crypto market data powered by CoinGecko API.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
