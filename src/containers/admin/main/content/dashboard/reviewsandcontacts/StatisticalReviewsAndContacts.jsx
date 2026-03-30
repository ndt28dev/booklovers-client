import ContactsOverview from "./contai/ContactsOverview";
import ReviewsOverview from "./contai/ReviewsOverview";
import TopBooksHighestRating from "./contai/TopBooksHighestRating";
import TopBooksLowestRating from "./contai/TopBooksLowestRating";
import TopBooksMostReviews from "./contai/TopBooksMostReviews";

const StatisticalReviewsAndContacts = () => {
  return (
    <div>
      <ContactsOverview />
      <ReviewsOverview />
      <TopBooksMostReviews />
      <TopBooksHighestRating />
      <TopBooksLowestRating />
    </div>
  );
};
export default StatisticalReviewsAndContacts;
