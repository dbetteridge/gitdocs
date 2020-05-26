export function handleChange(key, state, setter) {
  return (event, value) => {
    if (value) {
      setter({ ...state, [key]: value.trim() });
    }
    setter({ ...state, [key]: event.target.value.trim() });
  };
}
