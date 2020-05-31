import React, { createContext, useReducer } from "react";

const initialState = {
  spaces: [],
  repos: [],
  showNewSpaceForm: false,
  selectedSpace: "",
  selectedRepo: "",
};
const store = createContext(null);

const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "ADDSPACE":
        const newSpaces = state.spaces.concat([action.space]);
        return { ...state, spaces: newSpaces };
      case "SETSPACES":
        const newState = { ...state, spaces: action.spaces };
        return newState;
      case "TOGGLE_NEW_SPACE_FORM":
        return { ...state, showNewSpaceForm: !state.showNewSpaceForm };
      case "SELECT_SPACE":
        return { ...state, selectedSpace: action.space };
      case "ADDREPO":
        const newRepos = state.repos.concat([action.repo]);
        return { ...state, repos: newRepos };
      case "SETREPOS":
        return { ...state, repos: action.repos };
      case "TOGGLE_NEW_REPO_FORM":
        return { ...state, showNewRepoForm: !state.showNewRepoForm };
      case "SELECT_REPO":
        console.log(action);
        return { ...state, selectedRepo: action.repo, repo: action.repoData };
      case "SETDOCS":
        return { ...state, docs: action.docs };
      default:
        return state;
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
