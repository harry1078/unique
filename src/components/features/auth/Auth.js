import { authActions } from "../../../store/slices/auth";
import classes from "./Auth.module.css";
import { useAppDispatch } from "../../../common/hooks/hooks";

const Auth = () => {
  const { login } = authActions;
  const dispatch = useAppDispatch();

  const loginHandler = () => {
    dispatch(login());
  };
  return (
    <main className={classes.auth}>
      <section>
        <form>
          <div className={classes.control}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" />
          </div>
          <button onClick={loginHandler}>Login</button>
        </form>
      </section>
    </main>
  );
};

export default Auth;
