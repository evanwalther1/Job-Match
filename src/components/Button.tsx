interface Props {
  color?: "primary" | "secondary";
  children: string;
  onClick: () => void;
}
const Button = ({ color = "primary", children, onClick }: Props) => {
  return (
    <>
      <button className={"btn btn-" + color} onClick={onClick}>
        {children}
      </button>
    </>
  );
};

export default Button;
