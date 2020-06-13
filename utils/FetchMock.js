const fetch = (jest, result) => {
  return jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(result),
      text: () => Promise.resolve(result),
    })
  );
};

export default fetch;
