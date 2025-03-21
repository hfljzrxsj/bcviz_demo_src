// Create your own history instance.
import { createHashHistory, createBrowserHistory, createMemoryHistory, createPath, parsePath } from "history";
console.log({ createHashHistory, createBrowserHistory, createMemoryHistory, createPath, parsePath });
const history = createHashHistory();

// ... or just import the browser history singleton instance.
// import history from "history/browser";

// Alternatively, if you're using hash history import
// the hash history singleton instance.
// import history from 'history/hash';

// Get the current location.
// const location = history.location;

// Listen for changes to the current location.
history.listen(({ location, action }) => {
  console.log(action, location.pathname, location.state, history.location);
});
// To stop listening, call the function returned from listen().
// unlisten();