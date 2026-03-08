export default function MyLayoutAdmin({ title, children }) {
  return (
    <>
      <h4 style={{ color: "#E35765" }}>{title}</h4>
      {children}
    </>
  );
}
