export function omit(list: object[], properties: string[]): object[] {
  list.forEach((item) => {
    properties.forEach((property) => {
      delete item[property];
    });
  });
  return list;
}

export function handleChange(key, state, setter) {
  return (event, value) => {
    if (value) {
      setter({ ...state, [key]: value.trim() });
    }
    setter({ ...state, [key]: event.target.value.trim() });
  };
}
