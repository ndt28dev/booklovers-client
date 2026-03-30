import CustomersCLV from "./contai/CustomersCLV";
import CustomersOverview from "./contai/CustomersOverview";
import CustomersShoppingHours from "./contai/CustomersShoppingHours";
import CustomersTopBuy from "./contai/CustomersTopBuy";

const StatisticalCustomers = () => {
  return (
    <div>
      <CustomersOverview />
      <CustomersCLV />
      <CustomersShoppingHours />
      <CustomersTopBuy />
    </div>
  );
};
export default StatisticalCustomers;
