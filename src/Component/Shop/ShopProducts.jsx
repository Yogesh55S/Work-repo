import OurProducts from '../Home/OurProducts';

const Shop = () => {
  return (
    <div>
      {/* Show all products and hide the "View All" button */}
      <OurProducts showAll={true} hideViewAllButton={true} />
    </div>
  );
};

export default Shop;
