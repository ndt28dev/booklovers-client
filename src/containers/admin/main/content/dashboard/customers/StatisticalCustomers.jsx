import CustomersCLV from "./contai/CustomersCLV";
import CustomersOverview from "./contai/CustomersOverview";
import CustomersTopOder from "./contai/CustomersTopOder";

const StatisticalCustomers = () => {
  return (
    <div>
      <CustomersOverview />
      <CustomersCLV />
      <CustomersTopOder />
    </div>
  );
};
export default StatisticalCustomers;
