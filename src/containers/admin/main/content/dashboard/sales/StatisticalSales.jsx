import RevenueOverview from "./contai/RevenueOverview";
import OrderStatusOverview from "./contai/OrderStatusOverview";
import RevenueGrowth from "./contai/RevenueGrowth";

const StatisticalSales = () => {
  return (
    <div>
      <RevenueOverview />
      <RevenueGrowth />
      <OrderStatusOverview />
    </div>
  );
};
export default StatisticalSales;
