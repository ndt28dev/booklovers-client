import StatisticalTopOrder from "../statisticaltoporder/StatisticalTopOrder";
import StatisticalTopUser from "../statisticaltopuser/StatisticalTopUser";

const StatisticalCustomers = () => {
  return (
    <div>
      <StatisticalTopUser />
      <StatisticalTopOrder />
    </div>
  );
};
export default StatisticalCustomers;
