const ProductsOverview = () => {
  return (
    <Row>
      <Col md={3} key={index}>
        <Card
          className="mb-3"
          style={{
            border: "none",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
          }}
        >
          <Card.Body></Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default ProductsOverview;
