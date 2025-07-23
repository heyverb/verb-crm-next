import { useEffect, useState } from "react";

export const useMount = (time: number = 1200) => {
  const [mounting, setMounting] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setMounting(false);
    }, time);
  }, [time]);

  return { mounting };
};
