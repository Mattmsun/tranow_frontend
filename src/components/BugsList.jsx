import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadBugs, getUnresolvedBugs, resolveBug } from "../store/bugs";

const BugsList = () => {
  const dispatch = useDispatch();
  const resolve = (id) => dispatch(resolveBug(id));
  const bugs = useSelector(getUnresolvedBugs);
  useEffect(() => {
    dispatch(loadBugs());
  }, []);
  console.log(bugs);
  return (
    <ul>
      {bugs.map((bug) => (
        <li key={bug.id}>
          {bug.description}{" "}
          <button onClick={() => resolve(bug.id)}>Resolve</button>
        </li>
      ))}
    </ul>
  );
};
export default BugsList;
