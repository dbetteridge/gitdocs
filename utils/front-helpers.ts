export function handleChange(key, state, setter) {
  return (event, value) => {
    if (value) {
      setter({ ...state, [key]: value.trim() });
    }
    setter({ ...state, [key]: event.target.value.trim() });
  };
}

export const timedError = (error, setError, otherFunction) => {
  setError({ hasError: true, error });
  setTimeout(() => {
    setError({ hasError: false, error: "" });
    if (otherFunction && typeof otherFunction === "function") otherFunction();
  }, 1000);
};
