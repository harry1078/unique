import { useDispatch } from "react-redux";
import classes from "./Counter.module.css";
import { counterActions } from "../../../store/slices/counter";
import { useAppSelector } from "../../../common/hooks/hooks";
import {
  selectCounter,
  selectShow,
} from "../../../store/selectors/rootSelectors";

const Counter = () => {
  const counter = useAppSelector(selectCounter);
  const show = useAppSelector(selectShow);
  const dispatch = useDispatch();
  const { increment, decrement, increase, toggle } = counterActions;
  const incrementHandler = () => {
    dispatch(increment());
  };
  const increaseHandler = () => {
    dispatch(increase(10));
  };
  const decrementHandler = () => {
    dispatch(decrement());
  };

  const toggleCounterHandler = () => {
    dispatch(toggle());
  };
  return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      {show && <div className={classes.value}>{counter}</div>}
      <div>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={increaseHandler}>Increase by 10</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
};

export default Counter;
