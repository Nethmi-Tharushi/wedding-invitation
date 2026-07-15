export default function Petals() {
  return (
    <div className="petals" aria-hidden="true">
      {Array.from({ length: 20 }, (_, index) => (
        <span
          className="petal"
          key={index}
          style={{
            left: `${(index * 17 + 7) % 100}%`,
            animationDelay: `${(index % 7) * -1.2}s`,
            animationDuration: `${7 + (index % 6) * 1.2}s`,
            width: `${7 + (index % 4) * 3}px`,
            height: `${7 + (index % 4) * 3}px`
          }}
        />
      ))}
    </div>
  );
}
