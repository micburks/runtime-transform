
import React from 'react';

export default function App() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const id = setTimeout(() => {
      setCount(count+1);
    }, 1000);
    return () => clearTimeout(id);
  }, [count]);

  return (
    <div>
      <div>This may be ugly but at least it works</div>
      <div>counter: {count}</div>
    </div>
  );
}
