import { useState } from "react";
import Header from "@/components/Header";
import CoinTable from "@/components/CoinTable";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />
      
      <main className="container py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Today's Cryptocurrency Prices
          </h1>
          <p className="text-muted-foreground">
            Track live prices, market cap, and 24h changes for the top 100 cryptocurrencies
          </p>
        </div>

        <CoinTable />
      </main>
    </div>
  );
};

export default Index;
