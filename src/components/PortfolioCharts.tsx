import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, PieChart as PieChartIcon, Activity } from "lucide-react";

interface PortfolioChartsProps {
  portfolio: Array<{
    coinId: string;
    quantity: number;
    buyPrice: number;
  }>;
  prices: Record<string, number>;
  totalValue: number;
  totalCost: number;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const PortfolioCharts = ({ portfolio, prices, totalValue, totalCost }: PortfolioChartsProps) => {
  // Generate mock historical data (in production, this would come from stored historical records)
  const generateHistoricalData = () => {
    const days = 30;
    const data = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate historical values with some variance
      const variance = 1 + (Math.random() - 0.5) * 0.2; // ±10% variance
      const historicalValue = totalCost * variance * (1 + (days - i) / days * 0.1);
      
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: parseFloat(historicalValue.toFixed(2)),
        cost: totalCost,
      });
    }
    
    // Set today's value to actual current value
    data[data.length - 1].value = totalValue;
    
    return data;
  };

  // Calculate allocation data for pie chart
  const allocationData = portfolio.map((item) => {
    const currentPrice = prices?.[item.coinId] || 0;
    const value = item.quantity * currentPrice;
    return {
      name: item.coinId.charAt(0).toUpperCase() + item.coinId.slice(1),
      value: parseFloat(value.toFixed(2)),
      percentage: totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : "0",
    };
  });

  const historicalData = generateHistoricalData();

  const profitLoss = totalValue - totalCost;
  const profitLossPercent = totalCost > 0 ? ((profitLoss / totalCost) * 100).toFixed(2) : "0";

  // Calculate additional metrics
  const bestPerformer = portfolio.reduce((best, item) => {
    const currentPrice = prices?.[item.coinId] || 0;
    const profitPercent = item.buyPrice > 0 ? ((currentPrice - item.buyPrice) / item.buyPrice) * 100 : 0;
    const bestPercent = best ? ((prices?.[best.coinId] || 0) - best.buyPrice) / best.buyPrice * 100 : -Infinity;
    return profitPercent > bestPercent ? item : best;
  }, portfolio[0]);

  const bestPerformerGain = bestPerformer && prices?.[bestPerformer.coinId]
    ? ((prices[bestPerformer.coinId] - bestPerformer.buyPrice) / bestPerformer.buyPrice * 100).toFixed(2)
    : "0";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover-scale">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                {profitLoss >= 0 ? '+' : ''}{profitLossPercent}%
              </p>
              <p className="text-sm text-muted-foreground">
                ${Math.abs(profitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold capitalize">
                {bestPerformer?.coinId || "N/A"}
              </p>
              <p className={`text-sm ${parseFloat(bestPerformerGain) >= 0 ? 'text-success' : 'text-destructive'}`}>
                {parseFloat(bestPerformerGain) >= 0 ? '+' : ''}{bestPerformerGain}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Asset Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{portfolio.length}</p>
              <p className="text-sm text-muted-foreground">
                Total Assets
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Portfolio Value Over Time */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Portfolio Value (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioCharts;
