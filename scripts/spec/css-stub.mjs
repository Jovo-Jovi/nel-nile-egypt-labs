const handler = {
  get(_target, prop) {
    if (typeof prop === "string") return prop;
    return undefined;
  },
};

const styles = new Proxy({}, handler);
export default styles;
