import "../css/check.css";

function Check() {
  const listt = [1, 2, 3, 4, 5];

  return (
    <div className="outside">
      {listt.map((item, index) => (
        <div className="item" key={index}>
          {item}
        </div>
      ))}
    </div>
  );
}

export default Check;
